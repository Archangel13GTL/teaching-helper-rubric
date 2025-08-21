/**
 * src/ui.js
 *
 * Rendering, event handling and chart logic.
 */

import { rubricData, translations } from './data.js';
import { state, dom } from './state.js';

// Apply translations for the current language
function applyTranslations() {
  const t = translations[state.lang] || translations.en;
  // Update nav buttons
  dom.nav.esl.textContent = t.nav.esl;
  dom.nav.general.textContent = t.nav.general;
  // Update labels
  dom.studentLabel.textContent = t.student;
  dom.teacherLabel.textContent = t.teacher;
  dom.summaryLabel.textContent = t.summary;
  dom.totalLabel.textContent = t.total;
  dom.notesLabel.textContent = t.notes;
  // Update document lang attribute
  document.documentElement.lang = state.lang;
}

// Calculate a representative score for a given level of a criterion
function calculateScore(criterionName, levelIndex) {
  const rubric = rubricData[state.currentRubric];
  const min = rubric.pointRanges[0][criterionName][levelIndex];
  const max = rubric.pointRanges[1][criterionName][levelIndex];
  return Math.round((min + max) / 2);
}

// Update the total score display and refresh the bar chart
function updateTotalScore() {
  const total = Object.values(state.scores).reduce((sum, v) => sum + v, 0);
  dom.totalScore.textContent = total;
  updateChart();
}

let scoreChart = null;

// Initialize a bar chart with Chart.js
function initChart() {
  const ctx = document.getElementById('score-chart').getContext('2d');
  const data = rubricData[state.currentRubric];
  const maxWeight = Math.max(...data.criteria.map(c => c.weight));
  const styles = getComputedStyle(document.documentElement);
  const accent = styles.getPropertyValue('--accent').trim();
  const active = styles.getPropertyValue('--active').trim();
  scoreChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.criteria.map(c => c.name),
      datasets: [{
        label: 'Points Awarded',
        data: data.criteria.map(() => 0),
        backgroundColor: active,
        borderColor: accent,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          suggestedMax: maxWeight,
          ticks: { precision: 0 }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

// Update bar chart data
function updateChart() {
  if (!scoreChart) return;
  const data = rubricData[state.currentRubric];
  scoreChart.data.labels = data.criteria.map(c => c.name);
  scoreChart.data.datasets[0].data = data.criteria.map(c => state.scores[c.name] || 0);
  scoreChart.update();
}

function updateChartColors() {
  if (!scoreChart) return;
  const styles = getComputedStyle(document.documentElement);
  const accent = styles.getPropertyValue('--accent').trim();
  const active = styles.getPropertyValue('--active').trim();
  scoreChart.data.datasets[0].backgroundColor = active;
  scoreChart.data.datasets[0].borderColor = accent;
  scoreChart.update();
}

// Render the rubric table based on the current rubric and mode
function renderRubric() {
  const data = rubricData[state.currentRubric];
  dom.rubricTitle.textContent = data.title;
  dom.rubricSubtitle.textContent = data.subtitle;
  dom.notes.content.innerHTML = data.notes;
  const isTeacher = state.isTeacherView;
  let html = '<table class="w-full border-collapse">';
  // Header
  html += '<thead><tr class="table-header text-left">';
  html += '<th class="p-3 font-semibold text-sm w-1/5">Criteria</th>';
  const levels = ['Beginning','Developing','Proficient','Excellent'];
  levels.forEach((lvl, idx) => {
    html += `<th class="p-3 font-semibold text-sm ${isTeacher ? 'text-center' : ''}">${idx+1} - ${lvl}</th>`;
  });
  html += '</tr></thead><tbody>';
  data.criteria.forEach(criterion => {
    html += '<tr class="border-b border-[var(--border)]">';
    html += `<th scope="row" class="p-3 font-semibold criterion-cell">${criterion.name}${isTeacher ? ` (${criterion.weight} pts)` : ''}</th>`;
    criterion.levels.forEach((desc, i) => {
      if (isTeacher) {
        const selected = state.scores[criterion.name] === calculateScore(criterion.name, i);
        html += `<td class="p-3 text-sm score-cell ${selected ? 'selected' : ''}" tabindex="0" data-criterion="${criterion.name}" data-level="${i}" aria-pressed="${selected}">${desc}</td>`;
      } else {
        html += `<td class="p-3 text-sm">${desc}</td>`;
      }
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  dom.rubricTableWrapper.innerHTML = html;
  // Show or hide teacher tools
  if (isTeacher) {
    dom.teacherTools.classList.remove('hidden');
    // Add event listeners to cells for scoring
    document.querySelectorAll('.score-cell').forEach(cell => {
      cell.addEventListener('click', onScoreCell);
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onScoreCell(e);
        }
      });
    });
  } else {
    dom.teacherTools.classList.add('hidden');
  }
}

// Handle score selection
function onScoreCell(event) {
  const target = event.currentTarget;
  const criterion = target.dataset.criterion;
  const level = parseInt(target.dataset.level, 10);
  state.scores[criterion] = calculateScore(criterion, level);
  renderRubric();
  updateTotalScore();
}

// Reset scores when switching rubric or mode
function resetScores() {
  const crits = rubricData[state.currentRubric].criteria;
  state.scores = {};
  crits.forEach(c => { state.scores[c.name] = 0; });
}

// Copy total and per-criterion scores to the clipboard
function copyGrades() {
  const rubric = rubricData[state.currentRubric];
  const lines = [`Total: ${dom.totalScore.textContent}`];
  rubric.criteria.forEach(c => {
    const score = state.scores[c.name] || 0;
    lines.push(`${c.name}: ${score}`);
  });
  const text = lines.join('\n');
  navigator.clipboard.writeText(text).catch(err => {
    console.error('Failed to copy grades:', err);
  });
}

// Import rubric JSON and replace current rubric data
function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    try {
      const imported = JSON.parse(evt.target.result);
      rubricData[state.currentRubric] = imported;
      resetScores();
      renderRubric();
      updateTotalScore();
      if (scoreChart) scoreChart.destroy();
      initChart();
      updateChart();
    } catch (err) {
      console.error('Failed to import rubric JSON', err);
      alert('Invalid rubric JSON file.');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

// Handle navigation button clicks
function handleNavClick(e) {
  const rubric = e.target.getAttribute('data-rubric');
  if (rubric && rubric !== state.currentRubric) {
    state.currentRubric = rubric;
    // Update tab classes
    dom.nav.esl.classList.toggle('tab-active', rubric === 'esl');
    dom.nav.esl.classList.toggle('tab-inactive', rubric !== 'esl');
    dom.nav.general.classList.toggle('tab-active', rubric === 'general');
    dom.nav.general.classList.toggle('tab-inactive', rubric !== 'general');
    resetScores();
    renderRubric();
    updateTotalScore();
    // Recreate chart for new rubric
    if (scoreChart) scoreChart.destroy();
    initChart();
    updateChart();
  }
}

// Initialise the app
function init() {
  const storedTheme = localStorage.getItem('theme') || 'neutral';
  applyTheme(storedTheme);

  // Event listeners for nav buttons
  dom.nav.esl.addEventListener('click', handleNavClick);
  dom.nav.general.addEventListener('click', handleNavClick);
  // Import rubric JSON
  dom.importButton.addEventListener('click', () => dom.importInput.click());
  dom.importInput.addEventListener('change', handleImport);
  // Student/Teacher toggle
  dom.viewToggle.addEventListener('change', (e) => {
    state.isTeacherView = e.target.checked;
    resetScores();
    renderRubric();
    updateTotalScore();
  });
  // Text size toggle
  dom.textSizeToggle.addEventListener('click', () => {
    state.largeText = !state.largeText;
    dom.textSizeToggle.setAttribute('aria-pressed', state.largeText);
    document.getElementById('app').classList.toggle('text-lg', state.largeText);
  });
  // Theme toggle
  dom.themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'neutral';
    const next = current === 'pastel' ? 'neutral' : 'pastel';
    applyTheme(next);
  });
  // Notes collapse toggle
  dom.notes.toggle.addEventListener('click', () => {
    const hidden = dom.notes.content.classList.toggle('hidden');
    dom.notes.icon.innerHTML = hidden ? '&#9662;' : '&#9652;';
  });
  // Language selector
  dom.langSelect.value = state.lang;
  dom.langSelect.addEventListener('change', (e) => {
    state.lang = e.target.value;
    applyTranslations();
  });
  // Reset and copy buttons
  dom.resetBtn.addEventListener('click', () => {
    resetScores();
    renderRubric();
    updateTotalScore();
  });
  dom.copyBtn.addEventListener('click', copyGrades);
  // Export PDF
  dom.exportBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');
    doc.html(document.getElementById('rubric-container'), {
      callback: function (doc) {
        doc.save('rubric.pdf');
      },
      margin: [20, 20, 20, 20],
      html2canvas: { scale: 0.75 }
    });
  });
  // Initial setup
  resetScores();
  renderRubric();
  initChart();
  updateTotalScore();
  applyTranslations();
}

document.addEventListener('DOMContentLoaded', init);

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (dom.themeToggle) {
    dom.themeToggle.textContent = theme === 'pastel' ? 'Neutral Theme' : 'Pastel Theme';
  }
  updateChartColors();
}

