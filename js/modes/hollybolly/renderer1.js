
/*

Purpose: Render question UI for HollyBolly game mode

Features: Displays Place, Animal, Thing clues + MCQ options

Depends on: modeHelpers.js (shuffle, error), gameUtils.js (autoCheckMCQ)

MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE

Timestamp: 2025-06-01 23:55 | File: js/modes/hollybolly/renderer.js */


import { optionCount, showUserError, shuffleArray } from '../../modeHelpers.js'; import { autoCheckMCQ } from '../../gameUtils.js';

export function renderQuestionView(question, difficulty, onAnswer) { const builder = document.getElementById('sentenceBuilderArea'); if (!builder) return showUserError('Missing game area.'); builder.innerHTML = '';

// Heading const heading = document.createElement('h2'); heading.textContent = '🎥 Guess the Movie!'; builder.appendChild(heading);

// Clue list const list = document.createElement('ul'); list.className = 'hollybolly-clues';

const clues = [ { label: '🏞️ Place', text: question.place }, { label: '🐾 Animal', text: question.animal }, { label: '🎁 Thing', text: question.thing } ];

clues.forEach(({ label, text }) => { const item = document.createElement('li'); item.textContent = ${label}: ${text}; list.appendChild(item); }); builder.appendChild(list);

// MCQ buttons const mcqContainer = document.createElement('div'); mcqContainer.className = 'mcq-options-container'; builder.appendChild(mcqContainer);

const allOptions = [question.movie, ...question.distractors]; const max = optionCount[difficulty] || 3; const selected = shuffleArray(allOptions).slice(0, max);

if (!selected.includes(question.movie)) selected[0] = question.movie;

const final = shuffleArray(selected);

final.forEach(opt => { const btn = document.createElement('button'); btn.className = 'mcq-btn'; btn.textContent = opt; btn.setAttribute('aria-label', opt);

btn.addEventListener('click', () => {
  const isCorrect = opt === question.movie;
  autoCheckMCQ(btn, isCorrect);
  onAnswer(isCorrect, question);
});

btn.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    btn.click();
  }
});

mcqContainer.appendChild(btn);

}); }

