


/* 
1) Purpose: Dynamically and statically import game modes with fallback
2) Features: Supports lazy-loading with static fallback on error
3) Usage: await loadMode('mixlingo') → { start }
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 23:59 | File: js/modeLoader.js
*/

import * as mixlingoStatic from './modes/mixlingo/mixlingo.js';
import * as echoExpStatic from './modes/echo-exp.js';
import * as relicStatic from './modes/relic.js';
import * as cinequestStatic from './modes/cinequest.js';
import * as hollybollyStatic from './modes/hollybolly/hollybolly.js';

import { handleGameLoadError } from './modeHelpers.js';

export async function loadMode(modeName, method = 'dynamic') {
  try {
    switch (modeName) {
      case 'mixlingo':
        console.log('🎮 Starting MixLingo...');
        return method === 'static'
          ? { start: mixlingoStatic.startMixLingo }
          : { start: (await import('./modes/mixlingo/mixlingo.js')).startMixLingo };

      case 'echoexp':
        console.log('Starting EchoExp...');
        return method === 'static'
          ? { start: echoExpStatic.startEchoExpedition }
          : { start: (await import('./modes/echo-exp.js')).startEchoExpedition };

      case 'relic':
        console.log('Starting Relic...');
        return method === 'static'
          ? { start: relicStatic.startRelic }
          : { start: (await import('./modes/relic/relic.js')).startRelic };

      case 'cinequest':
        console.log('Starting CineQuest...');
        return method === 'static'
          ? { start: cinequestStatic.startCineQuest }
          : { start: (await import('./modes/cinequest.js')).startCineQuest };

      case 'hollybolly':
        console.log('Starting HollyBolly...');
        return method === 'static'
          ? { start: hollybollyStatic.startHollyBolly }
          : { start: (await import('./modes/hollybolly/hollybolly.js')).startHollyBolly };

      default:
        throw new Error(`Unknown game mode: ${modeName}`);
    }
  } catch (err) {
    console.warn(`⚠️ Dynamic import failed for ${modeName}, attempting static fallback...`, err);
    handleGameLoadError(modeName);

    switch (modeName) {
      case 'mixlingo':
        return { start: mixlingoStatic.startMixLingo };

      case 'echoexp':
        return { start: echoExpStatic.startEchoExpedition };

      case 'relic':
        return { start: relicStatic.startRelic };

      case 'cinequest':
        return { start: cinequestStatic.startCineQuest };

      case 'hollybolly':
        return { start: hollybollyStatic.startHollyBolly };

      default:
        throw new Error(`Static fallback failed or unknown mode: ${modeName}`);
    }
  }
}

