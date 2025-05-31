
/* 
1) Purpose: Loads and applies multilingual UI translations
2) Features: Supports dynamic switching, auto-detection, and persistence
3) Dependencies: lang/ui-*.json files, DOM elements using data-i18n
4) Related: Used by app.js and settings panel
5) Special: Defaults to English, supports async updates
6) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
7) Timestamp: 2025-05-30 21:50 | File: js/ui/langManager.js
*/

let currentLang = 'en';
let translations = {};

/**
 * Loads a language JSON file and applies translations to UI
 * @param {string} langCode - Language code, e.g., "en", "fr", "de"
 */
export async function loadLanguage(langCode = 'en') {
  currentLang = langCode;
  localStorage.setItem('ui-lang', langCode);

  try {
    const response = await fetch(`lang/ui-${langCode}.json`);
    translations = await response.json();
    applyTranslations();
  } catch (err) {
    console.error(`❌ Failed to load language file: ui-${langCode}.json`, err);
    translations = {}; // fallback to key display
  }
}

/**
 * Applies translations to all DOM elements with data-i18n attributes
 */
export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) {
      el.textContent = translations[key];
    }
  });
}

/**
 * Returns the current active language code
 */
export function getCurrentLang() {
  return currentLang;
}

/**
 * Gets a translated string by key (optional)
 */
export function getTranslation(key) {
  return translations[key] || key;
}
