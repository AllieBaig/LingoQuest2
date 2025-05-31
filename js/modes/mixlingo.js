
/* 
1) Purpose: Handles MixLingo game mode logic
2) Features: Loads questions, shows sentence + MCQs, handles XP
3) Dependencies: lang/mixlingo-en.json, profileManager.js
4) Related: Called from main.js when MixLingo is started
5) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
6) Timestamp: 2025-05-31 10:15 | File: js/modes/mixlingo.js
*/

import { getProfile } from '../profile/profileManager.js';

let questionSet = [];
let usedIndexes = new Set();

export async function startMixLingo() {
  const gameArea = document.getElementById('gameArea');
  const menuArea = document.getElementById('menuArea');
  menuArea.hidden = true;
  gameArea.hidden = false;

  /*
  gameArea.innerHTML = `
    <h2>🌍 Welcome to MixLingo Mode</h2>
    <p id="mixSentence"></p>
    <div id="mcqOptions"></div>
    <div id="mixFeedback" style="margin-top: 1rem;"></div>
    <div style="margin-top: 2rem;">
      <button id="backToMenuBtn">🔙 Back to Menu</button>
    </div>
    <div style="margin-top: 1rem;" id="xpStatus"></div>
  `;
  */

  gameArea.innerHTML = `
  <h2>🌍 Welcome to MixLingo Mode</h2>

  <div style="margin-bottom: 1rem;">
    <label for="answerLangSelect"><strong>Answers in Language:</strong></label>
    <select id="answerLangSelect">
      <option value="en">🇬🇧 English</option>
      <option value="fr">🇫🇷 French</option>
      <option value="de">🇩🇪 German</option>
    </select>
  </div>

  <p id="mixSentence"></p>
  <div id="mcqOptions"></div>
  <div id="mixFeedback" style="margin-top: 1rem;"></div>

  <div style="margin-top: 2rem;">
    <button id="backToMenuBtn">🔙 Back to Menu</button>
  </div>
  <div style="margin-top: 1rem;" id="xpStatus"></div>
`;

  document.getElementById('backToMenuBtn').addEventListener('click', () => {
    location.reload(); // temporary simple reset
  });

  await loadQuestions();
  askNextQuestion();
}

/*
async function loadQuestions() {
  try {
    const res = await fetch('lang/mixlingo-en.json');
    const data = await res.json();
    questionSet = shuffle([...data]); // copy + shuffle
  } catch (err) {
    console.error('❌ MixLingo questions could not be loaded:', err);
    document.getElementById('mixSentence').textContent = 'Failed to load questions.';
  }
}
*/

async function loadQuestions() {
  const selectedLang = document.getElementById('answerLangSelect')?.value || 'en';
  try {
    const res = await fetch(`lang/mixlingo-${selectedLang}.json`);
    const data = await res.json();
    questionSet = shuffle([...data]);
  } catch (err) {
    console.error(`❌ MixLingo questions could not be loaded (lang: ${selectedLang})`, err);
    document.getElementById('mixSentence').textContent = 'Failed to load questions.';
  }
}

function askNextQuestion() {
  if (usedIndexes.size === questionSet.length) {
    document.getElementById('mixSentence').textContent = '✅ You’ve completed all questions!';
    return;
  }

  let index;
  do {
    index = Math.floor(Math.random() * questionSet.length);
  } while (usedIndexes.has(index));

  usedIndexes.add(index);
  const q = questionSet[index];

  renderQuestion(q);
}

function renderQuestion(q) {
  const sentence = q.sentence.replace('___', '_____');
  document.getElementById('mixSentence').textContent = sentence;

  const options = shuffle([...q.options]);
  const container = document.getElementById('mcqOptions');
  container.innerHTML = '';

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.style.margin = '0.5rem';
    btn.style.padding = '1rem';
    btn.style.fontSize = '1.2rem';
    btn.addEventListener('click', () => handleAnswer(opt, q.answer));
    container.appendChild(btn);
  });
}

function handleAnswer(selected, correct) {
  const feedback = document.getElementById('mixFeedback');
  const xpStatus = document.getElementById('xpStatus');
  const profile = getProfile();

  if (selected === correct) {
    feedback.textContent = '✅ Correct!';
    profile.xp += 10;
  } else {
    feedback.textContent = `❌ Incorrect. Correct answer: ${correct}`;
    profile.xp = Math.max(profile.xp - 5, 0);
  }

  localStorage.setItem('profile', JSON.stringify(profile));

  xpStatus.textContent = `XP: ${profile.xp} | Level: ${Math.floor(profile.xp / 100) + 1}`;

  setTimeout(() => {
    feedback.textContent = '';
    askNextQuestion();
  }, 1500);
}

// Utility: random shuffle
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
