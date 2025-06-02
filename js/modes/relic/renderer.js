
/* 
1) Purpose: Render UI for Relic game mode
2) Features: Shows MCQ riddle or emoji questions, handles user answer
3) Dependencies: modeHelpers.js, gameUtils.js, logic.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 22:45 | File: js/modes/relic/renderer.js
*/

import {
  logEvent,
  addXP,
  autoCheckMCQ,
  renderIngameHead,
  renderIngameFoot,
  showUserError,
  verifyQuestionStructure
} from '../../modeHelpers.js';

import { getMCQOptions } from './logic.js';

let currentQuestion = null;
let answeredIDs = new Set();

export function renderRelicGame(questionPool, gameArea) {
  if (!Array.isArray(questionPool) || questionPool.length === 0) {
    return showUserError('No questions available for Relic.');
  }

  renderIngameHead(gameArea);
  renderIngameFoot(gameArea);

  const builder = document.createElement('div');
  builder.id = 'sentenceBuilderArea';
  builder.className = 'sentence-builder-container';
  gameArea.appendChild(builder);

  loadNextRelicQuestion(questionPool, builder);
}

function loadNextRelicQuestion(pool, container) {
  if (answeredIDs.size >= pool.length) {
    return showCompletion(container);
  }

  let tries = 0;
  let question = null;
  const maxTries = 40;

  do {
    question = pool[Math.floor(Math.random() * pool.length)];
    tries++;
    if (tries > maxTries) return showCompletion(container);
  } while (answeredIDs.has(question.id));

  const required = ['id', 'question', 'answers', 'correct'];
  if (!verifyQuestionStructure(question, required)) {
    answeredIDs.add(question.id);
    return loadNextRelicQuestion(pool, container);
  }

  currentQuestion = question;
  renderRelicQuestion(container, question);
}

function renderRelicQuestion(container, question) {
  container.innerHTML = '';

  const heading = document.createElement('h2');
  heading.textContent = '🧩 Solve the Riddle';
  container.appendChild(heading);

  const qText = document.createElement('p');
  qText.className = 'relic-question';
  qText.textContent = question.question;
  container.appendChild(qText);

  const mcqContainer = document.createElement('div');
  mcqContainer.className = 'mcq-options';

  const options = getMCQOptions(question);
  options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'mcq-btn';
    btn.textContent = option;
    btn.addEventListener('click', () => {
      autoCheckMCQ(btn, option, question.correct, () => {
        answeredIDs.add(question.id);
        addXP(10);
        setTimeout(() => loadNextRelicQuestion(window.relicPool, container), 600);
      });
    });
    mcqContainer.appendChild(btn);
  });

  container.appendChild(mcqContainer);
}

function showCompletion(container) {
  container.innerHTML = `
    <div class="completion-message">
      <h2>🎉 All Relics Found!</h2>
      <p>Great job deciphering the clues!</p>
    </div>
  `;
}

