
/*

1. Purpose: Core logic handler for HollyBolly game mode


2. Responsibilities: Game flow, question progression, answer handling, rewards


3. Dependencies: modeHelpers.js, gameUtils.js, renderer.js


4. Related Files: hollybolly/renderer.js, hollybolly/loader.js, hollybolly.js


5. Special Notes: Tracks streaks for multi-tier rewards


6. MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE


7. Timestamp: 2025-06-01 23:40 | File: js/modes/hollybolly/logic.js */



import { logEvent, addXP, showUserError, verifyQuestionStructure, shuffleArray, optionCount } from '../../modeHelpers.js';

import { autoCheckMCQ, updateXPBar } from '../../gameUtils.js';

import { renderQuestion, showCompletion, showRewards } from './renderer.js';

let questionPool = []; let answeredIDs = new Set(); let currentQuestion = null; let difficulty = localStorage.getItem('game-difficulty') || 'medium'; let streak = 0;

export function startGame(pool) { questionPool = shuffleArray(pool); answeredIDs.clear(); streak = 0; loadNext(); }

function loadNext() { if (answeredIDs.size >= questionPool.length) { return showCompletion(answeredIDs.size); }

let question; let tries = 0; const maxTries = 40;

do { question = questionPool[Math.floor(Math.random() * questionPool.length)]; tries++; if (tries > maxTries) return showCompletion(answeredIDs.size); } while (answeredIDs.has(question.id));

const required = ['id', 'place', 'animal', 'thing', 'movie', 'bollywood', 'rewards']; if (!verifyQuestionStructure(question, required)) { answeredIDs.add(question.id); return loadNext(); }

currentQuestion = question; renderQuestion(question, handleAnswer); }

function handleAnswer(selected, correct) { const isCorrect = selected === correct;

const buttons = document.querySelectorAll('.mcq-btn'); const selectedBtn = Array.from(buttons).find(btn => btn.textContent === selected); if (selectedBtn) autoCheckMCQ(selectedBtn, isCorrect);

const xp = getXP();

if (isCorrect) { streak++; addXP(xp); logEvent('answer_correct', { id: currentQuestion.id, selected, difficulty, xp });

if (streak === 2 || streak === 3) {
  showRewards(currentQuestion.rewards, streak);
}

} else { streak = 0; logEvent('answer_wrong', { id: currentQuestion.id, selected, correct, difficulty }); }

answeredIDs.add(currentQuestion.id); updateXPBar(); setTimeout(loadNext, isCorrect ? 1000 : 1500); }

function getXP() { const map = { easy: 3, medium: 5, hard: 8 }; return map[difficulty] || 5; }

