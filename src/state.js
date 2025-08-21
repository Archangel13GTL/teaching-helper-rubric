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
  const min = rubric.pointRanges[0][criterionName][levelIndex];
  const max = rubric.pointRanges[1][criterionName][levelIndex];
  return Math.round((min + max) / 2);
}

export function resetScores() {
  const crits = rubricData[state.currentRubric].criteria;
  state.scores = {};
  crits.forEach(c => { state.scores[c.name] = 0; });
}
