
/* 
1) Purpose: Bootstraps LingoQuest2 app on load
2) Features: Loads profile, theme, header/footer, routes to main
3) Dependencies: profileManager.js, themeManager.js, uiHeader.js
4) Related: js/profile/, js/ui/, js/main.js
5) Special: Designed for large-button Minimal UI first
6) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
7) Timestamp: 2025-05-30 20:00 | File: js/app.js
*/

import { initProfile } from './profile/profileManager.js';
import { applyTheme } from './ui/themeManager.js';
import { loadLanguage } from './ui/langManager.js';
import { initFont } from './ui/fontManager.js';


window.addEventListener('DOMContentLoaded', async () => {
  initProfile();
  applyTheme();
  const { renderHeader } = await import('./ui/uiHeader.js');
  const { renderFooter } = await import('./ui/uiFooter.js');
  const { showMainMenu } = await import('./main.js');
const savedLang = localStorage.getItem('ui-lang') || 'en';
 await loadLanguage(savedLang);
  renderHeader();
  renderFooter();
  showMainMenu();
initFont();
});












