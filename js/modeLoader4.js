
/* 
1) Purpose: Dynamically and statically import game modes with robust error handling
2) Features: Dual import strategy, fallback error UI for missing scripts
3) Usage:
   - Dynamic: await loadMode('mixlingo') → { start }
   - Static: import { startMixLingo } from './modes/mixlingo.js';
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 22:00 | File: js/modeLoader.js
*/

// 🔹 Optional static pre-imports
import * as mixlingoStatic from './modes/mixlingo.js';
import * as echoExpStatic from './modes/echo-exp.js';
import * as relicStatic from './modes/relic.js';
import * as cinequestStatic from './modes/cinequest.js';
import * as hollybollyStatic from './modes/hollybolly.js';

export async function loadMode(modeName, method = 'dynamic') {
  try {
    switch (modeName) {
      case 'mixlingo':
        return method === 'static'
          ? { start: mixlingoStatic.startMixLingo }
          : { start: (await import('./modes/mixlingo.js')).startMixLingo };

      case 'echoexp':
        return method === 'static'
          ? { start: echoExpStatic.startEchoExpedition }
          : { start: (await import('./modes/echo-exp.js')).startEchoExpedition };

      case 'relic':
        return method === 'static'
          ? { start: relicStatic.startRelic }
          : { start: (await import('./modes/relic.js')).startRelic };

      case 'cinequest':
        return method === 'static'
          ? { start: cinequestStatic.startCineQuest }
          : { start: (await import('./modes/cinequest.js')).startCineQuest };

      case 'hollybolly':
        return method === 'static'
          ? { start: hollybollyStatic.startHollyBolly }
          : { start: (await import('./modes/hollybolly.js')).startHollyBolly };

      default:
        throw new Error(`Unknown game mode: ${modeName}`);
    }
  } catch (err) {
    const container = document.getElementById('gameArea') || document.body;
    container.innerHTML = `
      <div class="error-message" style="padding:2rem; text-align:center; color:red;">
        <h2>⚠️ Game Mode Load Error</h2>
        <p>Unable to load "${modeName}" mode. Please try another mode or refresh.</p>
        <pre style="background:#fee; padding:1rem; overflow:auto;">${err.message}</pre>
      </div>
    `;
    console.error(`❌ Failed to load game mode '${modeName}':`, err);
    return { start: () => {} }; // graceful fallback
  }
}
