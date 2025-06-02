
/*
 * Purpose: Dynamically renders game mode selection menu.
 * Features: Renders buttons based on centralized modeConfig.
 * Depends on: modeConfig.js
 * MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
 * Timestamp: 2025-06-02 22:55 | File: js/menuRenderer.js
 */

import { gameModes } from './modeConfig.js';

export function renderGameMenu(containerId = 'menuArea') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<h2>🎮 Select a Game Mode</h2>';

  const grid = document.createElement('div');
  grid.className = 'menu-grid';

  gameModes.forEach(({ id, emoji, title, modeKey, i18nKey }) => {
    const btn = document.createElement('button');
    btn.id = id;
    btn.className = 'mode-button';
    btn.innerHTML = `${emoji} ${title}`;
    btn.dataset.mode = modeKey;
    grid.appendChild(btn);
  });

  container.appendChild(grid);
}



