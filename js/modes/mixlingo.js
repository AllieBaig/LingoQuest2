/* 
1) Purpose: MixLingo game mode (fill-in-the-blank with foreign word)
2) Features: MCQs by difficulty, answer language toggle, XP, no repeats
3) Dependencies: questionPool.js, mcqAutoCheck.js, profileManager.js, eventLogger.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-05-31 23:59 | File: js/modes/mixlingo.js
*/

import { getMixLingoQuestions } from '../utils/questionPool.js';
import { autoCheckMCQ as autoAttachMCQEvents } from '../utils/mcqAutoCheck.js';
//import { autoCheckMCQ } from '../utils/mcqAutoCheck.js';
//import { autoCheckMCQ } from '../mcqAutoCheck.js';
import { addXP } from '../profile/profileManager.js';
import { logEvent } from '../tools/eventLogger.js';
import { renderIngameHead } from '../ui/ingameHead.js';
import { renderIngameFoot } from '../ui/ingameFoot.js';

let currentIndex = 0;
let questionPool = [];
let answeredIDs = new Set();
let currentAnswerLang = localStorage.getItem('answerLang') || 'en';
let currentQuestion = null;
let difficulty = localStorage.getItem('game-difficulty') || 'medium';

const optionCount = {
  easy: 2,
  medium: 3,
  hard: 4
};

document.addEventListener('answerLangChanged', (e) => {
  currentAnswerLang = e.detail;
  if (currentQuestion) {
    updateMCQAnswers(currentQuestion);
  }
});

export async function startMixLingo() {
  const gameArea = document.getElementById('gameArea');
  gameArea.innerHTML = '';
  gameArea.hidden = false;

  renderIngameHead();
  renderIngameFoot();

  questionPool = await getMixLingoQuestions();
  currentIndex = 0;
  answeredIDs.clear();

  loadNextQuestion();
  logEvent('game_start', { mode: 'MixLingo', difficulty });
}

function loadNextQuestion() {
  if (answeredIDs.size >= questionPool.length) {
    showCompletion();
    return;
  }

  let q;
  do {
    q = questionPool[Math.floor(Math.random() * questionPool.length)];
  } while (answeredIDs.has(q.id));

  currentQuestion = q;
  renderQuestion(q);
}

function renderQuestion(q) {
  const builder = document.getElementById('sentenceBuilderArea');
  builder.innerHTML = '';

  const clue = document.createElement('p');
  clue.textContent = q.sentence.replace('___', '_____');
  builder.appendChild(clue);

  const optionsContainer = document.createElement('div');
  optionsContainer.id = 'mcqOptions';
  builder.appendChild(optionsContainer);

  updateMCQAnswers(q);
}

function updateMCQAnswers(q) {
  const container = document.getElementById('mcqOptions');
  if (!container) return;
  container.innerHTML = '';

  const allOptions = q.answers[currentAnswerLang] || [];
  const correct = q.correct[currentAnswerLang];
  const count = optionCount[difficulty];
  const shown = shuffleArray([correct, ...allOptions.filter(w => w !== correct)]).slice(0, count);

  shown.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.className = 'mcq-btn';
    btn.addEventListener('click', () => {
      handleAnswer(opt, correct, q.id);
    });
    container.appendChild(btn);
  });
}

function handleAnswer(selected, correct, id) {
  const isCorrect = autoCheckMCQ(selected, correct);
  if (isCorrect) {
    addXP(5);
    logEvent('answer_correct', { id, selected });
  } else {
    logEvent('answer_wrong', { id, selected, correct });
  }

  answeredIDs.add(id);
  setTimeout(loadNextQuestion, 500);
}

function showCompletion() {
  const builder = document.getElementById('sentenceBuilderArea');
  builder.innerHTML = `
    <h2>✅ You've completed all MixLingo questions!</h2>
    <p>🎉 Great job! Try a new mode or replay again later.</p>
  `;

  logEvent('game_complete', { mode: 'MixLingo', total: answeredIDs.size });
}

// Helper
function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

