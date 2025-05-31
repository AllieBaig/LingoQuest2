
/* 
1) Purpose: Dynamically import game modes by name
2) Features: Central loader for all modes (MixLingo, Echo Expedition, etc.)
3) Usage: await loadMode('mixlingo') → then call .start()
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 00:30 | File: js/modeLoader.js
*/

export async function loadMode(modeName) {
  switch (modeName) {
    case 'mixlingo': {
      const mod = await import('./modes/mixlingo.js');
      return { start: mod.startMixLingo };
    }
    case 'echoexp': {
      const mod = await import('./modes/echo-exp.js');
      return { start: mod.startEchoExpedition };
    }
    // Add more modes as needed
    default:
      throw new Error(`Unknown game mode: ${modeName}`);
  }
}
