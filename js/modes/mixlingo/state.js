
/* 
1) Purpose: Centralized state management for MixLingo game mode
2) Features: Holds shared state (questionPool, currentQuestion, answeredIDs, etc.)
3) Used in: mixlingo/loader.js, mixlingo/logic.js, mixlingo/renderer.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 23:45 | File: js/modes/mixlingo/state.js
*/

export let questionPool = [];
export let currentQuestion = null;
export let answeredIDs = new Set();
export let currentAnswerLang = localStorage.getItem('answerLang') || 'en';
export let difficulty = localStorage.getItem('game-difficulty') || 'medium';

/**
 * Resets all MixLingo game state variables
 */
export function resetMixLingoState() {
  questionPool = [];
  currentQuestion = null;
  answeredIDs = new Set();
  currentAnswerLang = localStorage.getItem('answerLang') || 'en';
  difficulty = localStorage.getItem('game-difficulty') || 'medium';
}
