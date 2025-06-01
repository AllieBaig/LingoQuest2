
/* 
1) Purpose: Renders and manages the settings panel for LingoQuest2
2) Features: Language, font, and theme selectors (senior-friendly, multilingual)
3) Dependencies: langManager.js, themeManager.js, fontManager.js
4) Related: minimal.css, themes.css, fonts.css
5) Special: Uses i18n keys and emojis for intuitive selection
6) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
7) Timestamp: 2025-05-30 20:45 | File: js/ui/uiSettingsPanel.js
*/

import { loadLanguage } from './langManager.js';
import { applyTheme } from './themeManager.js';
import { setTheme, toggleDarkMode } from './themeManager.js';

import { applyFontChoice } from './fontManager.js';
import { applyTranslations } from './langManager.js';

export function renderSettingsPanel(containerId = 'menuArea') {
  const container = document.getElementById(containerId);
  const panel = document.createElement('div');
  panel.id = 'settingsPanel';
  panel.innerHTML = `
    <div class="settings-block">
      <label for="langSelect" data-i18n="language_label">Language:</label>
      <select id="langSelect">
        <option value="en">🇬🇧 English</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="de">🇩🇪 Deutsch</option>
      </select>
    </div>

    <div class="settings-block">
      <label for="themeSelect" data-i18n="theme_label">Theme:</label>
      <select id="themeSelect">
        <option value="theme-windows98">💾 Windows 98</option>
        <option value="theme-windowsxp">🖼 Windows XP</option>
        <option value="theme-android">🤖 Android</option>
        <option value="theme-ios">📱 iOS</option>
        <option value="theme-ubuntu">🟠 Ubuntu</option>
        <option value="theme-redhat">🎩 Redhat</option>
      </select>
    </div>

    <div class="settings-block">
      <label for="fontSelect" data-i18n="font_label">Game Font:</label>
      <select id="fontSelect">
        <option value="font-default">Sans-serif (Default)</option>
        <option value="font-serif">Serif (Georgia)</option>
        <option value="font-handwritten">Comic Sans</option>
        <option value="font-monospace">Monospace</option>
        <option value="font-tinos">Tinos</option>
        <option value="font-crimson">Crimson Text</option>
        <option value="font-source-serif">Source Serif Pro</option>
        <option value="font-neuton">Neuton</option>
        <option value="font-lora">Lora</option>
        <option value="font-forgetica">Sans Forgetica</option>
      </select>
    </div>
  `;

  container.appendChild(panel);

  // Restore previously selected settings
  document.getElementById('langSelect').value = localStorage.getItem('ui-lang') || 'en';
  document.getElementById('themeSelect').value = localStorage.getItem('theme') || 'theme-windowsxp';
  document.getElementById('fontSelect').value = localStorage.getItem('game-font') || 'font-default';

  // Event listeners
  document.getElementById('langSelect').addEventListener('change', async (e) => {
    await loadLanguage(e.target.value);
    applyTranslations();
  });

  /*
  document.getElementById('themeSelect').addEventListener('change', (e) => {
    localStorage.setItem('theme', e.target.value);
    applyTheme();
  });
  */
  document.getElementById('themeSelect').addEventListener('change', (e) => {
  const theme = e.target.value.replace('theme-', '');
  localStorage.setItem('theme', theme);
  applyTheme(theme);
});
  

  document.getElementById('fontSelect').addEventListener('change', (e) => {
    applyFontChoice(e.target.value);
  });
}

