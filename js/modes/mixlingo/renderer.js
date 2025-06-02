
/* 
1) Purpose: Render MixLingo UI — sentence, options, completion screen
2) Part of: Modular MixLingo (renderer.js)
3) Depends on: state.js, logic.js, gameUtils.js, modeHelpers.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-02 00:00 | File: js/modes/mixlingo/renderer.js
*/

import { answeredIDs, currentQuestion, difficulty } from './state.js';
import { autoCheckMCQ, addXP, logEvent } from '../../gameUtils.js';
import { optionCount, showUserError } from '../../modeHelpers.js';
import { loadNextQuestion } from './logic.js';



// 🧩 Ingame Head UI for MixLingo
export function renderMixLingoHead(container) {
  const header = document.createElement('div');
  header.className = 'ingame-head-extra';

  header.innerHTML = `
    <label for="answerLang">Answers in Language:</label>
    <select id="answerLang">
      <option value="en">🇬🇧 English</option>
      <option value="fr">🇫🇷 Français</option>
      <option value="de">🇩🇪 Deutsch</option>
    </select>
  `;

  container.appendChild(header);

  const langSelect = header.querySelector('#answerLang');
  langSelect.value = localStorage.getItem('mixlingo-answerLang') || 'fr';
  langSelect.addEventListener('change', (e) => {
    localStorage.setItem('mixlingo-answerLang', e.target.value);
    window.dispatchEvent(new Event('mixlingoLangChanged'));
  });
}

// 🧩 Ingame Foot UI for MixLingo (optional extra controls)
export function renderMixLingoFoot(container) {
  const footNote = document.createElement('div');
  footNote.className = 'ingame-foot-note';
  footNote.innerHTML = `<p>🌐 Select the language in which answer options appear.</p>`;
  container.appendChild(footNote);
}


/*
export function renderMixLingoFoot(container) {
  const footer = document.createElement('div');
  footer.className = 'ingame-foot-extra';
  footer.innerHTML = `
    <label for="answerLang">Answers in Language:</label>
    <select id="answerLang">
      <option value="en">🇬🇧 English</option>
      <option value="fr">🇫🇷 Français</option>
      <option value="de">🇩🇪 Deutsch</option>
    </select>
  `;
  container.appendChild(footer);

  const langSelect = footer.querySelector('#answerLang');
  langSelect.value = localStorage.getItem('mixlingo-answerLang') || 'fr';
  langSelect.addEventListener('change', (e) => {
    localStorage.setItem('mixlingo-answerLang', e.target.value);
    window.dispatchEvent(new Event('mixlingoLangChanged'));
  });
}
*/


export function createSentenceBuilderArea(gameArea) {
  let builder = document.getElementById('sentenceBuilderArea');
  if (!builder) {
    builder = document.createElement('div');
    builder.id = 'sentenceBuilderArea';
    builder.className = 'sentence-builder-container';
    gameArea.appendChild(builder);
  }
}

export function renderQuestion(question, answerLang) {
  const builder = document.getElementById('sentenceBuilderArea');
  if (!builder) return showUserError('Missing sentence container.');

  builder.innerHTML = '';

  const sentenceDisplay = document.createElement('div');
  sentenceDisplay.className = 'sentence-display';

  const sentenceText = document.createElement('p');
  sentenceText.className = 'sentence-text';
  sentenceText.textContent = question.sentence.replace('___', '_____');
  sentenceDisplay.appendChild(sentenceText);

  const progress = document.createElement('div');
  progress.className = 'progress-indicator';
  progress.textContent = `Question ${answeredIDs.size + 1} of ${window.questionPool?.length || '?'}`;
  sentenceDisplay.appendChild(progress);

  builder.appendChild(sentenceDisplay);

  const optionsContainer = document.createElement('div');
  optionsContainer.id = 'mcqOptions';
  optionsContainer.className = 'mcq-options-container';
  builder.appendChild(optionsContainer);

  updateMCQAnswers(question, answerLang);
}

export function updateMCQAnswers(question, answerLang) {
  const container = document.getElementById('mcqOptions');
  if (!container || !question || !question.answers || !question.correct) {
    return showUserError('Missing data for MCQ options.');
  }

  container.innerHTML = '';

  const correctAnswer = question.correct[answerLang];
  const availableOptions = question.answers[answerLang] || [];

  if (!correctAnswer || !Array.isArray(availableOptions)) {
    return showUserError(`Missing options or correct answer for language: ${answerLang}`);
  }

  const wrongOptions = availableOptions.filter(opt => opt !== correctAnswer);
  const allOptions = [correctAnswer, ...wrongOptions];
  const maxOptions = optionCount[difficulty];
  const selected = allOptions.slice(0, maxOptions);

  if (!selected.includes(correctAnswer)) {
    selected[0] = correctAnswer;
  }

  const finalOptions = selected.sort(() => Math.random() - 0.5);

  finalOptions.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'mcq-btn';
    btn.textContent = option;
    btn.setAttribute('aria-label', `Option: ${option}`);
    btn.addEventListener('click', () => handleAnswer(option, correctAnswer, question.id));
    btn.addEventListener('keydown', (e) => {
      if (['Enter', ' '].includes(e.key)) {
        e.preventDefault();
        btn.click();
      }
    });
    container.appendChild(btn);
  });
}

function handleAnswer(selected, correct, questionId) {
  const isCorrect = selected === correct;
  const buttons = document.querySelectorAll('.mcq-btn');
  const selectedBtn = [...buttons].find(b => b.textContent === selected);

  if (selectedBtn) {
    autoCheckMCQ(selectedBtn, isCorrect);
  }

  if (isCorrect) {
    const xp = getXPForDifficulty();
    addXP(xp);
    logEvent('answer_correct', { mode: 'MixLingo', id: questionId, selected, difficulty, xpGained: xp });
  } else {
    logEvent('answer_wrong', { mode: 'MixLingo', id: questionId, selected, correct, difficulty });
  }

  answeredIDs.add(questionId);

  setTimeout(() => {
    loadNextQuestion();
  }, isCorrect ? 1000 : 1500);
}

function getXPForDifficulty() {
  const xpMap = { easy: 3, medium: 5, hard: 8 };
  return xpMap[difficulty] || 5;
}

export function renderCompletionScreen() {
  const builder = document.getElementById('sentenceBuilderArea');
  if (!builder) return;

  const totalXP = answeredIDs.size * getXPForDifficulty();

  builder.innerHTML = `
    <div class="completion-screen">
      <h2>🎉 MixLingo Complete!</h2>
      <div class="completion-stats">
        <p><strong>Questions Completed:</strong> ${answeredIDs.size}</p>
        <p><strong>Total XP Earned:</strong> ${totalXP}</p>
        <p><strong>Difficulty:</strong> ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</p>
      </div>
      <div class="completion-actions">
        <button id="playAgain" class="action-btn">🔄 Play Again</button>
        <button id="backToMenu" class="action-btn">🏠 Main Menu</button>
      </div>
    </div>
  `;

  document.getElementById('playAgain')?.addEventListener('click', () => {
    location.reload();
  });

  document.getElementById('backToMenu')?.addEventListener('click', () => {
    document.getElementById('gameArea').hidden = true;
    document.getElementById('menuArea').hidden = false;
  });
}
