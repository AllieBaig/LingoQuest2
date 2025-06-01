
/* 
1) Purpose: Manages dynamic theme switching and persistence
2) Features: Load, apply, and save selected UI theme across sessions
3) Depends on: None (vanilla JS)
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 23:59 | File: js/themeManager.js
*/

const defaultTheme = 'minimal';
const supportedThemes = [
  'minimal',
  'dark',
  'windows98',
  'windowsxp',
  'ubuntu',
  'ios',
  'android',
  'redhat'
];

/*
export function applyTheme(theme) {
  if (!supportedThemes.includes(theme)) {
    console.warn(`⚠️ Unknown theme: ${theme}, falling back to '${defaultTheme}'`);
    theme = defaultTheme;
  }

  document.body.classList.remove(...supportedThemes.map(t => `theme-${t}`));
  document.body.classList.add(`theme-${theme}`);
  localStorage.setItem('selectedTheme', theme);

  const event = new CustomEvent('themeChanged', { detail: theme });
  document.dispatchEvent(event);
}
*/

export function applyTheme(themeName = null) {
  const validThemes = [
    'theme-windowsxp', 'theme-ubuntu', 'theme-ios', 'theme-android', 'theme-redhat', 'theme-windows98',
    'theme-christmas', 'theme-halloween', 'theme-eid', 'theme-diwali', 'theme-hanukkah', 'theme-vesak',
    'theme-usa', 'theme-india', 'theme-france', 'theme-germany', 'theme-canada', 'theme-japan',
    'theme-uk', 'theme-china', 'theme-uae'
  ];

  if (!themeName) {
    themeName = localStorage.getItem('ui-theme') || 'theme-windowsxp';
  }

  if (!validThemes.includes(themeName)) {
    console.warn(`Unknown theme: ${themeName}, falling back to 'minimal'`);
    themeName = 'theme-windowsxp'; // use your desired fallback
  }

  // Apply theme to body
  document.body.classList.remove(...Array.from(document.body.classList).filter(c => c.startsWith('theme-')));
  document.body.classList.add(themeName);
}




export function loadSavedTheme() {
  const saved = localStorage.getItem('selectedTheme') || defaultTheme;
  applyTheme(saved);

  // Also update dropdown if exists
  const selector = document.getElementById('themeSelector');
  if (selector) selector.value = saved;
}

export function initThemeManager() {
  loadSavedTheme();

  const selector = document.getElementById('themeSelector');
  if (selector) {
    selector.addEventListener('change', () => {
      applyTheme(selector.value);
    });
  }
}
