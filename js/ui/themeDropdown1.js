
/* 
1) Purpose: Renders a theme dropdown (with emojis) for UI customization
2) Features: Emoji labels, logs theme changes, updates localStorage
3) Depends on: themeManager.js, eventLogger.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 05:20 | File: js/ui/themeDropdown.js
*/

import { setTheme } from './themeManager.js';
import { logEvent } from '../tools/eventLogger.js';

export function renderThemeDropdown(containerId = 'appFooter') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'theme-dropdown-wrapper';

  const label = document.createElement('label');
  label.textContent = '🎨 Theme: ';
  label.setAttribute('for', 'themeSelect');

  const select = document.createElement('select');
  select.id = 'themeSelect';
  select.innerHTML = `
    <option value="theme-windowsxp">🪟 Windows XP</option>
    <option value="theme-ubuntu">🐧 Ubuntu</option>
    <option value="theme-ios">📱 iOS</option>
    <option value="theme-android">🤖 Android</option>
    <option value="theme-redhat">🎩 Redhat</option>
    <option value="theme-windows98">💾 Win98</option>
  `;

  select.value = localStorage.getItem('ui-theme') || 'theme-windowsxp';

  select.addEventListener('change', (e) => {
    setTheme(e.target.value);
    logEvent('theme_selected', { theme: e.target.value });
  });

  wrapper.appendChild(label);
  wrapper.appendChild(select);
  container.appendChild(wrapper);
}

