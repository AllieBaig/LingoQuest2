/* 
1) Purpose: Handles MixLingo game mode logic
2) Features: Loads sentences, shows MCQs in selected language, prevents repeats
3) Dependencies: questionPool.js, mcqAutoCheck.js, langManager.js
4) Related: Controlled by dropdown in ingameFoot.js (Answers In Language)
5) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
6) Timestamp: 2025-05-31 14:10 | File: js/modes/mixlingo.js
*/

import { getMixLingoQuestions } from '../utils/questionPool.js';
import { autoAttachMCQEvents } from '../utils/mcqAutoCheck.js';

let allQuestions = [];
let currentQuestion = null;
let ansSet = new Set(); // Prevent repeats
let answerLang = localStorage.getItem('answer-lang') || 'en'; // 'en', 'fr', 'de'

export async function startMixLingo() {
  const gameArea = document.getElementById('gameArea');
  gameArea.hidden = false;
  gameArea.innerHTML = '';

  ansSet = new Set(); // reset on new session

  allQuestions = await getMixLingoQuestions(); // combined pool
  loadNextQuestion();

  // Setup dropdown listener for answer language changes
  const answerLangDropdown = document.getElementById('answerLangDropdown');
  if (answerLangDropdown) {
    answerLangDropdown.addEventListener('change', (e) => {
      answerLang = e.target.value;
      localStorage.setItem('answer-lang', answerLang);
      if (currentQuestion) updateMCQOptions(currentQuestion); // reload options only
    });
  }
}

function loadNextQuestion() {
  const remaining = allQuestions.filter(q => !ansSet.has(q.id));
  const gameArea = document.getElementById('gameArea');

  if (remaining.length === 0) {
    gameArea.innerHTML = '<p>🎉 All questions completed. Great job!</p>';
    return;
  }

  const randomQ = remaining[Math.floor(Math.random() * remaining.length)];
  currentQuestion = randomQ;
  renderQuestion(randomQ);
}

function renderQuestion(q) {
  const gameArea = document.getElementById('gameArea');
  gameArea.innerHTML = '';

  const cluePara = document.createElement('p');
  cluePara.innerHTML = `🧠 <strong>Complete:</strong> ${q.sentence.replace('___', '____')}`;

  const mcqContainer = document.createElement('div');
  mcqContainer.id = 'mcqArea';

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'mcqOption';
    btn.setAttribute('data-correct', opt === q.correct);
    btn.setAttribute('data-option', opt);
    btn.textContent = opt; // Will be replaced by answerLang if needed
    mcqContainer.appendChild(btn);
  });

  gameArea.appendChild(cluePara);
  gameArea.appendChild(mcqContainer);

  autoAttachMCQEvents(mcqContainer, (isCorrect, selectedText) => {
    if (isCorrect) {
      ansSet.add(q.id);
      setTimeout(() => loadNextQuestion(), 1000);
    }
  });

  updateMCQOptions(q); // immediately apply language setting
}

function updateMCQOptions(q) {
  const buttons = document.querySelectorAll('#mcqArea .mcqOption');
  buttons.forEach((btn) => {
    const base = btn.getAttribute('data-option');
    // Replace with foreign word in selected language if available
    if (q.translations && q.translations[answerLang] && q.translations[answerLang][base]) {
      btn.textContent = q.translations[answerLang][base];
    } else {
      btn.textContent = base;
    }
  });
}
