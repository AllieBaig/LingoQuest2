/* 
1) Purpose: MixLingo game mode — complete sentences with correct foreign words
2) Features: Fast lang fetch, dynamic MCQ answers, XP, difficulty support
3) Dependencies: modeHelpers.js, gameUtils.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 23:55 | File: js/modes/mixlingo.js
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

let questionPool = [];
let answeredIDs = new Set();
let currentQuestion = null;
let currentAnswerLang = localStorage.getItem('answerLang') || 'en';
let difficulty = localStorage.getItem('game-difficulty') || 'medium';

const optionCount = {
  easy: 2,
  medium: 3,
  hard: 4
};

// ⬇️ Listen for answer language change and update MCQs
document.addEventListener('answerLangChanged', (e) => {
  currentAnswerLang = e.detail;
  if (currentQuestion?.id) {
    (async () => {
      const path = `lang/mixlingo-${currentAnswerLang}.json`;
      const freshQuestions = await safeLoadQuestions(path);
      const match = freshQuestions.find(q => q.id === currentQuestion.id);
      if (match) {
        currentQuestion.answers = match.answers;
        currentQuestion.correct = match.correct;
        updateMCQAnswers(currentQuestion);
      } else {
        showUserError(`❌ No translation for this question in ${currentAnswerLang.toUpperCase()}.`);
      }
    })();
  }
});



export async function startMixLingo() {
  const gameArea = document.getElementById('gameArea');
  if (!gameArea) return showUserError('Game area missing.');

  gameArea.innerHTML = '';
  gameArea.hidden = false;
  document.getElementById('menuArea').hidden = true;

  renderIngameHead(gameArea);
  renderIngameFoot(gameArea);

  const path = `lang/mixlingo-${currentAnswerLang}.json`;
  const rawQuestions = await safeLoadQuestions(path);
  questionPool = shuffleArray(rawQuestions);
  
  console.log('Loaded questions:', questionPool);
console.log('🧪 Valid pool length:', questionPool.length);
  
  answeredIDs.clear();

  logEvent('game_start', {
    mode: 'MixLingo',
    difficulty,
    answerLang: currentAnswerLang,
    totalQuestions: questionPool.length
  });

  createSentenceBuilderArea(gameArea);
  loadNextQuestion();
  
}



function createSentenceBuilderArea(gameArea) {
  let builder = document.getElementById('sentenceBuilderArea');
  if (!builder) {
    builder = document.createElement('div');
    builder.id = 'sentenceBuilderArea';
    builder.className = 'sentence-builder-container';
    gameArea.appendChild(builder);
  }
}

function loadNextQuestion() {
  if (answeredIDs.size >= questionPool.length) {
    return showCompletion();
  }
  
  console.log('🧩 answeredIDs:', answeredIDs);

  let question;
  let tries = 0;
  const maxTries = 40;

  do {
    question = questionPool[Math.floor(Math.random() * questionPool.length)];
    tries++;
    if (tries > maxTries) return showCompletion();
  } while (answeredIDs.has(question.id));


if (!question?.id) {
  console.warn('❌ Skipping question with missing id:', question);
  return loadNextQuestion(); // Skip broken entries
}
  

  const required = ['id', 'sentence', 'answers', 'correct'];
  if (!verifyQuestionStructure(question, required)) {
    answeredIDs.add(question.id);
    return loadNextQuestion();
  }

  currentQuestion = question;
  renderQuestion(question);
}

function renderQuestion(question) {
  const builder = document.getElementById('sentenceBuilderArea');
  if (!builder) return showUserError('Missing sentence container.');

  builder.innerHTML = '';

  const sentenceWrap = document.createElement('div');
  sentenceWrap.className = 'sentence-display';

  const sentenceText = document.createElement('p');
  sentenceText.className = 'sentence-text';
  sentenceText.textContent = question.sentence.replace('___', '_____');
  sentenceWrap.appendChild(sentenceText);

  const progress = document.createElement('div');
  progress.className = 'progress-indicator';
  progress.textContent = `Question ${answeredIDs.size + 1} of ${questionPool.length}`;
  sentenceWrap.appendChild(progress);

  builder.appendChild(sentenceWrap);

  const options = document.createElement('div');
  options.id = 'mcqOptions';
  options.className = 'mcq-options-container';
  builder.appendChild(options);

  updateMCQAnswers(question);
}

function updateMCQAnswers(question) {
  const container = document.getElementById('mcqOptions');
  if (!container || !question?.answers || !question.correct) {
    return showUserError('Missing question answer data.');
  }

  container.innerHTML = '';

  const correct = question.correct[currentAnswerLang];
  const options = question.answers[currentAnswerLang] || [];

  if (!correct || !Array.isArray(options)) {
    return showUserError(`No valid answers for ${currentAnswerLang.toUpperCase()}.`);
  }

  const wrong = options.filter(o => o !== correct);
  const pool = [correct, ...wrong];
  const selected = shuffleArray(pool).slice(0, optionCount[difficulty]);

  if (!selected.includes(correct)) selected[0] = correct;
  const final = shuffleArray(selected);

  final.forEach(word => {
    const btn = document.createElement('button');
    btn.textContent = word;
    btn.className = 'mcq-btn';
    btn.addEventListener('click', () => handleAnswer(word, correct, question.id));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
    container.appendChild(btn);
  });
}

function handleAnswer(selected, correct, id) {
  const isRight = selected === correct;
  const btns = document.querySelectorAll('.mcq-btn');
  const btn = [...btns].find(b => b.textContent === selected);
  if (btn) autoCheckMCQ(btn, isRight);

  if (isRight) {
    const xp = getXPForDifficulty();
    addXP(xp);
    logEvent('answer_correct', { mode: 'MixLingo', id, selected, difficulty, xp });
  } else {
    logEvent('answer_wrong', { mode: 'MixLingo', id, selected, correct, difficulty });
  }

  answeredIDs.add(id);
  setTimeout(loadNextQuestion, isRight ? 1000 : 1500);
}

function getXPForDifficulty() {
  return { easy: 3, medium: 5, hard: 8 }[difficulty] || 5;
}

function showCompletion() {
  const builder = document.getElementById('sentenceBuilderArea');
  if (!builder) return;

  const totalXP = answeredIDs.size * getXPForDifficulty();

  builder.innerHTML = `
    <div class="completion-screen">
      <h2>🎉 MixLingo Complete!</h2>
      <p><strong>Questions:</strong> ${answeredIDs.size}</p>
      <p><strong>Total XP:</strong> ${totalXP}</p>
      <p><strong>Difficulty:</strong> ${difficulty.toUpperCase()}</p>
      <div class="completion-actions">
        <button id="playAgain" class="action-btn">🔄 Play Again</button>
        <button id="backToMenu" class="action-btn">🏠 Main Menu</button>
      </div>
    </div>
  `;

  document.getElementById('playAgain')?.addEventListener('click', startMixLingo);
  document.getElementById('backToMenu')?.addEventListener('click', resetToMenu);

  logEvent('game_complete', {
    mode: 'MixLingo',
    totalQuestions: answeredIDs.size,
    difficulty,
    totalXP
  });
}

function resetToMenu() {
  document.getElementById('gameArea').hidden = true;
  document.getElementById('menuArea').hidden = false;
  questionPool = [];
  answeredIDs.clear();
  currentQuestion = null;
}
