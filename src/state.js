import { rubricData } from './rubric-data.js';

export const state = {
  currentRubric: 'esl',
  isTeacherView: false,
  scores: {},
  lang: 'en',
  theme: localStorage.getItem('theme') || 'neutral',
  largeText: localStorage.getItem('largeText') === 'true'
};

export function calculateScore(criterionName, levelIndex) {
  const rubric = rubricData[state.currentRubric];
  const criterion = rubric.criteria.find(c => c.name === criterionName);
  const scale = [0, 0.6, 0.8, 1.0];
  return Math.round((criterion?.weight || 0) * scale[levelIndex]);
}

export function resetScores() {
  const crits = rubricData[state.currentRubric].criteria;
  state.scores = {};
  crits.forEach(c => { state.scores[c.name] = 0; });
}
