
/* 
1) Purpose: Load and initialize MixLingo mode
2) Part of: Modular MixLingo (loader.js)
3) Depends on: renderer.js, logic.js, state.js, gameUtils.js, modeHelpers.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-02 18:05 | File: js/modes/mixlingo/loader.js
*/

import { renderMixLingoHead, renderMixLingoFoot, createSentenceBuilderArea } from './renderer.js';
import { loadNextQuestion } from './logic.js';
import { safeLoadQuestions, shuffleArray } from '../../modeHelpers.js';
import { logEvent } from '../../gameUtils.js';
import { resetMixLingoState, answeredIDs, questionPool } from './state.js';

// ✅ Exported so other modules can read the current language and difficulty
export let currentAnswerLang = localStorage.getItem('answerLang') || 'en';
export let difficulty = localStorage.getItem('game-difficulty') || 'medium';

export async function startMixLingo() {
  const gameArea = document.getElementById('gameArea');
  if (!gameArea) {
    console.warn('Game area missing.');
    return;
  }

  gameArea.innerHTML = '';
  gameArea.hidden = false;
  document.getElementById('menuArea').hidden = true;

  renderMixLingoHead(gameArea);
  renderMixLingoFoot(gameArea);
  createSentenceBuilderArea(gameArea);

  const path = `lang/mixlingo-${currentAnswerLang}.json`;
  const rawQuestions = await safeLoadQuestions(path);

  resetMixLingoState();
  questionPool.push(...shuffleArray(rawQuestions));

  logEvent('game_start', {
    mode: 'MixLingo',
    difficulty,
    answerLang: currentAnswerLang,
    totalQuestions: questionPool.length,
  });

  loadNextQuestion();
}

// ✅ Update language on dropdown change (from ingameFoot or header)
window.addEventListener('answerLangChanged', (e) => {
  currentAnswerLang = e.detail || 'en';
});
