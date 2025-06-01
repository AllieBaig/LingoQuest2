
/*

1. Purpose: HollyBolly mode — match iconic Place, Animal, Thing to film title


2. Features: MCQ-based with difficulty-aware options, shows Bollywood/Hollywood earnings


3. Dependencies: modeHelpers.js, gameUtils.js


4. MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE


5. Timestamp: 2025-06-01 23:45 | File: js/modes/hollybolly.js */



import { logEvent, addXP, autoCheckMCQ, renderIngameHead, renderIngameFoot, showUserError, verifyQuestionStructure, safeLoadQuestions, shuffleArray, optionCount } from '../modeHelpers.js';

let questionPool = []; let answeredIDs = new Set(); let currentQuestion = null; let difficulty = localStorage.getItem('game-difficulty') || 'medium';

export async function startHollyBolly() { const gameArea = document.getElementById('gameArea'); if (!gameArea) return showUserError('Game area missing.');

gameArea.innerHTML = ''; gameArea.hidden = false; document.getElementById('menuArea').hidden = true;

renderIngameHead(gameArea); renderIngameFoot(gameArea);

const rawQuestions = await safeLoadQuestions('lang/hollybolly-en.json'); questionPool = shuffleArray(rawQuestions); answeredIDs.clear();

logEvent('game_start', { mode: 'HollyBolly', difficulty, totalQuestions: questionPool.length });

createSentenceBuilderArea(gameArea); loadNextQuestion(); }

function createSentenceBuilderArea(gameArea) { let builder = document.getElementById('sentenceBuilderArea'); if (!builder) { builder = document.createElement('div'); builder.id = 'sentenceBuilderArea'; builder.className = 'sentence-builder-container'; gameArea.appendChild(builder); } }

function loadNextQuestion() { if (answeredIDs.size >= questionPool.length) { return showCompletion(); }

let tries = 0; let question; do { question = questionPool[Math.floor(Math.random() * questionPool.length)]; tries++; if (tries > 40) return showCompletion(); } while (answeredIDs.has(question.id));

const required = ['id', 'movie', 'clues', 'answers', 'earnings']; if (!verifyQuestionStructure(question, required)) { answeredIDs.add(question.id); return loadNextQuestion(); }

currentQuestion = question; renderQuestion(question); }

function renderQuestion(q) { const builder = document.getElementById('sentenceBuilderArea'); if (!builder) return showUserError('Missing sentence area'); builder.innerHTML = '';

const container = document.createElement('div'); container.className = 'quiz-card';

const heading = document.createElement('h2'); heading.textContent = 🎥 Guess the Movie!; container.appendChild(heading);

const clues = ['place', 'animal', 'thing'];

clues.forEach((cat) => { const clue = q.clues[cat]; const correct = q.answers[cat]; const pool = shuffleArray([correct, ...(q.choices?.[cat] || [])]); const shown = pool.slice(0, optionCount[difficulty]);

const section = document.createElement('section');
section.className = 'mcq-section';

const clueText = document.createElement('p');
clueText.textContent = `${getEmoji(cat)} ${clue}`;
section.appendChild(clueText);

const group = document.createElement('div');
group.className = 'btn-group';

shown.forEach(opt => {
  const btn = document.createElement('button');
  btn.textContent = opt;
  btn.className = 'mcq-btn';
  btn.addEventListener('click', () => handleAnswer(opt, correct, q.id, cat));
  group.appendChild(btn);
});

section.appendChild(group);
container.appendChild(section);

});

builder.appendChild(container); }

function handleAnswer(selected, correct, id, cat) { const key = ${id}-${cat}; if (answeredIDs.has(key)) return;

const isCorrect = autoCheckMCQ(selected, correct); if (isCorrect) addXP(5);

logEvent(isCorrect ? 'answer_correct' : 'answer_wrong', { mode: 'HollyBolly', id, cat, selected, correct });

answeredIDs.add(key);

const catCount = ['place', 'animal', 'thing'].filter(c => answeredIDs.has(${id}-${c})).length; if (catCount === 3) { answeredIDs.add(id); setTimeout(() => showRewardBox(id), 600); } }

function showRewardBox(id) { const q = questionPool.find(x => x.id === id); if (!q) return loadNextQuestion();

const builder = document.getElementById('sentenceBuilderArea'); builder.innerHTML = <div class="reward-box"> <h2>🎬 Answer: ${q.movie}</h2> <p>💰 Bollywood Box Office: ₹${q.earnings.bollywood}</p> <p>💸 Hollywood Original: $${q.earnings.hollywood}</p> <button class="action-btn" onclick="window.startHollyBolly()">▶️ Next</button> </div>; }

function showCompletion() { const builder = document.getElementById('sentenceBuilderArea'); builder.innerHTML = <h2>🏁 HollyBolly Complete!</h2> <p>You completed ${answeredIDs.size} puzzles!</p> <button class="action-btn" onclick="window.startHollyBolly()">🔁 Play Again</button> <button class="action-btn" onclick="resetToMenu()">🏠 Main Menu</button>;

logEvent('game_complete', { mode: 'HollyBolly', total: answeredIDs.size }); }

function getEmoji(cat) { return cat === 'place' ? '🏞️' : cat === 'animal' ? '🐾' : '🎁'; }

function resetToMenu() { document.getElementById('menuArea').hidden = false; document.getElementById('gameArea').hidden = true; answeredIDs.clear(); questionPool = []; currentQuestion = null; }

// Global for reward box button window.startHollyBolly = startHollyBolly;

