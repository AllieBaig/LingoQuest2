
/* 
1) Purpose: Render main game mode menu
2) Features: Builds buttons for all game modes, assigns event listeners
3) Used in: app.js (on page load)
4) Related: modeLoader.js, eventLogger.js
5) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
6) Timestamp: 2025-06-02 13:30 | File: js/utils/menuRenderer.js
*/

import { loadMode } from '../modeLoader.js';
import { logEvent } from '../eventLogger.js';

export function renderGameMenu() {
  const menu = document.getElementById('menuArea');
  if (!menu) return;

  menu.innerHTML = `
    <div class="game-menu">
      <h2 class="menu-heading">🎮 Choose Your Quest</h2>
      <div class="menu-buttons">
        <button class="menu-btn" id="btnMixLingo">🌐 MixLingo</button>
        <button class="menu-btn" id="btnEchoExp">📜 Echo Expedition</button>
        <button class="menu-btn" id="btnRelic">🗝️ Word Relic</button>
        <button class="menu-btn" id="btnCineQuest">🎬 CineQuest</button>
        <button class="menu-btn" id="btnHollyBolly">🎬 HollyBolly</button>

      </div>
    </div>
  `;

  // Add event listeners
  document.getElementById('btnMixLingo')?.addEventListener('click', async () => {
    logEvent('menu_click', { mode: 'MixLingo' });
    const mod = await loadMode('mixlingo');
    mod.start();
  });

  document.getElementById('btnEchoExp')?.addEventListener('click', async () => {
    logEvent('menu_click', { mode: 'Echo Expedition' });
    const mod = await loadMode('echoexp');
    mod.start();
  });

  document.getElementById('btnRelic')?.addEventListener('click', async () => {
    logEvent('menu_click', { mode: 'Word Relic' });
    const mod = await loadMode('relic');
    mod.start();
  });

  document.getElementById('btnCineQuest')?.addEventListener('click', async () => {
    logEvent('menu_click', { mode: 'CineQuest' });
    const mod = await loadMode('cinequest');
    mod.start();
  });

 document.getElementById('btnHollyBolly')?.addEventListener('click', async () => {
    logEvent('menu_click', { mode: 'HollyBolly' });
    const mod = await loadMode('hollybolly');
    mod.start();
  });

  
}
