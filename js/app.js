
/* 
1) Purpose: App initializer for LingoQuest2
2) Features: Theme setup, UI toggle, minimal mode detection, footer/header rendering
3) Depends on: themeManager.js, uiHeader.js, uiFooter.js, uiModeManager.js
4) Related: main.js (game logic), menuRenderer.js (game buttons)
5) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
6) Timestamp: 2025-06-01 23:50 | File: js/app.js
*/

import { applySavedTheme } from './themeManager.js';
import { setupUIModeToggle } from './uiModeManager.js';
import { renderAppHeader } from './uiHeader.js';
import { renderAppFooter } from './uiFooter.js';

// ⬇️ On DOM load, initialize UI
window.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme or default
  applySavedTheme();

  // Setup header and footer
  renderAppHeader();
  renderAppFooter();

  // Enable UI mode toggle (minimal / ascii / normal)
  setupUIModeToggle();
});
