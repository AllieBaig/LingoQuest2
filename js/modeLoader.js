
/* 
1) Purpose: Dynamically and statically import game modes
2) Features: Supports both lazy-loading and preloaded game start
3) Usage:
   - Dynamic: await loadMode('mixlingo') → { start }
   - Static: import { startMixLingo } from './modes/mixlingo.js';
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 22:00 | File: js/modeLoader.js
*/

// 🔹 Optional static pre-imports (for faster access if needed)
import * as mixlingoStatic from './modes/mixlingo.js';
import * as echoExpStatic from './modes/echo-exp.js';
import * as relicStatic from './modes/relic.js';
import * as cinequestStatic from './modes/cinequest.js';



export async function loadMode(modeName, method = 'dynamic') {
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
        : { start: (await import('./modes/cinequest.js')).startRelic };

    


    default:
      throw new Error(`Unknown game mode: ${modeName}`);
  }
}

