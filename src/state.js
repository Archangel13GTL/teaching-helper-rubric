/**
 * src/state.js
 *
 * Holds application state and cached DOM nodes.
 */

export const state = {
  currentRubric: 'esl',
  isTeacherView: false,
  scores: {},
  lang: 'en',
  largeText: false
};

export const dom = {
  nav: {
    esl: document.getElementById('nav-esl'),
    general: document.getElementById('nav-general')
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
  importButton: document.getElementById('import-rubric-btn'),
  importInput: document.getElementById('import-rubric-input'),
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

