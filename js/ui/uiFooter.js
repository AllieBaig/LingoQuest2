/*
 * Purpose: Renders the bottom footer including XP tracker and Back to Menu button.
 * Features: Dynamic DOM content injection into #appFooter.
 * Depends on: xpTracker.js, gameUIManager.js
 * Related: uiHeader.js
 * Special Notes: Back to Menu triggers #menuArea visibility toggle.
 * MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
 * Timestamp: 2025-05-31 12:15 | File: js/uiFooter.js
 */


import { renderThemeDropdown } from './themeDropdown.js';
//renderThemeDropdown('appFooter');

export function renderAppFooter() {
  const footer = document.getElementById('appFooter');
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer-bar">
      <button id="backToMenuBtn">🔙 Back to Menu</button>
      <div id="xpTracker">XP: 0 | Level: 1</div>
    </div>
  `;

  document.getElementById('backToMenuBtn')?.addEventListener('click', () => {
    document.getElementById('menuArea').hidden = false;
    document.getElementById('gameArea').hidden = true;
  });
}

renderThemeDropdown('appFooter');



