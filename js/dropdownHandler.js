
/* 
1) Purpose: Central handler for dropdowns (like language, font, answers)
2) Features: Attach change events, persist selection in localStorage
3) Dependencies: None
4) Related: Used by ingameFoot.js, uiSettingsPanel.js, themeManager.js
5) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
6) Timestamp: 2025-05-31 19:05 | File: js/utils/dropdownHandler.js
*/

export function handleDropdown(id, storageKey, onChangeCallback) {
  const dropdown = document.getElementById(id);
  if (!dropdown) return;

  // Set saved value if exists
  const saved = localStorage.getItem(storageKey);
  if (saved && dropdown.value !== saved) {
    dropdown.value = saved;
  }

  // Attach change listener
  dropdown.addEventListener('change', (e) => {
    const val = e.target.value;
    localStorage.setItem(storageKey, val);

    if (typeof onChangeCallback === 'function') {
      onChangeCallback(val);
    }
  });
}
