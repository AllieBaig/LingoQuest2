/* 
1) Purpose: Theme selector with OS, Festival, and National Day categories
2) Features: Auto-detect holiday, localStorage persistence, emoji labels
3) Depends on: themeManager.js, eventLogger.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-01 07:10 | File: js/ui/themeDropdown.js
*/

//import { setTheme } from './themeManager.js';
//import { logEvent } from '../tools/eventLogger.js';

import { applyTheme as setTheme } from './themeManager.js';
import { logEvent } from './eventLogger.js';  // ✅ correct relative path

// ⏰ Holiday map (MM-DD format → theme name)
const holidayThemes = {
  '01-01': 'theme-japan',       // Japan New Year
  '07-01': 'theme-canada',      // Canada Day
  '07-04': 'theme-usa',         // US Independence Day
  '07-14': 'theme-france',      // France Bastille Day
  '08-15': 'theme-india',       // India Independence Day
  '10-01': 'theme-china',       // China National Day
  '10-03': 'theme-germany',     // German Unity Day
  '10-31': 'theme-halloween',   // Halloween
  '11-12': 'theme-diwali',      // Diwali (placeholder date)
  '12-02': 'theme-uae',         // UAE National Day
  '12-25': 'theme-christmas',   // Christmas
  '06-02': 'theme-uk'           // UK National Holiday (sample)
};

// Get today in MM-DD format
const todayKey = (() => {
  const d = new Date();
  return d.toLocaleDateString('en-CA', { month: '2-digit', day: '2-digit' });
})();

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

  // === OS-Based Themes ===
  const osGroup = document.createElement('optgroup');
  osGroup.label = '💻 OS-based Themes';
  osGroup.innerHTML = `
    <option value="theme-windowsxp">🪟 Windows XP</option>
    <option value="theme-ubuntu">🐧 Ubuntu</option>
    <option value="theme-ios">📱 iOS</option>
    <option value="theme-android">🤖 Android</option>
    <option value="theme-redhat">🎩 Redhat</option>
    <option value="theme-windows98">💾 Windows 98</option>
  `;

  // === Festival Themes ===
  const festivalGroup = document.createElement('optgroup');
  festivalGroup.label = '🎊 Festival Themes';
  festivalGroup.innerHTML = `
    <option value="theme-christmas">🎄 Christmas</option>
    <option value="theme-halloween">🎃 Halloween</option>
    <option value="theme-eid">🕌 Eid</option>
    <option value="theme-diwali">🪔 Diwali</option>
    <option value="theme-hanukkah">🕎 Hanukkah</option>
    <option value="theme-vesak">🪷 Vesak</option>
  `;

  // === National Day Themes ===
  const nationGroup = document.createElement('optgroup');
  nationGroup.label = '🌍 National Day Themes';
  nationGroup.innerHTML = `
    <option value="theme-usa">🇺🇸 USA - 4th July</option>
    <option value="theme-india">🇮🇳 India - Aug 15</option>
    <option value="theme-france">🇫🇷 France - Bastille Day</option>
    <option value="theme-germany">🇩🇪 Germany - Unity Day</option>
    <option value="theme-canada">🇨🇦 Canada - July 1st</option>
    <option value="theme-japan">🇯🇵 Japan - New Year</option>
    <option value="theme-uk">🇬🇧 UK - National Holiday</option>
    <option value="theme-china">🇨🇳 China - Oct 1st</option>
    <option value="theme-uae">🇦🇪 UAE - Dec 2nd</option>
  `;

  // Add groups to select
  select.appendChild(osGroup);
  select.appendChild(festivalGroup);
  select.appendChild(nationGroup);

  // Default selection logic
  const savedTheme = localStorage.getItem('ui-theme');
  const holidayTheme = holidayThemes[todayKey];

  select.value = savedTheme || holidayTheme || 'theme-windowsxp';

  if (holidayTheme && !savedTheme) {
    const todayOption = select.querySelector(`option[value="${holidayTheme}"]`);
    if (todayOption) todayOption.textContent += ' 🎉 Today!';
  }

  // Change handler
  select.addEventListener('change', (e) => {
    setTheme(e.target.value);
    logEvent('theme_selected', { theme: e.target.value });
  });

  // Append
  wrapper.appendChild(label);
  wrapper.appendChild(select);
  container.appendChild(wrapper);
}
