/*
1) Purpose: Main entry point for LingoQuest2
2) Features: Renders game menu, listens for button clicks, launches selected game
3) Depends on: modeLoader.js, menuRenderer.js, eventLogger.js, modeHelper.js
4) Related: Supports MixLingo, Echo Expedition, Word Relic, CineQuest, HollyBolly
5) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
6) Timestamp: 2025-06-02 15:30 | File: js/main.js
*/

import { renderGameMenu } from './menuRenderer.js';
import { loadMode } from './modeLoader.js';
import { logEvent } from './eventLogger.js';
import { handleGameLoadError } from './modeHelper.js'; // ✅ updated filename

// 🔹 Render game menu at startup
renderGameMenu();

// 🔹 Listen for all game mode button clicks
document.addEventListener('click', async (e) => {
  const target = e.target.closest('button[data-mode]');
  if (!target) return;

  const modeKey = target.dataset.mode;

  logEvent('game_mode_selected', { mode: modeKey });
  console.log(`🕹️ Starting game mode: ${modeKey}`); // ✅ Added debug log

  try {
    const { start } = await loadMode(modeKey);
    if (typeof start === 'function') {
      start();
    } else {
      handleGameLoadError(`Mode "${modeKey}" could not start. Start function missing.`);
    }
  } catch (err) {
    console.error(`❌ Error loading mode "${modeKey}":`, err);
    handleGameLoadError(`Failed to load mode "${modeKey}". Please try again.`);
  }
});

