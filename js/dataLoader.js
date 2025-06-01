
/* 
1) Purpose: Load and cache JSON data (e.g., questions, themes)
2) Features: Fetch with fallback, merge multiple files, in-memory cache, global error box
3) Used in: mixlingo.js, echo-exp.js, hollybolly.js, relic.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 23:55 | File: js/dataLoader.js
*/

const cache = {};

// ✅ Load a single JSON file and cache it
export async function loadJSON(path) {
  if (cache[path]) return cache[path];
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status} on ${path}`);
    const json = await res.json();
    cache[path] = json;
    return json;
  } catch (err) {
    console.warn(`⚠️ Could not load ${path}`, err);
    showError(`Could not load ${path}: ${err.message}`);
    return [];
  }
}

// ✅ Load multiple JSON files and merge them
export async function loadMultipleJSON(paths = []) {
  const results = [];
  for (const path of paths) {
    const data = await loadJSON(path);
    results.push(...data);
  }
  return results;
}

// ✅ Clear data cache (optional path)
export function clearDataCache(path = null) {
  if (path) {
    delete cache[path];
  } else {
    Object.keys(cache).forEach(k => delete cache[k]);
  }
}

// ✅ Simple array shuffle (Fisher-Yates)
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ✅ Fallback UI error box renderer
export function showError(message) {
  console.error('❌ showError:', message);
  const container = document.getElementById('gameArea') || document.body;
  const div = document.createElement('div');
  div.className = 'error-message';
  div.style.cssText = 'text-align:center;padding:20px;color:#dc3545;';
  div.innerHTML = `
    <h3>❌ Error</h3>
    <p>${message}</p>
    <button onclick="location.reload()" style="padding: 8px 16px; margin-top: 10px; cursor: pointer;">🔄 Retry</button>
  `;
  container.innerHTML = '';
  container.appendChild(div);
}

/*
export {
  loadJSON,
  loadMultipleJSON,
  clearDataCache,
  shuffleArray,
  showError
};

*/

