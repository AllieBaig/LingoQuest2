
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
