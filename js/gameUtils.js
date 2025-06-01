
/* 
1) Purpose: Shared game utilities (XP, UI, MCQ feedback, event logging)
2) Features: XP tracker, button check, UI head/footer renderers, event logger
3) Used in: All game modes (MixLingo, EchoExpedition, HollyBolly, CineQuest, Relic)
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 23:58 | File: js/gameUtils.js
*/

import { renderFontScaler as renderFontSizeSlider } from './fontScaler.js';
//import { renderFontSizeSlide as renderFontSizeSlider } from './fontScaler.js';
import { renderAnswerLangDropdown } from './answerLangDropdown.js';
import { renderDecadeDropdown } from './decadeDropdown.js';
import { renderXPBar, updateXP } from './xpTracker.js';
import { logEvent } from './eventLogger.js';

// ✅ Show visual feedback on MCQ buttons
export function autoCheckMCQ(button, isCorrect) {
  button.classList.add(isCorrect ? 'correct' : 'wrong');
  setTimeout(() => {
    button.classList.remove('correct', 'wrong');
  }, 1000);
}

// ✅ Add XP and update tracker
export function addXP(amount) {
  const current = parseInt(localStorage.getItem('xp') || '0');
  const updated = current + amount;
  localStorage.setItem('xp', updated);
  updateXP(updated);
}

// ✅ Render top in-game controls
export function renderIngameHead(container) {
  const top = document.createElement('div');
  top.id = 'ingameHead';
  top.className = 'ingame-head';

  top.innerHTML = `
    <div class="ingame-controls">
      <span>🎯 Difficulty: <strong>${localStorage.getItem('game-difficulty') || 'medium'}</strong></span>
    </div>
  `;

  container.appendChild(top);

  renderFontSizeSlider('ingameHead');
  renderAnswerLangDropdown('ingameHead');
  renderDecadeDropdown('ingameHead'); // Only active in CineQuest
}

// ✅ Render bottom in-game controls
export function renderIngameFoot(container) {
  const foot = document.createElement('div');
  foot.id = 'ingameFoot';
  foot.className = 'ingame-foot';
  foot.innerHTML = `
    <div id="xpTracker">XP: 0 | Level: 1</div>
  `;
  container.appendChild(foot);
  renderXPBar('xpTracker');
}

// ✅ Show user-friendly error
export function showUserError(msg = '⚠️ Something went wrong') {
  const div = document.createElement('div');
  div.className = 'user-error';
  div.textContent = msg;
  div.style.cssText = 'text-align:center;padding:10px;color:red;';
  document.getElementById('gameArea')?.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

// ✅ Ensure all fields exist in a question
export function verifyQuestionStructure(obj, fields = []) {
  if (!obj || typeof obj !== 'object') return false;
  return fields.every(key => key in obj);
}

export {
  logEvent // separate export so it's available for modeHelper bundling
};
