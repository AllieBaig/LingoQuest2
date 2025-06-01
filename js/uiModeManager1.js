
/* 
1) Purpose: Handles UI mode switching between normal and ASCII
2) Features: Toggles class on <body>, persists choice, event-driven
3) Depends on: None directly
4) Used by: app.js, main.js, game modes
5) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
6) Timestamp: 2025-06-01 23:59 | File: js/uiModeManager.js
*/

const supportedModes = ['normal', 'ascii'];
const defaultMode = 'normal';

export function applyUIMode(mode) {
  if (!supportedModes.includes(mode)) {
    console.warn(`⚠️ Unknown UI mode "${mode}", falling back to "${defaultMode}"`);
    mode = defaultMode;
  }

  document.body.classList.remove(...supportedModes.map(m => `mode-${m}`));
  document.body.classList.add(`mode-${mode}`);
  localStorage.setItem('ui-mode', mode);

  const event = new CustomEvent('uiModeChanged', { detail: mode });
  document.dispatchEvent(event);
}

export function loadSavedUIMode() {
  const saved = localStorage.getItem('ui-mode') || defaultMode;
  applyUIMode(saved);
}

export function toggleUIMode() {
  const current = localStorage.getItem('ui-mode') || defaultMode;
  const next = current === 'normal' ? 'ascii' : 'normal';
  applyUIMode(next);
}
