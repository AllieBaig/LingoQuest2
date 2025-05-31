
/* 
1) Purpose: Echo Expedition mode — reconstruct lost identities
2) Features: 4-part MCQ clues, XP, answerLang switch, no repeats, relic reward
3) Dependencies: dataLoader.js, gameUtils.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 02:40 | File: js/modes/echo-exp.js
*/

import { loadJSON } from '../dataLoader.js';
import { logEvent, addXP, autoCheckMCQ, renderIngameHead, renderIngameFoot } from '../gameUtils.js';

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
  if (questions[currentIndex]) {
    showCurrentPrompt();
  }
});

export async function startEchoExpedition() {
  const gameArea = document.getElementById('gameArea');
  gameArea.innerHTML = '';
  gameArea.hidden = false;

  renderIngameHead();
  renderIngameFoot();

  try {
    questions = await loadJSON('lang/echo-exp.json');
    
    // Add safety check for loaded data
    if (!questions || !Array.isArray(questions)) {
      console.error('Failed to load questions or questions is not an array:', questions);
      showError('Failed to load game data. Please try again.');
      return;
    }
    
    if (questions.length === 0) {
      console.error('Questions array is empty');
      showError('No questions available. Please check the game data.');
      return;
    }
    
    questions = shuffleArray(questions);
    currentIndex = 0;
    answeredIDs.clear();

    logEvent('game_start', { mode: 'Echo Expedition', difficulty });

    showCurrentPrompt();
  } catch (error) {
    console.error('Error loading Echo Expedition data:', error);
    showError('Failed to load game data. Please refresh and try again.');
  }
}

function showError(message) {
  const builder = document.getElementById('sentenceBuilderArea');
  builder.innerHTML = `
    <div class="error-message">
      <h2>⚠️ Error</h2>
      <p>${message}</p>
      <button onclick="location.reload()">Refresh Page</button>
    </div>
  `;
}

function showCurrentPrompt() {
  const builder = document.getElementById('sentenceBuilderArea');
  builder.innerHTML = '';

  const q = questions[currentIndex];
  if (!q || answeredIDs.has(q.id)) {
    return showSummary();
  }

  const container = document.createElement('div');
  container.className = 'echo-prompt';

  const heading = document.createElement('h2');
  heading.textContent = `📜 Echo ${currentIndex + 1}`;
  container.appendChild(heading);

  const clues = ['name', 'place', 'animal', 'thing'];

  clues.forEach((cat) => {
    const clueText = q.clues[cat];
    const correct = q.answers[cat][currentLang];
    const pool = q.choices[cat][currentLang] || [];
    
    // Add safety check for choices
    if (!pool || !Array.isArray(pool)) {
      console.warn(`Missing or invalid choices for category ${cat}:`, pool);
      return;
    }
    
    const shown = shuffleArray([correct, ...pool.filter(c => c !== correct)]).slice(0, optionCount[difficulty]);

    const section = document.createElement('section');
    section.className = 'echo-section';

    const clue = document.createElement('p');
    clue.textContent = `🔍 ${clueText}`;
    section.appendChild(clue);

    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';

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
  builder.innerHTML = `
    <h2>✨ Echoes Recovered</h2>
    <p>You've completed ${answeredIDs.size} identity scrolls!</p>
    <p>🏺 Your final relic: <strong>${generateRelicName()}</strong></p>
    <p>🧠 Great memory! You've earned XP for every echo solved.</p>
  `;

  logEvent('game_complete', { mode: 'Echo Expedition', total: answeredIDs.size });
}

function generateRelicName() {
  const relics = ['Starbone Idol', 'Icetongue Flare', 'Ashen Bell', 'Sunscript Tablet', 'Whisperwood Mask'];
  return relics[Math.floor(Math.random() * relics.length)];
}

function shuffleArray(arr) {
  // Add safety check to prevent the error
  if (!arr || !Array.isArray(arr)) {
    console.error('shuffleArray: received non-array:', arr);
    return [];
  }
  return [...arr].sort(() => Math.random() - 0.5);
}
