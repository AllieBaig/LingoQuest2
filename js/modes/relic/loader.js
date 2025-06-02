
/* 
1) Purpose: Load Relic game mode and start with question set
2) Features: Loads questions, tracks XP, applies difficulty-aware MCQs
3) Dependencies: logic.js, renderer.js, modeHelpers.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 22:30 | File: js/modes/relic/loader.js
*/

import { renderIngameHead, renderIngameFoot, showUserError, verifyQuestionStructure, safeLoadQuestions, shuffleArray, logEvent, addXP } from '../../modeHelpers.js';
import { renderRelicQuestion, showRelicCompletion } from './renderer.js';
import { getMCQOptions } from './logic.js';

let relicQuestions = [];
let answeredIDs = new Set();
let currentQuestion = null;

export async function startRelicGame() {
  const gameArea = document.getElementById('gameArea');
  if (!gameArea) return showUserError('Game area missing.');

  gameArea.innerHTML = '';
  gameArea.hidden = false;
  document.getElementById('menuArea').hidden = true;

  renderIngameHead(gameArea);
  renderIngameFoot(gameArea);

  const path = `lang/relic-en.json`;
  const rawQuestions = await safeLoadQuestions(path);
  relicQuestions = shuffleArray(rawQuestions);
  answeredIDs.clear();

  logEvent('game_start', {
    mode: 'Relic',
    difficulty: localStorage.getItem('game-difficulty') || 'medium',
    totalQuestions: relicQuestions.length
  });

  loadNextRelicQuestion();
}

function loadNextRelicQuestion() {
  if (answeredIDs.size >= relicQuestions.length) return showRelicCompletion();

  let question;
  let tries = 0;
  const maxTries = 40;

  do {
    question = relicQuestions[Math.floor(Math.random() * relicQuestions.length)];
    tries++;
    if (tries > maxTries) return showRelicCompletion();
  } while (answeredIDs.has(question.id));

  const required = ['id', 'riddle', 'answers', 'correct'];
  if (!verifyQuestionStructure(question, required)) {
    answeredIDs.add(question.id);
    return loadNextRelicQuestion();
  }

  currentQuestion = question;
  renderRelicQuestion(question, getMCQOptions(question), handleAnswerSelected);
}

function handleAnswerSelected(isCorrect) {
  if (!currentQuestion) return;
  answeredIDs.add(currentQuestion.id);

  if (isCorrect) {
    addXP(10); // award XP for correct answer
  }

  setTimeout(() => {
    loadNextRelicQuestion();
  }, 800);
}
