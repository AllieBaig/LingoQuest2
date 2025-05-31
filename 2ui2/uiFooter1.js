
/* 
1) Purpose: Renders footer with XP bar and optional Back to Menu button
2) Features: Reflects user XP, and supports returning to main menu
3) Dependencies: profileManager.js, main.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-05-30 22:01 | File: js/ui/uiFooter.js
*/

import { getProfile } from '../profile/profileManager.js';
import { showMainMenu } from '../main.js';

export function renderFooter() {
  const footer = document.getElementById('appFooter');
  const profile = getProfile();

  footer.innerHTML = `
    <div class="footer-block">
      <span data-i18n="xp_label">XP:</span>
      <strong>${profile.xp}</strong>
      <button id="backToMenuBtn" data-i18n="back_to_menu">Back to Menu</button>
    </div>
  `;

  document.getElementById('backToMenuBtn').addEventListener('click', () => {
    document.getElementById('gameArea').hidden = true;
    document.getElementById('menuArea').hidden = false;
    showMainMenu();
  });
}
