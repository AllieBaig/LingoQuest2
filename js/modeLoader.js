
/*
1) Purpose: Dynamically and statically import game modes
2) Features: Supports dual dynamic/static loading with error fallback
3) Depends on: js/modeConfig.js, js/modeHelpers.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 23:58 | File: js/modeLoader.js
*/

import { gameModes } from './modeConfig.js';
import { handleGameLoadError } from './modeHelpers.js';

// Static imports for fallback or preload
import * as mixlingoStatic from './modes/mixlingo/mixlingo.js';
import * as echoExpStatic from './modes/echoexp/echo-exp.js';
import * as relicStatic from './modes/relic/relic.js';
import * as cinequestStatic from './modes/cinequest/cinequest.js';
import * as hollybollyStatic from './modes/hollybolly/hollybolly.js';

const staticMap = {
  mixlingo: mixlingoStatic,
  echoexp: echoExpStatic,
  relic: relicStatic,
  cinequest: cinequestStatic,
  hollybolly: hollybollyStatic
};

export async function loadMode(modeName, method = 'dynamic') {
  const config = gameModes[modeName];
  if (!config) throw new Error(`Unknown mode: ${modeName}`);

  const staticExport = staticMap[modeName];
  const staticFunc = staticExport[`start${capitalize(modeName)}`];

  if (method === 'static') return { start: staticFunc };

  try {
    const dynamicModule = await import(config.importPath);
    return { start: dynamicModule[`start${capitalize(modeName)}`] };
  } catch (err) {
    handleGameLoadError(modeName);
    return { start: staticFunc || (() => {}) };
  }
}

function capitalize(key) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}



