
/* 
1) Purpose: Shared helpers for all game modes
2) Features: Safe question loading, error UI, robust shuffle, validation
3) Related: Used in mixlingo.js, echo-exp.js, napt.js, wordrelic.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 02:50 | File: js/modeHelpers.js
*/

import { logEvent } from './tools/eventLogger.js';

// ✅ Safely fetch and return questions from a JSON path
export async function safeLoadQuestions(path) {
  try {
    const res = await fetch(path);
    const json = await res.json();
    if (!Array.isArray(json)) throw new Error('JSON is not an array');
    return json;
  } catch (err) {
    logEvent('error_load_questions', { path, message: err.message });
    showUserError(`Failed to load questions from: ${path}`);
    return [];
  }
}

// ✅ Shuffle array with type check
export function shuffleArray(arr) {
  if (!Array.isArray(arr)) {
    console.warn('⚠️ shuffleArray called with non-array:', arr);
    return [];
  }
  return [...arr].sort(() => Math.random() - 0.5);
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

// ✅ Check question object structure
export function verifyQuestionStructure(q, requiredFields = []) {
  if (!q || typeof q !== 'object') return false;
  for (let field of requiredFields) {
    if (!(field in q)) {
      console.warn(`⚠️ Missing field "${field}" in question`, q);
      return false;
    }
  }
  return true;
}
