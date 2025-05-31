

/* 
1) Purpose: Echo Expedition mode with MCQ answers, XP, and relics
2) Features: XP for correct answers, relic based on score
3) Dependencies: questionPool.js, eventLogger.js, profileManager.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-05-31 23:40 | File: js/modes/echo-exp.js
*/

import { getEchoExpQuestions } from '../questionPool.js';
import { logEvent } from '../tools/eventLogger.js';
import { renderIngameHead } from '../ui/ingameHead.js';
import { addXP } from '../profile/profileManager.js';

let currentIndex = 0;
let questions = [];
let userAnswers = {};
let score = 0;
let difficulty = localStorage.getItem('game-difficulty') || 'medium';

const optionCount = {
  easy: 2,
  medium: 3,
  hard: 4
};

export async function startEchoExpedition() {
  const gameArea = document.getElementById('gameArea');
  gameArea.innerHTML = '';
  gameArea.hidden = false;

  renderIngameHead();
  questions = await getEchoExpQuestions();
  currentIndex = 0;
  userAnswers = {};
  score = 0;

  showNextPrompt();
  logEvent('game_start', { mode: 'Echo Expedition', difficulty });
}

function showNextPrompt() {
  const q = questions[currentIndex];
  const gameArea = document.getElementById('gameArea');
  gameArea.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = `Echo ${currentIndex + 1}: ${q.theme} (Letter: ${q.letter})`;

  const form = document.createElement('form');
  form.id = 'echoForm';

  ['name', 'place', 'animal', 'thing'].forEach(key => {
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = q.prompts[key];
    fieldset.appendChild(legend);

    const correct = q.answers[key];
    const options = q.choices[key].slice(0, optionCount[difficulty]);

    options.forEach(opt => {
      const label = document.createElement('label');
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = key;
      radio.value = opt;
      radio.required = true;

      label.appendChild(radio);
      label.append(` ${opt}`);
      fieldset.appendChild(label);
      fieldset.appendChild(document.createElement('br'));
    });

    form.appendChild(fieldset);
  });

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = currentIndex < questions.length - 1 ? 'Next Echo' : 'Reveal Identity';

  form.addEventListener('submit', e => {
    e.preventDefault();

    const answers = {};
    ['name', 'place', 'animal', 'thing'].forEach(key => {
      const selected = form[key].value;
      answers[key] = selected;
      if (selected === q.answers[key]) {
        score++;
      }
    });

    userAnswers[`echo-${currentIndex + 1}`] = {
      theme: q.theme,
      letter: q.letter,
      ...answers
    };

    logEvent('echo_submit', userAnswers[`echo-${currentIndex + 1}`]);

    currentIndex++;
    if (currentIndex < questions.length) {
      showNextPrompt();
    } else {
      const xpEarned = score * 5;
      addXP(xpEarned);
      showSummary(xpEarned);
    }
  });

  gameArea.appendChild(title);
  gameArea.appendChild(form);
}

function showSummary(xpEarned) {
  const gameArea = document.getElementById('gameArea');
  gameArea.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = 'Echo Expedition Complete';
  gameArea.appendChild(title);

  const xp = document.createElement('p');
  xp.innerHTML = `✅ Correct: <strong>${score}</strong> / ${questions.length * 4} &nbsp; 🧠 XP Earned: <strong>${xpEarned}</strong>`;
  gameArea.appendChild(xp);

  Object.entries(userAnswers).forEach(([id, data]) => {
    const card = document.createElement('div');
    card.className = 'echo-summary';

    card.innerHTML = `
      <h3>${id.toUpperCase()} – ${data.theme} (Letter: ${data.letter})</h3>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Place:</strong> ${data.place}</p>
      <p><strong>Animal:</strong> ${data.animal}</p>
      <p><strong>Thing:</strong> ${data.thing}</p>
    `;

    gameArea.appendChild(card);
  });

  const relic = document.createElement('div');
  relic.className = 'relic';

  relic.innerHTML = `
    <h2>🪶 Word Relic Unlocked!</h2>
    <p>You uncovered the Echo Relic of <strong>${generateRelicName()}</strong> based on your journey.</p>
  `;

  gameArea.appendChild(relic);

  logEvent('game_complete', {
    mode: 'Echo Expedition',
    score,
    xp: xpEarned,
    answers: userAnswers
  });
}

function generateRelicName() {
  const relics = ['Icetongue Flare', 'Whisperbrand Totem', 'Echoleaf Scroll', 'Stormveil Drum', 'Dustmirror Token', 'Skyglyph Ring'];
  return relics[Math.floor(Math.random() * relics.length)];
}
