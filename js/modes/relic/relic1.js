
/* 
1) Purpose: Entry point for Word Relic mode
2) Loads data, renders UI, handles flow
3) Depends on: loader.js, renderer.js, modeHelpers.js, gameUtils.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 23:57 | File: js/modes/relic/relic.js
*/

import { loadRelicQuestions } from './loader.js';
import { showRelicQuestion } from './renderer.js';
import {
  logEvent,
  renderIngameHead,
  renderIngameFoot,
  showUserError
} from '../modeHelpers.js';

let relicQuestions = [],
    currentIndex = 0;

export async function startRelic() {
  const gameArea = document.getElementById('gameArea');
  if (!gameArea) return showUserError('Missing game container.');

  gameArea.innerHTML = '';
  gameArea.hidden = false;
  document.getElementById('menuArea').hidden = true;

  renderIngameHead(gameArea);
  renderIngameFoot(gameArea);

  const lang = localStorage.getItem('answerLang') || 'en';
  relicQuestions = await loadRelicQuestions(lang);
  currentIndex = 0;

  logEvent('game_start', { mode: 'WordRelic', total: relicQuestions.length });
  showRelicQuestion(relicQuestions[currentIndex], getDifficulty());
}

document.addEventListener('nextQuestion', () => {
  currentIndex++;
  if (currentIndex < relicQuestions.length) {
    showRelicQuestion(relicQuestions[currentIndex], getDifficulty());
  } else {
    showUserError('🎉 You finished all riddles!');
  }
});

function getDifficulty() {
  return localStorage.getItem('game-difficulty') || 'medium';
}
