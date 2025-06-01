
/* 
1) Purpose: Shared helpers for all game modes
2) Features:
   - XP, logging, UI, MCQ auto-check
   - Safe JSON loading, question validation, error UI
   - Button state management
3) Used in: mixlingo.js, echo-exp.js, relic.js, wordrelic.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 22:55 | File: js/modeHelper.js
*/

import { logEvent } from './tools/eventLogger.js';
import { addXP } from './profile/profileManager.js';
import { autoCheckMCQ } from './mcqAutoCheck.js';
import { renderIngameHead } from './ui/ingameHead.js';
import { renderIngameFoot } from './ui/ingameFoot.js';

// ✅ Export all shared functions
export {
  logEvent,
  addXP,
  autoCheckMCQ,
  renderIngameHead,
  renderIngameFoot,
  showUserError,
  verifyQuestionStructure,
  safeLoadQuestions,
  shuffleArray,
  disableButtonDuring,
  handleGameLoadError
};

/**
 * ✅ Show user-facing error in game area
 */
function showUserError(message) {
  const target = document.getElementById('sentenceBuilderArea') || document.getElementById('gameArea');
  if (target) {
    target.innerHTML = `
      <div class="error-box">
        <h2>⚠️ Error</h2>
        <p>${message}</p>
        <p>Please try again or select another game mode.</p>
      </div>
    `;
  }
}

/**
 * ✅ Check question object structure
 */
function verifyQuestionStructure(q, requiredFields = []) {
  if (!q || typeof q !== 'object') return false;
  for (let field of requiredFields) {
    if (!(field in q)) {
      console.warn(`⚠️ Missing field "${field}" in question`, q);
      return false;
    }
  }
  return true;
}

/**
 * ✅ Safely fetch and return array from JSON path
 */
async function safeLoadQuestions(path) {
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

/**
 * ✅ Shuffle array with fallback
 */
function shuffleArray(arr) {
  if (!Array.isArray(arr)) {
    console.warn('⚠️ shuffleArray called with non-array:', arr);
    return [];
  }
  return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * ✅ Temporarily disable button during async execution
 */
function disableButtonDuring(btn, asyncFn) {
  if (!btn || typeof asyncFn !== 'function') return;
  btn.disabled = true;
  asyncFn()
    .catch(err => {
      logEvent('error', { source: 'disableButtonDuring', message: err.message });
      showUserError('❌ Error: ' + err.message);
    })
    .finally(() => {
      btn.disabled = false;
    });
}

/**
 * ✅ Friendly error handler for mode-specific loading
 */


function handleGameLoadError(mode, e, lang = 'en') {
  const knownLangs = ['en', 'fr', 'de'];
  const msg = knownLangs.includes(lang)
    ? `🗂️ Failed to load ${mode} data in ${lang.toUpperCase()}`
    : `🗂️ Failed to load ${mode} data`;

  logEvent('error', { mode, lang, message: e.message });
  showUserError(`❌ ${msg}<br><small>${e.message}</small>`);
}




}
