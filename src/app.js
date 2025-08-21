/*
 * src/app.js
 *
 * Client-side logic for the Teaching Helper Rubric.
 * Provides two rubric templates (ESL and General), a student/teacher mode toggle,
 * a language selector for basic UI labels, theme switching, text size toggle,
 * PDF export and reset/copy tools.
*/

// Define the rubric structures: titles, criteria, point ranges and notes.
const rubricData = {
  esl: {
    title: "ESL Rubric",
    subtitle: "For assessing productive skills (speaking or writing)",
    criteria: [
      { name: "Grammar & Accuracy", weight: 25, levels: [
        "Many errors; meaning often unclear",
        "Frequent errors that sometimes block meaning",
        "Minor errors; mostly correct",
        "Rare errors; complex forms used correctly"
      ] },
      { name: "Vocabulary (Lexical Resource)", weight: 20, levels: [
        "Very limited; struggles to express ideas",
        "Limited range; repetition",
        "Adequate range; occasional misuse",
        "Wide, precise word choice"
      ] },
      { name: "Fluency & Pronunciation*", weight: 25, levels: [
        "Hard to follow; frequent breakdowns",
        "Hesitant; mispronunciations affect clarity",
        "Mostly smooth; occasional pauses/unclear words",
        "Smooth; easy to understand; natural rhythm"
      ] },
      { name: "Coherence / Task Achievement", weight: 20, levels: [
        "Off-task or minimal; disorganized",
        "Partially addresses prompt; loose organization",
        "Mostly addresses prompt; generally organized",
        "Fully addresses prompt; ideas well connected"
      ] },
      { name: "Participation / Effort", weight: 10, levels: [
        "Rarely prepared or engaged",
        "Inconsistent preparation or participation",
        "Usually prepared and engaged",
        "Consistently prepared and engaged"
      ] }
    ],
    pointRanges: [
      { "Grammar & Accuracy": [0, 11, 17, 22], "Vocabulary (Lexical Resource)": [0, 9, 14, 18], "Fluency & Pronunciation*": [0, 11, 17, 22], "Coherence / Task Achievement": [0, 9, 14, 18], "Participation / Effort": [0, 4, 7, 9] },
      { "Grammar & Accuracy": [10, 16, 21, 25], "Vocabulary (Lexical Resource)": [8, 13, 17, 20], "Fluency & Pronunciation*": [10, 16, 21, 25], "Coherence / Task Achievement": [8, 13, 17, 20], "Participation / Effort": [3, 6, 8, 10] }
    ],
    notes: `
      <p class="mb-2"><strong>Assign a level per criterion using descriptors; award points in the range shown.</strong></p>
      <p class="mb-2">*For writing, replace “Fluency & Pronunciation” with <strong>Cohesion & Organization</strong> (same 25 pts weight).</p>
      <p>Weights emphasize real-world communicative ability, aligned with CEFR/IELTS frameworks. Calibrate with 1–2 exemplars per level for reliability.</p>
    `
  },
  general: {
    title: "General Rubric",
    subtitle: "For any subject, performance, or product assessment",
    criteria: [
      { name: "Knowledge & Understanding", weight: 25, levels: [
        "Major misconceptions",
        "Partial/fragmented understanding",
        "Mostly accurate, minor gaps",
        "Explains concepts accurately and completely"
      ] },
      { name: "Application / Problem-Solving", weight: 25, levels: [
        "Cannot apply skills without help",
        "Inconsistent or error-prone application",
        "Generally accurate application",
        "Applies skills accurately and appropriately"
      ] },
      { name: "Reasoning / Critical Thinking", weight: 20, levels: [
        "Little/no analysis; unsupported claims",
        "Limited analysis; weak evidence",
        "Adequate analysis; some evidence",
        "Insightful analysis; strong evidence"
      ] },
      { name: "Communication (Organization/Clarity)", weight: 20, levels: [
        "Disorganized; hard to follow",
        "Somewhat unclear; organization weak",
        "Mostly clear; minor issues",
        "Well-organized; very clear"
      ] },
      { name: "Presentation & Style", weight: 10, levels: [
        "Minimal effort; hard to interpret",
        "Basic effort; inconsistent formatting",
        "Clear formatting; generally readable",
        "Polished presentation; highly engaging"
      ] }
    ],
    pointRanges: [
      { "Knowledge & Understanding": [0, 11, 17, 22], "Application / Problem-Solving": [0, 11, 17, 22], "Reasoning / Critical Thinking": [0, 9, 14, 18], "Communication (Organization/Clarity)": [0, 9, 14, 18], "Presentation & Style": [0, 4, 7, 9] },
      { "Knowledge & Understanding": [10, 16, 21, 25], "Application / Problem-Solving": [10, 16, 21, 25], "Reasoning / Critical Thinking": [8, 13, 17, 20], "Communication (Organization/Clarity)": [8, 13, 17, 20], "Presentation & Style": [3, 6, 8, 10] }
    ],
    notes: `
      <p class="mb-2"><strong>Use for presentations, projects, or written work.</strong></p>
      <p>Adapt criteria descriptions and weights to suit specific tasks or grade levels. Provide exemplars for transparency and consistency.</p>
    `
  }
};

const translations = {
  en: {
    nav: { esl: "ESL Rubric", general: "General Rubric" },
    student: "Student View",
    teacher: "Teacher View",
    summary: "Grading Summary",
    total: "Total Score:",
    notes: "Scoring Notes & Rationale"
  },
  ceb: {
    nav: { esl: "ESL Rubriks", general: "General Rubriks" },
    student: "Tan​‑aw sa Estudyante",
    teacher: "Tan​‑aw sa Magtutudlo",
    summary: "Summaryo sa Paggrado",
    total: "Kinatibuk-ang Iskor:",
    notes: "Mga Notas ug Rasón sa Paggrado"
  }
};

// Application state
const state = {
  currentRubric: 'esl',
  isTeacherView: false,
  scores: {},
  lang: 'en',
  theme: localStorage.getItem('theme') || 'neutral',
  largeText: localStorage.getItem('largeText') === 'true'
};

// Cache DOM elements
const dom = {
  nav: {
    esl: document.getElementById('nav-esl'),
    general: document.getElementById('nav-general'),
    reset: document.getElementById('nav-reset'),
    export: document.getElementById('nav-export'),
    print: document.getElementById('nav-print')
  },
  viewToggle: document.getElementById('view-toggle'),
  textSizeToggle: document.getElementById('text-size-toggle'),
  themeToggle: document.getElementById('theme-toggle'),
  rubricTitle: document.getElementById('rubric-title'),
  rubricSubtitle: document.getElementById('rubric-subtitle'),
  rubricTableWrapper: document.getElementById('rubric-table-wrapper'),
  teacherTools: document.getElementById('teacher-tools'),
  totalScore: document.getElementById('total-score'),
  resetBtn: document.getElementById('reset-scores'),
  copyBtn: document.getElementById('copy-grades'),
  exportBtn: document.getElementById('export-pdf'),
  // charts
  donut: document.getElementById('donut-chart'),
  bars: document.getElementById('bar-chart'),
  // labels to translate
  studentLabel: document.getElementById('student-view-label'),
  teacherLabel: document.getElementById('teacher-view-label'),
  summaryLabel: document.getElementById('grading-summary-label'),
  totalLabel: document.getElementById('total-score-label'),
  notesLabel: document.getElementById('notes-toggle-label'),
  langSelect: document.getElementById('lang-select'),
  notes: {
    toggle: document.getElementById('notes-toggle'),
    content: document.getElementById('notes-content'),
    icon: document.getElementById('notes-icon')
  }
};

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

// Update the total score display and refresh charts
function updateTotalScore() {
  const total = Object.values(state.scores).reduce((sum, v) => sum + v, 0);
  dom.totalScore.textContent = total;
  updateCharts();
}

let barChart = null;
let donutChart = null;

// Initialize bar and donut charts
function initCharts() {
  const data = rubricData[state.currentRubric];
  const maxWeight = Math.max(...data.criteria.map(c => c.weight));
  const styles = getComputedStyle(document.documentElement);
  const accent = styles.getPropertyValue('--accent').trim();
  const active = styles.getPropertyValue('--active').trim();
  const muted = styles.getPropertyValue('--muted').trim();

  // bar chart
  barChart = new Chart(dom.bars.getContext('2d'), {
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

  // donut chart
  const totalPossible = data.criteria.reduce((sum, c) => sum + c.weight, 0);
  donutChart = new Chart(dom.donut.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['Score', 'Remaining'],
      datasets: [{
        data: [0, totalPossible],
        backgroundColor: [accent, muted],
        borderWidth: 0
      }]
    },
    options: { plugins: { legend: { display: false } }, cutout: '70%' }
  });
}

// Update chart data
function updateCharts() {
  const data = rubricData[state.currentRubric];
  if (barChart) {
    barChart.data.labels = data.criteria.map(c => c.name);
    barChart.data.datasets[0].data = data.criteria.map(c => state.scores[c.name] || 0);
    barChart.update();
  }
  if (donutChart) {
    const total = Object.values(state.scores).reduce((sum, v) => sum + v, 0);
    const possible = data.criteria.reduce((sum, c) => sum + c.weight, 0);
    donutChart.data.datasets[0].data = [total, possible - total];
    donutChart.update();
  }
}

function updateChartColors() {
  const styles = getComputedStyle(document.documentElement);
  const accent = styles.getPropertyValue('--accent').trim();
  const active = styles.getPropertyValue('--active').trim();
  const muted = styles.getPropertyValue('--muted').trim();
  if (barChart) {
    barChart.data.datasets[0].backgroundColor = active;
    barChart.data.datasets[0].borderColor = accent;
    barChart.update();
  }
  if (donutChart) {
    donutChart.data.datasets[0].backgroundColor = [accent, muted];
    donutChart.update();
  }
}

// Render the rubric table based on the current rubric and mode
function renderRubric() {
  const data = rubricData[state.currentRubric];
  dom.rubricTitle.textContent = data.title;
  dom.rubricSubtitle.textContent = data.subtitle;
  dom.notes.content.innerHTML = DOMPurify.sanitize(data.notes);
  const isTeacher = state.isTeacherView;
  const fragment = document.createDocumentFragment();
  const table = document.createElement('table');
  table.className = 'w-full border-collapse';

  // Header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.className = 'table-header text-left';
  const critHeader = document.createElement('th');
  critHeader.className = 'p-3 font-semibold text-sm w-1/5';
  critHeader.textContent = 'Criteria';
  headerRow.appendChild(critHeader);
  const levels = ['Beginning','Developing','Proficient','Excellent'];
  levels.forEach((lvl, idx) => {
    const th = document.createElement('th');
    th.className = `p-3 font-semibold text-sm ${isTeacher ? 'text-center' : ''}`;
    th.textContent = `${idx+1} - ${lvl}`;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Body
  const tbody = document.createElement('tbody');
  const rowsFragment = document.createDocumentFragment();
  data.criteria.forEach(criterion => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-[var(--border)]';

    const th = document.createElement('th');
    th.scope = 'row';
    th.className = 'p-3 font-semibold criterion-cell';
    th.textContent = criterion.name + (isTeacher ? ` (${criterion.weight} pts)` : '');
    tr.appendChild(th);

    criterion.levels.forEach((desc, i) => {
      const td = document.createElement('td');
      td.className = 'p-3 text-sm';
      if (isTeacher) {
        td.classList.add('score-cell');
        const selected = state.scores[criterion.name] === calculateScore(criterion.name, i);
        if (selected) td.classList.add('selected');
        td.tabIndex = 0;
        td.dataset.criterion = criterion.name;
        td.dataset.level = i;
        td.setAttribute('aria-pressed', selected);
      }
      td.textContent = desc;
      tr.appendChild(td);
    });

    rowsFragment.appendChild(tr);
  });
  tbody.appendChild(rowsFragment);
  table.appendChild(tbody);

  fragment.appendChild(table);
  dom.rubricTableWrapper.innerHTML = '';
  dom.rubricTableWrapper.appendChild(fragment);

  // Show or hide teacher tools
  if (isTeacher) {
    dom.teacherTools.classList.remove('hidden');
    // Add event listeners to cells for scoring after DOM insertion
    dom.rubricTableWrapper.querySelectorAll('.score-cell').forEach(cell => {
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
  navigator.clipboard.writeText(text)
    .then(() => {
      const originalLabel = dom.copyBtn.textContent;
      dom.copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        dom.copyBtn.textContent = originalLabel;
      }, 2000);
    })
    .catch(err => {
      console.error('Failed to copy grades:', err);
      alert('Failed to copy grades. Please try again.');
    });
}

// Export scores to a CSV file
function exportCSV() {
  const rubric = rubricData[state.currentRubric];
  let csv = 'Criterion,Score\n';
  rubric.criteria.forEach(c => {
    const score = state.scores[c.name] || 0;
    csv += `"${c.name}",${score}\n`;
  });
  csv += `Total,${dom.totalScore.textContent}\n`;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'scores.csv';
  a.click();
  URL.revokeObjectURL(url);
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
    // Recreate charts for new rubric
    if (barChart) barChart.destroy();
    if (donutChart) donutChart.destroy();
    initCharts();
    updateCharts();
  }
}

// Initialise the app
function init() {
  applyTheme(state.theme);

  // Initial text size
  dom.textSizeToggle.setAttribute('aria-pressed', state.largeText);
  document.getElementById('app').classList.toggle('text-lg', state.largeText);

  // Event listeners for nav buttons
  dom.nav.esl.addEventListener('click', handleNavClick);
  dom.nav.general.addEventListener('click', handleNavClick);
  dom.nav.reset.addEventListener('click', () => {
    resetScores();
    renderRubric();
    updateTotalScore();
  });
  dom.nav.export.addEventListener('click', exportCSV);
  dom.nav.print.addEventListener('click', () => window.print());

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
    localStorage.setItem('largeText', state.largeText);
  });
  // Theme toggle
  dom.themeToggle.addEventListener('click', () => {
    const themes = ['neutral', 'pastel', 'dark'];
    const idx = themes.indexOf(state.theme);
    state.theme = themes[(idx + 1) % themes.length];
    applyTheme(state.theme);
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
  // Reset and copy buttons within teacher tools
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
  initCharts();
  updateTotalScore();
  applyTranslations();
}

document.addEventListener('DOMContentLoaded', init);

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (dom.themeToggle) {
    const next = theme === 'neutral' ? 'Pastel' : theme === 'pastel' ? 'Dark' : 'Neutral';
    dom.themeToggle.textContent = `${next} Theme`;
  }
  updateChartColors();
}
