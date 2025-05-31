
/* 
1) Purpose: Applies OS-inspired UI themes via className
2) Features: Loads theme from localStorage or uses default
3) Dependencies: localStorage, CSS class changes
4) Related: minimal.css, themes.css
5) Special: Senior-friendly emoji theme codes
6) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
7) Timestamp: 2025-05-30 20:02 | File: js/ui/themeManager.js
*/

export function applyTheme() {
  const theme = localStorage.getItem('theme') || 'theme-windowsxp';
  document.body.classList.remove(...Array.from(document.body.classList).filter(cls => cls.startsWith('theme-')));
  document.body.classList.add(theme);
}
