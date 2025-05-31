
/* 
1) Purpose: Renders main menu and routes game mode selection
2) Features: Injects game mode buttons (e.g. MixLingo), attaches event listeners
3) Dependencies: mixlingo.js, eventLogger.js
4) Related: Called from app.js after profile/theme setup
5) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
6) Timestamp: 2025-05-30 21:00 | File: js/main.js
*/

export function showMainMenu() {
  const menu = document.getElementById('menuArea');
  menu.innerHTML = ''; // Clear previous contents

  const heading = document.createElement('h2');
  heading.textContent = 'Choose a Game Mode';

  const mixLingoBtn = document.createElement('button');
  mixLingoBtn.id = 'mixLingoBtn';
  mixLingoBtn.textContent = '🌍 MixLingo';
  mixLingoBtn.setAttribute('data-i18n', 'start_game');

  mixLingoBtn.addEventListener('click', async () => {
    const { startMixLingo } = await import('./modes/mixlingo.js');
    startMixLingo();
  });

  menu.appendChild(heading);
  menu.appendChild(mixLingoBtn);
}
