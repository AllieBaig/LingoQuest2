
/* 
1) Purpose: Bootstraps LingoQuest2
2) Loads profile, theme, font, language, menu
3) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
4) Timestamp: 2025-05-30 21:15 | File: js/app.js
*/

import { initProfile } from './profile/profileManager.js';
import { loadLanguage } from './ui/langManager.js';
import { initFont } from './ui/fontManager.js';
import { applyTheme } from './ui/themeManager.js';
import { showMainMenu } from './main.js';
import { renderHeader } from './ui/uiHeader.js';
import { renderFooter } from './ui/uiFooter.js';

window.addEventListener('DOMContentLoaded', async () => {
  initProfile();
  initFont();
  applyTheme();

  const lang = localStorage.getItem('ui-lang') || 'en';
  await loadLanguage(lang);

  renderHeader();
  renderFooter();
  showMainMenu(); // ⬅️ This injects the MixLingo button
});
