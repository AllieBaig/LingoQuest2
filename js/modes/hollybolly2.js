
/* 
1) Purpose: HollyBolly game mode — decode Bollywood remakes of Hollywood films
2) Features: Clue-based MCQs, XP rewards, tiered rewards (box office, actor worth, director worth)
3) Dependencies: modeHelpers.js, gameUtils.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 23:45 | File: js/modes/hollybolly.js
*/

import {
  logEvent,
  addXP,
  autoCheckMCQ,
  renderIngameHead,
  renderIngameFoot,
  showUserError,
  verifyQuestionStructure,
  safeLoadQuestions,
  shuffleArray,
  optionCount
} from '../modeHelpers.js';

let questionPool = [];
let answeredIDs = new Set();
let currentQuestion = null;
let difficulty = localStorage.getItem('game-difficulty') || 'medium';
let streak = 0;

export async function startHollyBolly() {
  const gameArea = document.getElementById('gameArea');
  if (!gameArea) return showUserError('Game area missing.');

  gameArea.innerHTML = '';
  gameArea.hidden = false;
  document.getElementById('menuArea').hidden = true;

  renderIngameHead(gameArea);
  renderIngameFoot(gameArea);

  const questions = await safeLoadQuestions('lang/hollybolly-en.json');
  questionPool = shuffleArray(questions);
  answeredIDs.clear();
  streak = 0;

  createSentenceBuilderArea(gameArea);
  loadNextQuestion();
}

function createSentenceBuilderArea(gameArea) {
  let builder = document.getElementById('sentenceBuilderArea');
  if (!builder) {
    builder = document.createElement('div');
    builder.id = 'sentenceBuilderArea';
    builder.className = 'sentence-builder-container';
    gameArea.appendChild(builder);
  }
}

function loadNextQuestion() {
  if (answeredIDs.size >= questionPool.length) return showCompletion();

  let question;
  let tries = 0;
  const maxTries = 50;

  do {
    question = questionPool[Math.floor(Math.random() * questionPool.length)];
    tries++;
  } while (answeredIDs.has(question.id) && tries < maxTries);

  if (!verifyQuestionStructure(question, ['id', 'place', 'animal', 'thing', 'movie'])) {
    answeredIDs.add(question.id);
    return loadNextQuestion();
  }

  currentQuestion = question;
  renderQuestion(question);
}

function renderQuestion(q) {
  const builder = document.getElementById('sentenceBuilderArea');
  if (!builder) return showUserError('Missing sentence container.');

  builder.innerHTML = `
    <div class="clue-box">
      <p>🏞️ <strong>Place:</strong> ${q.place}</p>
      <p>🐾 <strong>Animal:</strong> ${q.animal}</p>
      <p>🎁 <strong>Thing:</strong> ${q.thing}</p>
    </div>
    <div class="mcq-options-container" id="mcqOptions"></div>
  `;

  const options = shuffleArray([q.movie, q.bollywood, '3 Idiots', 'Dhoom 3', 'PK', 'Pathaan']);
  const shown = shuffleArray(options).slice(0, optionCount[difficulty]);
  if (!shown.includes(q.movie)) shown[0] = q.movie;

  const final = shuffleArray(shown);
  const container = document.getElementById('mcqOptions');

  final.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'mcq-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleAnswer(opt, q.movie, q));
    container.appendChild(btn);
  });
}

function handleAnswer(selected, correct, question) {
  const isCorrect = selected === correct;
  const buttons = document.querySelectorAll('.mcq-btn');

  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) btn.classList.add('correct');
    if (btn.textContent === selected && !isCorrect) btn.classList.add('wrong');
  });

  if (isCorrect) {
    streak++;
    addXP(getXP());
    logEvent('answer_correct', { mode: 'HollyBolly', id: question.id, selected, streak });
    showReward(question, streak);
  } else {
    streak = 0;
    logEvent('answer_wrong', { mode: 'HollyBolly', id: question.id, selected, correct });
  }

  answeredIDs.add(question.id);
  setTimeout(loadNextQuestion, 1600);
}

function showReward(q, streak) {
  const reward = q.rewards;
  const builder = document.getElementById('sentenceBuilderArea');
  if (!reward || !builder) return;

  const box = document.createElement('div');
  box.className = 'reward-box';

  if (streak >= 1 && reward.boxOffice) {
    box.innerHTML += `<p>💰 Box Office:<br>🎬 Hollywood: ${reward.boxOffice.hollywood}<br>🎞️ Bollywood: ${reward.boxOffice.bollywood}</p>`;
  }
  if (streak >= 2 && reward.actorWorth) {
    box.innerHTML += `<p>👤 Actor Worth:<br>Hollywood: ${reward.actorWorth.hollywood}<br>Bollywood: ${reward.actorWorth.bollywood}</p>`;
  }
  if (streak >= 3 && reward.directorWorth) {
    box.innerHTML += `<p>🎬 Director Worth:<br>Hollywood: ${reward.directorWorth.hollywood}<br>Bollywood: ${reward.directorWorth.bollywood}</p>`;
  }

  builder.appendChild(box);
}

function showCompletion() {
  const builder = document.getElementById('sentenceBuilderArea');
  if (!builder) return;

  builder.innerHTML = `
    <div class="completion-screen">
      <h2>🌟 HollyBolly Complete!</h2>
      <p>Total Questions: ${answeredIDs.size}</p>
      <p>Difficulty: ${difficulty}</p>
      <button class="action-btn" onclick="location.reload()">🔄 Play Again</button>
    </div>
  `;
}
