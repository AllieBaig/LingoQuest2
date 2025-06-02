
/*
1) Purpose: Centralized configuration for all game modes
2) Features: Mode metadata (title, emoji, i18n keys, static import paths)
3) Used in: menuRenderer.js, modeLoader.js, settings panels, analytics
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 23:59 | File: js/modeConfig.js
*/

export const gameModes = {
  mixlingo: {
    id: 'mixlingo',
    emoji: '🌐',
    title: 'MixLingo',
    modeKey: 'mixlingo',
    i18nKey: 'start_mixlingo',
    importPath: './modes/mixlingo/mixlingo.js'
  },
  echoexp: {
    id: 'echoexp',
    emoji: '🗺️',
    title: 'Echo Expedition',
    modeKey: 'echoexp',
    i18nKey: 'start_echoexp',
    importPath: './modes/echoexp/echo-exp.js'
  },
  relic: {
    id: 'relic',
    emoji: '💎',
    title: 'Word Relic',
    modeKey: 'relic',
    i18nKey: 'start_relic',
    importPath: './modes/relic/relic.js'
  },
  cinequest: {
    id: 'cinequest',
    emoji: '🎬',
    title: 'CineQuest',
    modeKey: 'cinequest',
    i18nKey: 'start_cinequest',
    importPath: './modes/cinequest/cinequest.js'
  },
  hollybolly: {
    id: 'hollybolly',
    emoji: '🎞️',
    title: 'HollyBolly',
    modeKey: 'hollybolly',
    i18nKey: 'start_hollybolly',
    importPath: './modes/hollybolly/hollybolly.js'
  }
};


