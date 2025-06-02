
/* 
1) Purpose: Shared helpers for all game modes (question loading, structure checks, utils)
2) Features: Safe JSON loading, shuffle, structure validation, difficulty-aware MCQs
3) Used in: All game modes (MixLingo, Echo Expedition, Relic, CineQuest, HollyBolly)
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 23:59 | File: js/modeHelpers.js
*/

import { loadJSON } from './dataLoader.js';
//import { showUserError } from './gameUtils.js';
import { logEvent } from './eventLogger.js';

// ✅ Safe question loader with fallback
export async function safeLoadQuestions(path) {
  try {
    const questions = await loadJSON(path);
    if (!Array.isArray(questions)) {
      console.warn(`Invalid format in ${path}`);
      return [];
    }
    return questions;
  } catch (err) {
    console.error(`❌ Failed to load questions from ${path}`, err);
    return [];
  }
}

// ✅ Shuffle any array (non-destructive)
export function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ✅ Show error in-game area
export function showUserError(message) {
  const builder = document.getElementById('sentenceBuilderArea') || document.getElementById('gameArea');
  if (builder) {
    builder.innerHTML = `
      <div class="error-box">
        <h2>⚠️ Error</h2>
        <p>${message}</p>
        <p>Please try again or select another game mode.</p>
      </div>
    `;
  }
}



// ✅ Validate question object has all required fields
export function verifyQuestionStructure(obj, fields = []) {
  if (!obj || typeof obj !== 'object') return false;
  return fields.every(key => key in obj);
}

// ✅ Difficulty-based MCQ options count
export const optionCount = {
  easy: 2,
  medium: 3,
  hard: 4
};

// ✅ Show detailed error for bad question entries
export function logQuestionError(question, reason = 'Invalid structure') {
  console.warn(`🛑 Question Skipped (${reason})`, question);
  logEvent('invalid_question', { id: question?.id || 'unknown', reason });
}

// ✅ Generic game load failure handler
export function handleGameLoadError(message = 'Game failed to load') {
  showUserError(message);
  document.getElementById('gameArea')?.classList.add('error-state');
}
