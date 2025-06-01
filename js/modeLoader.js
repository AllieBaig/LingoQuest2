
/* 
1) Purpose: Dynamically and statically import game modes
2) Features: Supports both lazy-loading and preloaded game start
3) Usage: loadMode('mixlingo') or loadMode('cinequest', 'static')
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 23:59 | File: js/modeLoader.js
*/

import * as mixlingoStatic from './modes/mixlingo.js';
import * as echoExpStatic from './modes/echo-exp.js';
import * as relicStatic from './modes/relic.js';
import * as cinequestStatic from './modes/cinequest.js';
import * as hollybollyStatic from './modes/hollybolly.js';

import { handleGameLoadError } from './modeHelpers.js';

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
    console.error(`❌ Error loading mode "${modeName}"`, err);
    handleGameLoadError(`Failed to load game mode: ${modeName}`);
    return { start: () => {} }; // return empty start to avoid crash
  }
}
