
/* 
1) Purpose: Provide logic for Relic game mode (e.g., MCQ generation)
2) Features: Difficulty-aware option filtering for questions
3) Dependencies: modeHelpers.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 22:40 | File: js/modes/relic/logic.js
*/

import { optionCount, shuffleArray } from '../../modeHelpers.js';

// ✅ Returns shuffled options limited by difficulty
export function getMCQOptions(question) {
  if (!question || !Array.isArray(question.answers)) return [];

  const difficulty = localStorage.getItem('game-difficulty') || 'medium';
  const count = optionCount[difficulty] || 3;

  const shuffled = shuffleArray([...question.answers]);

  // Ensure correct answer is included
  if (!shuffled.includes(question.correct)) {
    shuffled[0] = question.correct;
  }

  const limited = shuffled.slice(0, count);

  // Double check if correct is still included
  if (!limited.includes(question.correct)) {
    limited[Math.floor(Math.random() * count)] = question.correct;
  }

  return shuffleArray(limited);
}
