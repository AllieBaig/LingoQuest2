
/* 
 * Purpose: XP system tracker with level logic
 * Features: Earn XP, display level, reset XP if needed
 * Depends on: LocalStorage, UI elements with ID #xpTracker
 * Related: uiFooter.js, gameUtils.js
 * MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
 * Timestamp: 2025-06-01 23:45 | File: js/xpTracker.js
 */

const XP_KEY = 'user-xp';
const LEVEL_KEY = 'user-level';

// Default starting values
let currentXP = parseInt(localStorage.getItem(XP_KEY)) || 0;
let currentLevel = parseInt(localStorage.getItem(LEVEL_KEY)) || 1;

// XP required for each level-up (e.g., Level 1: 100 XP, Level 2: 150 XP, etc.)
function xpThreshold(level) {
  return 100 + (level - 1) * 50;
}

// Update XP display in footer
function updateXPUI() {
  const xpEl = document.getElementById('xpTracker');
  if (xpEl) {
    xpEl.textContent = `XP: ${currentXP} | Level: ${currentLevel}`;
  }
}

// Add XP and handle level-up
export function addXP(amount = 5) {
  currentXP += amount;
  let leveledUp = false;

  while (currentXP >= xpThreshold(currentLevel)) {
    currentXP -= xpThreshold(currentLevel);
    currentLevel++;
    leveledUp = true;
  }

  localStorage.setItem(XP_KEY, currentXP);
  localStorage.setItem(LEVEL_KEY, currentLevel);
  updateXPUI();

  if (leveledUp) {
    console.log(`🎉 Level up! New level: ${currentLevel}`);
  }
}

// Reset XP and level (for testing/debug or restart)
export function resetXP() {
  currentXP = 0;
  currentLevel = 1;
  localStorage.setItem(XP_KEY, '0');
  localStorage.setItem(LEVEL_KEY, '1');
  updateXPUI();
}

// Initialize XP display when app starts
export function initXPTracker() {
  updateXPUI();
}
