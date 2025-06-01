
/*

1. Purpose: Load HollyBolly questions and initialize game state


2. Features: Loads JSON data, initializes DOM area, and prepares shuffled pool


3. Depends on: modeHelpers.js, gameUtils.js, renderer.js, logic.js


4. MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE


5. Timestamp: 2025-06-01 23:55 | File: js/modes/hollybolly/loader.js */



import { safeLoadQuestions, shuffleArray, showUserError, verifyQuestionStructure, logEvent } from '../../modeHelpers.js';

import { renderIngameHead, renderIngameFoot } from '../../gameUtils.js'; import { renderQuestion } from './renderer.js';

export let questionPool = []; export let answeredIDs = new Set(); export let currentQuestion = null; export let difficulty = localStorage.getItem('game-difficulty') || 'medium';

export async function startHollyBolly() { const gameArea = document.getElementById('gameArea'); if (!gameArea) return showUserError('Game area missing.');

gameArea.innerHTML = ''; gameArea.hidden = false; document.getElementById('menuArea').hidden = true;

renderIngameHead(gameArea); renderIngameFoot(gameArea);

const rawQuestions = await safeLoadQuestions('lang/hollybolly-en.json'); questionPool = shuffleArray(rawQuestions); answeredIDs.clear();

logEvent('game_start', { mode: 'HollyBolly', difficulty, totalQuestions: questionPool.length });

createSentenceBuilderArea(gameArea); loadNextQuestion(); }

function createSentenceBuilderArea(gameArea) { let builder = document.getElementById('sentenceBuilderArea'); if (!builder) { builder = document.createElement('div'); builder.id = 'sentenceBuilderArea'; builder.className = 'sentence-builder-container'; gameArea.appendChild(builder); } }

export function loadNextQuestion() { if (answeredIDs.size >= questionPool.length) { return showCompletion(); }

let question; let tries = 0; const maxTries = 40;

do { question = questionPool[Math.floor(Math.random() * questionPool.length)]; tries++; if (tries > maxTries) return showCompletion(); } while (answeredIDs.has(question.id));

const required = ['id', 'place', 'animal', 'thing', 'movie', 'bollywood', 'rewards']; if (!verifyQuestionStructure(question, required)) { answeredIDs.add(question.id); return loadNextQuestion(); }

currentQuestion = question; renderQuestion(question); }

function showCompletion() { const builder = document.getElementById('sentenceBuilderArea'); if (!builder) return;

builder.innerHTML = <div class="completion-screen"> <h2>🎬 HollyBolly Complete!</h2> <p>Questions Completed: ${answeredIDs.size}</p> <p>Difficulty: ${difficulty}</p> <button id="playAgainBtn" class="action-btn">🔄 Play Again</button> <button id="backToMenuBtn" class="action-btn">🏠 Main Menu</button> </div>;

document.getElementById('playAgainBtn')?.addEventListener('click', startHollyBolly); document.getElementById('backToMenuBtn')?.addEventListener('click', () => { document.getElementById('gameArea').hidden = true; document.getElementById('menuArea').hidden = false; }); }

