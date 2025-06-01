
/* 
1) Purpose: MixLingo entry point — initializes game mode and sets up UI
2) Part of: Modular MixLingo (mixlingo.js)
3) Depends on: renderer.js, logic.js, state.js, gameUtils.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-02 00:15 | File: js/modes/mixlingo/mixlingo.js
*/

import { questionPool, answeredIDs, currentAnswerLang, difficulty } from './state.js';
import { safeLoadQuestions, shuffleArray } from '../../modeHelpers.js';
import { createSentenceBuilderArea } from './renderer.js';
import { loadNextQuestion } from './logic.js';
import { renderIngameHead, renderIngameFoot, logEvent } from '../../gameUtils.js';

export async function startMixLingo() {
  const gameArea = document.getElementById('gameArea');
  if (!gameArea) return console.warn('❌ Game area missing');

  gameArea.innerHTML = '';
  gameArea.hidden = false;
  document.getElementById('menuArea').hidden = true;

  renderIngameHead(gameArea);
  renderIngameFoot(gameArea);
  createSentenceBuilderArea(gameArea);

  const path = `lang/mixlingo-${currentAnswerLang.value}.json`;
  const rawQuestions = await safeLoadQuestions(path);
  questionPool.length = 0;
  questionPool.push(...shuffleArray(rawQuestions));
  answeredIDs.clear();

  logEvent('game_start', {
    mode: 'MixLingo',
    difficulty,
    answerLang: currentAnswerLang.value,
    totalQuestions: questionPool.length
  });

  loadNextQuestion();
}
