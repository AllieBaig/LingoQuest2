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
//import { renderHeader } from './ui/uiHeader.js';
//import { renderFooter } from './ui/uiFooter.js';
//import { renderFooter as renderAppFooter } from './ui/uiFooter.js';
//import { renderHeader as renderAppHeader } from './ui/uiHeader.js';

import { renderAppFooter } from './ui/uiFooter.js';
import { renderAppHeader } from './ui/uiHeader.js';

//import { renderFooter as renderAppFooter as appFooter } from './ui/uiFooter.js';
//import { renderHeader as renderAppHeader as appHeader } from './ui/uiHeader.js';

//appHeader

//import { renderResult as renderSummary } from '../../utils/asciiRenderer.js';

//import { renderAppHeader } from './uiHeader.js';
//import { renderAppFooter } from './uiFooter.js';

window.addEventListener('DOMContentLoaded', async () => {
  initProfile();
  initFont();
  applyTheme();

  const lang = localStorage.getItem('ui-lang') || 'en';
  await loadLanguage(lang);

  //renderHeader();
  //renderFooter();

  renderAppHeader();
  renderAppFooter();


console.log('LingoQuest2 loaded. Showing main menu...');

  showMainMenu(); // ⬅️ This injects the MixLingo button
});




