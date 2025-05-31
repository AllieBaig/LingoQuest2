
/* 
1) Purpose: MixLingo game mode — choose correct word in a sentence
2) Features: MCQ by difficulty, answerLang switch, XP, no repeat
3) Dependencies: dataLoader.js, gameUtils.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 02:30 | File: js/modes/mixlingo.js
*/

import { loadMultipleJSON } from '../dataLoader.js';
import { logEvent, addXP, autoCheckMCQ, renderIngameHead, renderIngameFoot } from '../gameUtils.js';

let questionPool = [];
let answeredIDs = new Set();
let currentQuestion = null;
let currentIndex = 0;
let currentAnswerLang = localStorage.getItem('answerLang') || 'en';
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

  questionPool = await loadMultipleJSON([
    'lang/mixlingo-en.json',
    'lang/mixlingo-fr.json',
    'lang/mixlingo-de.json'
  ]);
  answeredIDs.clear();
  currentIndex = 0;

  logEvent('game_start', { mode: 'MixLingo', difficulty });
  loadNextQuestion();
}

function loadNextQuestion() {
  if (answeredIDs.size >= questionPool.length) {
    return showCompletion();
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
    btn.addEventListener('click', () => handleAnswer(opt, correct, q.id));
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

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
