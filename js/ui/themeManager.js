/* 
1) Purpose: Apply and manage UI themes across the app
2) Features: Theme switching, localStorage memory, dark/light lock, OS fallback
3) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
4) Timestamp: 2025-06-01 03:10 | File: js/ui/themeManager.js
*/

import { logEvent } from '../tools/eventLogger.js';

const THEME_KEY = 'ui-theme';
const DARK_LOCK_KEY = 'ui-dark-lock';

const themes = [
  'theme-windowsxp',
  'theme-ubuntu',
  'theme-ios',
  'theme-android',
  'theme-redhat',
  'theme-windows98'
];

export function applyTheme() {
  const theme = localStorage.getItem(THEME_KEY) || detectOSTheme();
  setTheme(theme);
}

export function setTheme(themeName) {
  document.body.classList.remove(...themes);
  document.body.classList.add(themeName);
  localStorage.setItem(THEME_KEY, themeName);

  logEvent('theme_change', { theme: themeName });
}

function detectOSTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    document.body.classList.add('dark');
    logEvent('theme_os_detected', { mode: 'dark' });
  } else {
    document.body.classList.remove('dark');
    logEvent('theme_os_detected', { mode: 'light' });
  }
  return 'theme-windowsxp'; // default fallback
}

export function toggleDarkMode(lock) {
  if (lock === true) {
    document.body.classList.add('dark');
    localStorage.setItem(DARK_LOCK_KEY, 'dark');
  } else if (lock === false) {
    document.body.classList.remove('dark');
    localStorage.setItem(DARK_LOCK_KEY, 'light');
  } else {
    localStorage.removeItem(DARK_LOCK_KEY);
    detectOSTheme();
  }

  logEvent('dark_mode_toggle', { mode: lock });
}
