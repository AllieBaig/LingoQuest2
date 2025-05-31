
/* 
1) Purpose: Echo Expedition game mode — reconstruct identities via 4 prompts
2) Features: Safe JSON load, error UI, XP, MCQs, answerLang switch
3) Dependencies: modeHelpers.js, gameUtils.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 03:00 | File: js/modes/echo-exp.js
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
let currentLang = localStorage.getItem('answerLang') || 'en';
let difficulty = localStorage.getItem('game-difficulty') || 'medium';

const optionCount = {
  easy: 2,
  medium: 3,
  hard: 4
};

document.addEventListener('answerLangChanged', (e) => {
  currentLang = e.detail;
  showCurrentPrompt();
});

export async function startEchoExpedition() {
  const gameArea = document.getElementById('gameArea');
  if (!gameArea) return showUserError('Game area not found.');
  gameArea.innerHTML = '';
  gameArea.hidden = false;

  renderIngameHead();
  renderIngameFoot();

  questions = await safeLoadQuestions('lang/echo-exp.json');
  questions = shuffleArray(questions);
  answeredIDs.clear();
  currentIndex = 0;

  logEvent('game_start', { mode: 'Echo Expedition', difficulty });
  showCurrentPrompt();
}

function showCurrentPrompt() {
  const builder = document.getElementById('sentenceBuilderArea');
  if (!builder) return showUserError('Missing sentence area.');
  builder.innerHTML = '';

  const q = questions[currentIndex];
  if (!q || answeredIDs.has(q.id)) return showSummary();

  const valid = verifyQuestionStructure(q, ['id', 'clues', 'answers', 'choices']);
  if (!valid) return showUserError('Invalid question format.');

  const container = document.createElement('div');
  container.className = 'echo-prompt';

  const heading = document.createElement('h2');
  heading.textContent = `📜 Echo ${currentIndex + 1}`;
  container.appendChild(heading);

  const categories = ['name', 'place', 'animal', 'thing'];

  categories.forEach(cat => {
    const clueText = q.clues?.[cat];
    const correct = q.answers?.[cat]?.[currentLang];
    const pool = q.choices?.[cat]?.[currentLang];

    if (!clueText || !correct || !Array.isArray(pool)) return;

    const section = document.createElement('section');
    section.className = 'echo-section';

    const clue = document.createElement('p');
    clue.textContent = `🔍 ${clueText}`;
    section.appendChild(clue);

    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';

    const shown = shuffleArray([correct, ...pool.filter(w => w !== correct)]).slice(0, optionCount[difficulty]);

    shown.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      btn.className = 'mcq-btn';
      btn.addEventListener('click', () => handleAnswer(opt, correct, q.id, cat));
      btnGroup.appendChild(btn);
    });

    section.appendChild(btnGroup);
    container.appendChild(section);
  });

  builder.appendChild(container);
}

const answeredPerCategory = {};

function handleAnswer(selected, correct, qid, cat) {
  const key = `${qid}-${cat}`;
  if (answeredPerCategory[key]) return;

  const isCorrect = autoCheckMCQ(selected, correct);
  answeredPerCategory[key] = true;

  if (isCorrect) {
    addXP(5);
    logEvent('answer_correct', { mode: 'Echo Expedition', qid, cat, selected });
  } else {
    logEvent('answer_wrong', { mode: 'Echo Expedition', qid, cat, selected, correct });
  }

  const totalAnswered = Object.keys(answeredPerCategory).filter(k => k.startsWith(qid)).length;
  if (totalAnswered === 4) {
    answeredIDs.add(qid);
    currentIndex++;
    setTimeout(showCurrentPrompt, 500);
  }
}

function showSummary() {
  const builder = document.getElementById('sentenceBuilderArea');
  if (!builder) return;
  builder.innerHTML = `
    <h2>✨ Echoes Recovered</h2>
    <p>You’ve completed ${answeredIDs.size} identity scrolls!</p>
    <p>🏺 Your final relic: <strong>${generateRelicName()}</strong></p>
    <p>🧠 You’ve earned XP for every echo solved.</p>
  `;

  logEvent('game_complete', { mode: 'Echo Expedition', total: answeredIDs.size });
}

function generateRelicName() {
  const relics = ['Starbone Idol', 'Icetongue Flare', 'Ashen Bell', 'Sunscript Tablet', 'Whisperwood Mask'];
  return relics[Math.floor(Math.random() * relics.length)];
}
