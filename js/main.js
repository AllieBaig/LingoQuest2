
/* 
1) Purpose: Renders main menu and routes game mode selection
2) Features: Injects game mode buttons (e.g. MixLingo, Echo Expedition), uses modeLoader.js
3) Dependencies: modeLoader.js, eventLogger.js
4) Related: Called from app.js after profile/theme setup
5) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
6) Timestamp: 2025-06-01 01:10 | File: js/main.js
*/

//import { logEvent } from './tools/eventLogger.js';
import { loadMode } from './modeLoader.js';
import { renderSettingsPanel } from './ui/uiSettingsPanel.js';



export function showMainMenu() {
  const menu = document.getElementById('menuArea');
  menu.innerHTML = '';

  const heading = document.createElement('h2');
  heading.textContent = 'Choose a Game Mode';

  // 🌍 MixLingo Button
  const mixLingoBtn = document.createElement('button');
  mixLingoBtn.id = 'mixLingoBtn';
  mixLingoBtn.textContent = '🌍 MixLingo';
  mixLingoBtn.addEventListener('click', async () => {
    //logEvent('button_click', { id: 'mixLingoBtn', label: 'MixLingo' });
    const mode = await loadMode('mixlingo');
    mode.start();
  });

  // 🗺️ Echo Expedition Button
  const echoExpBtn = document.createElement('button');
  echoExpBtn.id = 'echoExpBtn';
  echoExpBtn.textContent = '🗺️ Echo Expedition';
  echoExpBtn.addEventListener('click', async () => {
    //logEvent('button_click', { id: 'echoExpBtn', label: 'Echo Expedition' });
    const mode = await loadMode('echoexp');
    mode.start();
  });

  menu.appendChild(heading);
  menu.appendChild(mixLingoBtn);
  menu.appendChild(echoExpBtn);
}

renderSettingsPanel();



