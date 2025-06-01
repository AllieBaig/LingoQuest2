
/* 
1) Purpose: MixLingo game mode — complete sentences with correct foreign words
2) Features: Answer in Language dropdown, XP, difficulty-based MCQs, no repeats
3) Dependencies: modeHelpers.js, gameUtils.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 03:05 | File: js/modes/mixlingo.js
*/

import {
  safeLoadQuestions,
  shuffleArray,
  showUserError,
  verifyQuestionStructure
} from '../modeHelpers.js';

import {
  logEvent,
  addXP,
  autoCheckMCQ,
  renderIngameHead,
  renderIngameFoot
} from '../gameUtils.js';

let questionPool = [];
let answeredIDs = new Set();
let currentQuestion = null;
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
  if (!gameArea) return showUserError('Game area missing.');
  gameArea.innerHTML = '';
  gameArea.hidden = false;

  renderIngameHead();
  renderIngameFoot();

  const sources = [
    'lang/mixlingo-en.json',
    'lang/mixlingo-fr.json',
    'lang/mixlingo-de.json'
  ];

  let all = [];
  for (let src of sources) {
    const q = await safeLoadQuestions(src);
    all.push(...q);
  }

  questionPool = shuffleArray(all);
  answeredIDs.clear();

  logEvent('game_start', { mode: 'MixLingo', difficulty });
  loadNextQuestion();
}

function loadNextQuestion() {
  if (answeredIDs.size >= questionPool.length) {
    return showCompletion();
  }

  let q;
  let attempts = 0;
  do {
    q = questionPool[Math.floor(Math.random() * questionPool.length)];
    attempts++;
    if (attempts > 50) {
      return showCompletion();
    }
  } while (answeredIDs.has(q.id));

  const valid = verifyQuestionStructure(q, ['id', 'sentence', 'answers', 'correct']);
  if (!valid) {
    answeredIDs.add(q.id); // skip bad entry
    return loadNextQuestion();
  }

  currentQuestion = q;
  renderQuestion(q);
}

function renderQuestion(q) {
  const builder = document.getElementById('sentenceBuilderArea');
  if (!builder) return showUserError('Sentence builder missing.');
  builder.innerHTML = '';

  const clue = document.createElement('p');
  clue.textContent = q.sentence.replace('___', '_____');
  builder.appendChild(clue);

  const container = document.createElement('div');
  container.id = 'mcqOptions';
  builder.appendChild(container);

  updateMCQAnswers(q);
}

function updateMCQAnswers(q) {
  const container = document.getElementById('mcqOptions');
  if (!container || !q || !q.answers || !q.correct) return;

  container.innerHTML = '';

  const correct = q.correct[currentAnswerLang];
  const options = q.answers[currentAnswerLang] || [];

  if (!correct || !Array.isArray(options)) {
    return showUserError('Missing options or correct answer.');
  }

  const count = optionCount[difficulty];
  const shown = shuffleArray([correct, ...options.filter(w => w !== correct)]).slice(0, count);

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
  if (!builder) return;
  builder.innerHTML = `
    <h2>🎉 All MixLingo questions completed!</h2>
    <p>You’ve explored all available sentences. Well done!</p>
  `;

  logEvent('game_complete', { mode: 'MixLingo', total: answeredIDs.size });
}
