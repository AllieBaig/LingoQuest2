
/* 
1) Purpose: MixLingo game mode — complete sentences with correct foreign words
2) Features: Answer in Language dropdown, XP, difficulty-based MCQs, no repeats
3) Dependencies: modeHelper.js, gameUtils.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 03:05 | File: js/modes/mixlingo.js
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

// Listen for answer language changes
document.addEventListener('answerLangChanged', (e) => {
  currentAnswerLang = e.detail;
  if (currentQuestion) {
    updateMCQAnswers(currentQuestion);
  }
});

export async function startMixLingo() {
  const gameArea = document.getElementById('gameArea');
  if (!gameArea) return showUserError('Game area missing.');
  
  // Setup game area
  gameArea.innerHTML = '';
  gameArea.hidden = false;
  document.getElementById('menuArea').hidden = true;

  renderIngameHead(gameArea);
  renderIngameFoot(gameArea);

  const sources = [
    'lang/mixlingo-en.json',
    'lang/mixlingo-fr.json',
    'lang/mixlingo-de.json'
  ];

  // Load all question sources
  let allQuestions = [];
  for (const src of sources) {
    const questions = await safeLoadQuestions(src);
    allQuestions.push(...questions);
  }

  questionPool = shuffleArray(allQuestions);
  answeredIDs.clear();

  logEvent('game_start', { mode: 'MixLingo', difficulty, totalQuestions: questionPool.length });
  
  // Create sentence builder area if it doesn't exist
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

  let question;
  let attempts = 0;
  const maxAttempts = 50;
  
  // Find an unanswered question
  do {
    question = questionPool[Math.floor(Math.random() * questionPool.length)];
    attempts++;
    if (attempts > maxAttempts) {
      return showCompletion();
    }
  } while (answeredIDs.has(question.id));

  // Verify question structure
  const requiredFields = ['id', 'sentence', 'answers', 'correct'];
  const isValid = verifyQuestionStructure(question, requiredFields);
  
  if (!isValid) {
    console.warn('⚠️ Invalid question skipped:', question);
    answeredIDs.add(question.id); // Skip this bad entry
    return loadNextQuestion();
  }

  currentQuestion = question;
  renderQuestion(question);
}

function renderQuestion(question) {
  const builder = document.getElementById('sentenceBuilderArea');
  if (!builder) return showUserError('Sentence builder area missing.');
  
  builder.innerHTML = '';

  // Display the sentence with blank
  const sentenceDisplay = document.createElement('div');
  sentenceDisplay.className = 'sentence-display';
  
  const sentenceText = document.createElement('p');
  sentenceText.className = 'sentence-text';
  sentenceText.textContent = question.sentence.replace('___', '_____');
  sentenceDisplay.appendChild(sentenceText);
  
  // Add progress indicator
  const progress = document.createElement('div');
  progress.className = 'progress-indicator';
  progress.textContent = `Question ${answeredIDs.size + 1} of ${questionPool.length}`;
  sentenceDisplay.appendChild(progress);
  
  builder.appendChild(sentenceDisplay);

  // Create MCQ options container
  const optionsContainer = document.createElement('div');
  optionsContainer.id = 'mcqOptions';
  optionsContainer.className = 'mcq-options-container';
  builder.appendChild(optionsContainer);

  updateMCQAnswers(question);
}

function updateMCQAnswers(question) {
  const container = document.getElementById('mcqOptions');
  if (!container || !question || !question.answers || !question.correct) {
    return showUserError('Missing question data for MCQ options.');
  }

  container.innerHTML = '';

  const correctAnswer = question.correct[currentAnswerLang];
  const availableOptions = question.answers[currentAnswerLang] || [];

  if (!correctAnswer || !Array.isArray(availableOptions)) {
    return showUserError(`Missing options or correct answer for language: ${currentAnswerLang}`);
  }

  // Create option pool (correct answer + wrong options)
  const wrongOptions = availableOptions.filter(option => option !== correctAnswer);
  const allOptions = [correctAnswer, ...wrongOptions];
  
  // Limit options based on difficulty
  const maxOptions = optionCount[difficulty];
  const selectedOptions = shuffleArray(allOptions).slice(0, maxOptions);
  
  // Ensure correct answer is always included
  if (!selectedOptions.includes(correctAnswer)) {
    selectedOptions[0] = correctAnswer;
  }
  
  // Shuffle final options
  const finalOptions = shuffleArray(selectedOptions);

  finalOptions.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.className = 'mcq-btn';
    button.setAttribute('aria-label', `Option: ${option}`);
    button.addEventListener('click', () => handleAnswer(option, correctAnswer, question.id));
    
    // Add keyboard support
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
    
    container.appendChild(button);
  });
}

function handleAnswer(selected, correct, questionId) {
  const isCorrect = selected === correct;
  
  // Visual feedback through autoCheckMCQ
  const buttons = document.querySelectorAll('.mcq-btn');
  const selectedButton = Array.from(buttons).find(btn => btn.textContent === selected);
  
  if (selectedButton) {
    autoCheckMCQ(selectedButton, isCorrect);
  }
  
  // Handle scoring and logging
  if (isCorrect) {
    const xpGain = getXPForDifficulty();
    addXP(xpGain);
    logEvent('answer_correct', { 
      mode: 'MixLingo',
      id: questionId, 
      selected, 
      difficulty,
      xpGained: xpGain
    });
  } else {
    logEvent('answer_wrong', { 
      mode: 'MixLingo',
      id: questionId, 
      selected, 
      correct,
      difficulty 
    });
  }

  answeredIDs.add(questionId);
  
  // Proceed to next question after delay
  setTimeout(() => {
    loadNextQuestion();
  }, isCorrect ? 1000 : 1500);
}

function getXPForDifficulty() {
  const xpMap = {
    easy: 3,
    medium: 5,
    hard: 8
  };
  return xpMap[difficulty] || 5;
}

function showCompletion() {
  const builder = document.getElementById('sentenceBuilderArea');
  if (!builder) return;
  
  const totalXP = answeredIDs.size * getXPForDifficulty();
  const accuracy = calculateAccuracy();
  
  builder.innerHTML = `
    <div class="completion-screen">
      <h2>🎉 MixLingo Complete!</h2>
      <div class="completion-stats">
        <p><strong>Questions Completed:</strong> ${answeredIDs.size}</p>
        <p><strong>Total XP Earned:</strong> ${totalXP}</p>
        <p><strong>Difficulty:</strong> ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</p>
        ${accuracy ? `<p><strong>Accuracy:</strong> ${accuracy}%</p>` : ''}
      </div>
      <div class="completion-actions">
        <button id="playAgain" class="action-btn">🔄 Play Again</button>
        <button id="backToMenu" class="action-btn">🏠 Main Menu</button>
      </div>
    </div>
  `;

  // Add event listeners for completion actions
  document.getElementById('playAgain')?.addEventListener('click', () => {
    startMixLingo();
  });
  
  document.getElementById('backToMenu')?.addEventListener('click', () => {
    resetToMenu();
  });

  logEvent('game_complete', { 
    mode: 'MixLingo', 
    totalQuestions: answeredIDs.size,
    difficulty,
    totalXP
  });
}

function calculateAccuracy() {
  // This would require tracking correct vs incorrect answers
  // For now, return null - could be enhanced later
  return null;
}

function resetToMenu() {
  document.getElementById('gameArea').hidden = true;
  document.getElementById('menuArea').hidden = false;
  
  // Reset game state
  questionPool = [];
  answeredIDs.clear();
  currentQuestion = null;
}
