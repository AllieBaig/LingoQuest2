/* 
1) Purpose: Loads question pools for all game modes
2) Features: Supports MixLingo multi-language pools
3) Dependencies: None directly (fetch only)
4) Related: Used by mixlingo.js and other mode scripts
5) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
6) Timestamp: 2025-05-31 18:45 | File: js/utils/questionPool.js
*/

export async function getMixLingoQuestions() {
  const langs = ['en', 'fr', 'de'];
  const all = [];

  for (let lang of langs) {
    try {
      const res = await fetch(`lang/mixlingo-${lang}.json`);
      const data = await res.json();
      all.push(...data);
    } catch (e) {
      console.warn(`⚠️ Failed to load mixlingo-${lang}.json`, e);
    }
  }

  return shuffleArray(all);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
