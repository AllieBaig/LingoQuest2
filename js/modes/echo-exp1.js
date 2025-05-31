
/* 
1) Purpose: Handles Echo Expedition game logic
2) Features: One clue at a time, core letter matching, poetic scroll UI
3) Dependencies: lang/echoexpedition-01.json, profileManager.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-05-31 12:20 | File: js/modes/echoexpedition.js
*/

import { getProfile } from '../profile/profileManager.js';

let expedition = null;
let currentStage = 0;
const categories = ['name', 'place', 'animal', 'thing'];

export async function startEchoExpedition() {
  const gameArea = document.getElementById('gameArea');
  gameArea.hidden = false;
  gameArea.innerHTML = '';

  try {
    const res = await fetch('lang/echoexpedition-01.json');
    expedition = await res.json();
  } catch (e) {
    gameArea.textContent = 'Failed to load expedition scroll.';
    return;
  }

  renderHeader(gameArea);
  renderClue(currentStage);
}

function renderHeader(container) {
  const title = document.createElement('h2');
  title.textContent = `📜 Echo Expedition: ${expedition.theme}`;
  container.appendChild(title);

  const letter = document.createElement('p');
  letter.innerHTML = `<strong>Core Letter:</strong> <span style="font-size: 1.4rem;">${expedition.coreLetter}</span>`;
  container.appendChild(letter);
}

function renderClue(stageIndex) {
  const gameArea = document.getElementById('gameArea');
  const cat = categories[stageIndex];
  const clue = expedition.clues[cat];

  const clueBox = document.createElement('div');
  clueBox.style.marginTop = '2rem';
  clueBox.innerHTML = `
    <h3>🔎 ${cat.charAt(0).toUpperCase() + cat.slice(1)} Clue</h3>
    <p style="font-style: italic; margin-bottom: 1rem;">"${clue}"</p>
    <input type="text" id="inputClue" placeholder="Your answer starts with '${expedition.coreLetter}'" style="font-size: 1.2rem; padding: 0.5rem;" />
    <button id="submitClueBtn" style="margin-left: 1rem;">Submit</button>
    <div id="clueFeedback" style="margin-top: 1rem;"></div>
  `;

  gameArea.appendChild(clueBox);

  document.getElementById('submitClueBtn').addEventListener('click', () => {
    const input = document.getElementById('inputClue').value.trim();
    const correct = expedition.answers[cat];
    const feedback = document.getElementById('clueFeedback');
    const profile = getProfile();

    if (!input || input[0].toUpperCase() !== expedition.coreLetter.toUpperCase()) {
      feedback.textContent = `❌ Must start with "${expedition.coreLetter}". Try again.`;
      return;
    }

    if (input.toLowerCase() === correct.toLowerCase()) {
      feedback.textContent = `✅ Correct!`;
      profile.xp += 15;
      localStorage.setItem('profile', JSON.stringify(profile));
      setTimeout(() => {
        gameArea.innerHTML = '';
        currentStage++;
        if (currentStage < categories.length) {
          renderHeader(gameArea);
          renderClue(currentStage);
        } else {
          renderResult();
        }
      }, 1000);
    } else {
      feedback.textContent = `❌ Not quite. Keep echoing...`;
    }
  });
}

function renderResult() {
  const gameArea = document.getElementById('gameArea');
  gameArea.innerHTML = `
    <h2>🎉 Identity Restored!</h2>
    <p>You’ve pieced together the echoes of the past.</p>
    <ul>
      ${categories.map(cat => {
        const ans = expedition.answers[cat];
        return `<li><strong>${cat}:</strong> ${ans}</li>`;
      }).join('')}
    </ul>
    <p>✨ XP updated. Well done, traveler.</p>
    <button onclick="location.reload()">🔁 Return</button>
  `;
}
