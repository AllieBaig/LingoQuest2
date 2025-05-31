
/* 
1) Purpose: Loads and applies multilingual UI translations
2) Features: Supports dynamic switching and localStorage persistence
3) Dependencies: lang/ui-*.json files, DOM elements with data-i18n keys
4) Related: app.js, profileManager.js, all UI modules
5) Special: Defaults to English; supports French and German
6) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
7) Timestamp: 2025-05-30 20:10 | File: js/ui/langManager.js
*/

let currentLang = 'en';
let translations = {};

export async function loadLanguage(langCode = 'en') {
  currentLang = langCode;
  localStorage.setItem('ui-lang', currentLang);

  try {
    const response = await fetch(`lang/ui-${langCode}.json`);
    translations = await response.json();
    applyTranslations();
  } catch (err) {
    console.error(`Failed to load language: ${langCode}`, err);
  }
}

export function getTranslation(key) {
  return translations[key] || key;
}

export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) el.textContent = translations[key];
  });
}

export function getCurrentLang() {
  return currentLang;
}
