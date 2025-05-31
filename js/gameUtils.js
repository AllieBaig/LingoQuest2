
/* 
1) Purpose: Shared imports for all game modes (XP, events, MCQ, UI)
2) Features: Simplifies import statements in all game scripts
3) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
4) Timestamp: 2025-06-01 02:45 | File: js/gameUtils.js
*/

export { logEvent } from './tools/eventLogger.js';
export { addXP } from './profile/profileManager.js';
export { autoCheckMCQ } from './mcqAutoCheck.js';
export { renderIngameHead } from './ui/ingameHead.js';
export { renderIngameFoot } from './ui/ingameFoot.js';
