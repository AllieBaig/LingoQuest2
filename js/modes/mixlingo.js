
/* 
1) Purpose: Placeholder for MixLingo mode
2) Shows a test message in the game area to confirm working routing
3) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
4) Timestamp: 2025-05-30 21:40 | File: js/modes/mixlingo.js
*/

export function startMixLingo() {
  const gameArea = document.getElementById('gameArea');
  const menuArea = document.getElementById('menuArea');
  menuArea.hidden = true;
  gameArea.hidden = false;

  gameArea.innerHTML = `
    <h2>🌍 Welcome to MixLingo Mode</h2>
    <p>This is a test screen. MixLingo has loaded successfully!</p>
  `;

  console.log('🚀 MixLingo mode started.');
}
