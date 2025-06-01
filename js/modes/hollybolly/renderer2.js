
/*

Purpose: Handles all UI rendering for HollyBolly game mode

Features: Renders clues (Place, Animal, Thing), question box, and rewards

Depends on: logic.js for currentQuestion and reward handling

MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE

Timestamp: 2025-06-01 23:50 | File: js/modes/hollybolly/renderer.js */


import { currentQuestion, correctStreak, handleAnswer } from './logic.js'; import { optionCount, showUserError, shuffleArray } from '../../modeHelpers.js';

const difficulty = localStorage.getItem('game-difficulty') || 'medium'; const maxOptions = optionCount[difficulty];

export function renderHollyBollyQuestion(container) { if (!currentQuestion) return showUserError('No current question.');

container.innerHTML = '';

const heading = document.createElement('h2'); heading.textContent = '🎥 Guess the Movie!'; container.appendChild(heading);

const clues = document.createElement('div'); clues.className = 'clue-box'; clues.innerHTML = <p>🏞️ <strong>Place:</strong> ${currentQuestion.place}</p> <p>🐾 <strong>Animal:</strong> ${currentQuestion.animal}</p> <p>🎁 <strong>Thing:</strong> ${currentQuestion.thing}</p>; container.appendChild(clues);

const options = [currentQuestion.movie, currentQuestion.bollywood]; const shown = shuffleArray(options).slice(0, maxOptions);

const mcqContainer = document.createElement('div'); mcqContainer.className = 'mcq-options-container';

shown.forEach(option => { const btn = document.createElement('button'); btn.textContent = option; btn.className = 'mcq-btn'; btn.addEventListener('click', () => handleAnswer(option)); mcqContainer.appendChild(btn); });

container.appendChild(mcqContainer); }

export function renderReward(container, rewards) { if (!container || !rewards) return;

const rewardBox = document.createElement('div'); rewardBox.className = 'reward-box';

if (correctStreak >= 1 && rewards.boxOffice) { rewardBox.innerHTML += <p>💰 <strong>Box Office:</strong><br> Hollywood: ${rewards.boxOffice.hollywood}<br> Bollywood: ${rewards.boxOffice.bollywood}</p>; }

if (correctStreak >= 2 && rewards.actorWorth) { rewardBox.innerHTML += <p>🎭 <strong>Main Actor Net Worth:</strong><br> Hollywood: ${rewards.actorWorth.hollywood}<br> Bollywood: ${rewards.actorWorth.bollywood}</p>; }

if (correctStreak >= 3 && rewards.directorWorth) { rewardBox.innerHTML += <p>🎬 <strong>Director Net Worth:</strong><br> Hollywood: ${rewards.directorWorth.hollywood}<br> Bollywood: ${rewards.directorWorth.bollywood}</p>; }

container.appendChild(rewardBox); }

