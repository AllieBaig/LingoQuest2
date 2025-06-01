
/* 
1) Purpose: Relic Mode (MCQ + Riddles/Emojis with XP + Reward)
2) Clue Types: Riddle + Emoji-based. XP based on correct MCQ answers.
3) Depends on: gameUtils.js, modeLoader.js, dataLoader.js, questionPool.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 07:50 | File: scripts/modes/relic.js
*/

import {
  logEvent,
  addXP,
  autoCheckMCQ,
  renderIngameHead,
  renderIngameFoot
} from '../gameUtils.js';

import { loadJSON, shuffleArray, showError } from '../utils/dataLoader.js';

let relicQuestions = [];
let currentIndex = 0;
let answeredIds = new Set();

export async function startRelic() {
  logEvent('game_started', { mode: 'Relic' });

  document.getElementById('menuArea').hidden = true;
  document.getElementById('gameArea').hidden = false;
  const container = document.getElementById('gameArea');
  container.innerHTML = '';

  renderIngameHead(container);
  renderIngameFoot(container);

  try {
    const lang = localStorage.getItem('ui-answers') || 'en';
    const data = await loadJSON(`lang/relic-${lang}.json`);
    if (!Array.isArray(data)) throw new Error('Invalid relic question format');

    relicQuestions = shuffleArray(data).filter(q => !answeredIds.has(q.id));
    currentIndex = 0;

    showRelicPrompt(container);
  } catch (e) {
    showError(`❌ Failed to load Relic mode: ${e.message}`);
  }
}

function showRelicPrompt(container) {
  if (currentIndex >= relicQuestions.length) {
    return showRelicReward(container);
  }

  const q = relicQuestions[currentIndex];
  if (!q || !q.question || !q.choices || !Array.isArray(q.choices)) {
    console.warn('⚠️ Invalid question skipped', q);
    currentIndex++;
    showRelicPrompt(container);
    return;
  }

  container.innerHTML = ''; // clear for current prompt
  renderIngameHead(container);
  renderIngameFoot(container);

  const clue = document.createElement('p');
  clue.className = 'relic-clue';
  clue.textContent = q.question;

  const options = document.createElement('div');
  options.className = 'mcq-options';

  const difficulty = localStorage.getItem('ui-difficulty') || 'easy';
  const maxOptions = { easy: 2, medium: 3, hard: 4 }[difficulty] || 2;

  const choices = shuffleArray(q.choices).slice(0, maxOptions);

  choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.textContent = choice;
    btn.addEventListener('click', () => {
      const correct = choice === q.answer;
      autoCheckMCQ(btn, correct);
      if (correct) {
        addXP(10);
        answeredIds.add(q.id);
        setTimeout(() => {
          currentIndex++;
          showRelicPrompt(container);
        }, 800);
      } else {
        setTimeout(() => autoCheckMCQ(btn, correct, true), 300);
      }
    });
    options.appendChild(btn);
  });

  container.appendChild(clue);
  container.appendChild(options);
}

function showRelicReward(container) {
  logEvent('game_completed', { mode: 'Relic', total: answeredIds.size });

  const msg = document.createElement('div');
  msg.className = 'relic-reward';
  msg.innerHTML = `
    <h3>🔓 You've discovered a hidden Relic!</h3>
    <p>🧠 You solved <strong>${answeredIds.size}</strong> riddles and earned relic wisdom.</p>
    <button id="backToMenu">🔙 Back to Menu</button>
  `;

  container.innerHTML = '';
  container.appendChild(msg);

  document.getElementById('backToMenu')?.addEventListener('click', () => {
    location.reload(); // or use a proper reset if implemented
  });
}

