
/* 
1) Purpose: Load and cache JSON data (e.g., questions, themes)
2) Features: fetch with fallback, merge multiple files, in-memory cache
3) Used in: mixlingo.js, echo-exp.js, langManager.js (future)
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 02:20 | File: js/dataLoader.js
*/
const cache = {};

export async function loadJSON(path) {
  if (cache[path]) return cache[path];
  try {
    const res = await fetch(path);
    const json = await res.json();
    cache[path] = json;
    return json;
  } catch (err) {
    console.warn(`⚠️ Could not load ${path}`, err);
    return [];
  }
}

export async function loadMultipleJSON(paths = []) {
  const results = [];
  for (const path of paths) {
    const data = await loadJSON(path);
    results.push(...data);
  }
  return results;
}

export function clearDataCache(path = null) {
  if (path) {
    delete cache[path];
  } else {
    Object.keys(cache).forEach(k => delete cache[k]);
  }
}

// Add the missing utility functions
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function showError(message) {
  console.error(message);
  const container = document.getElementById('gameArea');
  if (container) {
    container.innerHTML = `
      <div class="error-message" style="text-align: center; padding: 20px; color: #dc3545;">
        <h3>❌ Error</h3>
        <p>${message}</p>
        <button onclick="location.reload()" style="padding: 8px 16px; margin-top: 10px; cursor: pointer;">🔄 Retry</button>
      </div>
    `;
  }
}
