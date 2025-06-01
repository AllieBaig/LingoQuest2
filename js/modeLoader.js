
/*
1) Purpose: Dynamically and statically import game modes
2) Features: Supports both lazy-loading and preloaded game start
3) Usage:
   - Dynamic: await loadMode('mixlingo') → { start }
   - Static: import { startMixLingo } from './modes/mixlingo.js';
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 22:00 | File: js/modeLoader.js
*/

import * as mixlingoStatic from './modes/mixlingo.js';
import * as echoExpStatic from './modes/echo-exp.js';
import * as relicStatic from './modes/relic.js';
import * as cinequestStatic from './modes/cinequest.js';
import * as hollybollyStatic from './modes/hollybolly.js';

import { handleGameLoadError } from './modeHelpers.js';

export async function loadMode(modeName, method = 'dynamic') {
  switch (modeName) {
    case 'mixlingo':
      return method === 'static'
        ? { start: mixlingoStatic.startMixLingo }
        : await (async () => {
            try {
              return { start: (await import('./modes/mixlingo.js')).startMixLingo };
            } catch (err) {
              handleGameLoadError('MixLingo');
              return { start: () => {} };
            }
          })();

    case 'echoexp':
      return method === 'static'
        ? { start: echoExpStatic.startEchoExpedition }
        : await (async () => {
            try {
              return { start: (await import('./modes/echo-exp.js')).startEchoExpedition };
            } catch (err) {
              handleGameLoadError('Echo Expedition');
              return { start: () => {} };
            }
          })();

    case 'relic':
      return method === 'static'
        ? { start: relicStatic.startRelic }
        : await (async () => {
            try {
              return { start: (await import('./modes/relic.js')).startRelic };
            } catch (err) {
              handleGameLoadError('Relic');
              return { start: () => {} };
            }
          })();

    case 'cinequest':
      return method === 'static'
        ? { start: cinequestStatic.startCineQuest }
        : await (async () => {
            try {
              return { start: (await import('./modes/cinequest.js')).startCineQuest };
            } catch (err) {
              handleGameLoadError('CineQuest');
              return { start: () => {} };
            }
          })();

    case 'hollybolly':
      return method === 'static'
        ? { start: hollybollyStatic.startHollyBolly }
        : await (async () => {
            try {
              return { start: (await import('./modes/hollybolly.js')).startHollyBolly };
            } catch (err) {
              handleGameLoadError('HollyBolly');
              return { start: () => {} };
            }
          })();

    default:
      throw new Error(`Unknown game mode: ${modeName}`);
  }
}
