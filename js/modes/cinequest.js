
/* 
1) Purpose: CineQuest mode — guess movie from Place, Animal, Thing clues
2) Features: Decade filter, MCQs, XP, no repeats
3) Dependencies: modeHelpers.js, gameUtils.js, dataLoader.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 21:10 | File: js/modes/cinequest.js
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

let questions = [];
let currentIndex = 0;
let answeredIDs = new Set();
let difficulty = localStorage.getItem('game-difficulty') || 'medium';
let selectedDecade = localStorage.getItem('cinequest-decade') || 'all';

const optionCount = {
  easy: 2,
  medium: 3,
  hard: 4
};

// Listen to decade filter changes
document.addEventListener('cinequestDecadeChanged', (e) => {
  selectedDecade = e.detail;
  localStorage.setItem('cinequest-decade', selectedDecade);
  startCineQuest();
});

export async function startCineQuest() {
  const gameArea = document.getElementById('gameArea');
  if (!gameArea) return showUserError('Game area missing.');
  gameArea.innerHTML = '';
  gameArea.hidden = false;
  document.getElementById('menuArea').hidden = true;

  renderIngameHead(gameArea);
  renderIngameFoot(gameArea);

  const data = await safeLoadQuestions('lang/cinequest-en.json');
  questions = shuffleArray(data.filter(q =>
    selectedDecade === 'all' || q.decade === selectedDecade
  ));

  answeredIDs.clear();
  currentIndex = 0;

  if (!questions.length) {
    return showUserError('No questions found for selected decade.');
  }

  logEvent('game_start', {
    mode: 'CineQuest',
    difficulty,
    selectedDecade,
    totalQuestions: questions.length
  });

  showCurrentQuestion();
}

function showCurrentQuestion() {
  const builder = document.getElementById('sentenceBuilderArea');
  if (!builder) return showUserError('Missing game area.');
  builder.innerHTML = '';

  const question = questions[currentIndex];
  if (!question || answeredIDs.has(question.id)) {
    return showCompletion();
  }

  const valid = verifyQuestionStructure(question, ['id', 'movie', 'clues', 'options']);
  if (!valid) {
    answeredIDs.add(question.id);
    return showCurrentQuestion();
  }

  const container = document.createElement('div');
  container.className = 'cinequest-container';

  const clues = ['place', 'animal', 'thing'];
  clues.forEach(clue => {
    const para = document.createElement('p');
    para.textContent = {
      place: `🏞️ ${question.clues.place}`,
      animal: `🐾 ${question.clues.animal}`,
      thing: `🎁 ${question.clues.thing}`
    }[clue];
    container.appendChild(para);
  });

  const options = question.options || [];
  const correct = question.movie;
  const maxOpts = optionCount[difficulty];
  const shown = shuffleArray([correct, ...options.filter(o => o !== correct)]).slice(0, maxOpts);

  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'btn-group';

  shown.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.className = 'mcq-btn';
    btn.onclick = () => handleAnswer(opt, correct, question.id);
    buttonGroup.appendChild(btn);
  });

  container.appendChild(buttonGroup);
  builder.appendChild(container);
}

function handleAnswer(selected, correct, qid) {
  const isCorrect = autoCheckMCQ(selected, correct);
  answeredIDs.add(qid);

  if (isCorrect) {
    addXP(5);
    logEvent('answer_correct', { mode: 'CineQuest', qid, selected });
  } else {
    logEvent('answer_wrong', { mode: 'CineQuest', qid, selected, correct });
  }

  currentIndex++;
  setTimeout(showCurrentQuestion, isCorrect ? 900 : 1300);
}

function showCompletion() {
  const builder = document.getElementById('sentenceBuilderArea');
  if (!builder) return;

  builder.innerHTML = `
    <div class="completion-screen">
      <h2>🎬 CineQuest Complete!</h2>
      <p><strong>Decade:</strong> ${selectedDecade}</p>
      <p><strong>Movies Guessed:</strong> ${answeredIDs.size}</p>
      <p><strong>XP Earned:</strong> ${answeredIDs.size * 5}</p>
      <button class="action-btn" onclick="location.reload()">🔄 Replay</button>
      <button class="action-btn" onclick="window.location.href='index.html'">🏠 Menu</button>
    </div>
  `;

  logEvent('game_complete', {
    mode: 'CineQuest',
    decade: selectedDecade,
    total: answeredIDs.size
  });
}
