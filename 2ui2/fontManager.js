
/* 
1) Purpose: Applies user-selected font to game text
2) Features: Updates body class and stores preference
3) Dependencies: minimal.css font class selectors
4) Related: profileManager.js, ui settings
5) Special: Defaults to sans-serif if unknown
6) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
7) Timestamp: 2025-05-30 20:15 | File: js/ui/fontManager.js
*/

// const fontClasses = ['font-default', 'font-serif', 'font-handwritten', 'font-monospace'];

const fontClasses = [
  'font-default',
  'font-serif',
  'font-handwritten',
  'font-monospace',
  'font-tinos',
  'font-crimson',
  'font-source-serif',
  'font-neuton',
  'font-lora'
];


export function applyFontChoice(fontKey = 'font-default') {
  // Remove existing font classes
  document.body.classList.remove(...fontClasses);

  if (fontClasses.includes(fontKey)) {
    document.body.classList.add(fontKey);
    localStorage.setItem('game-font', fontKey);
  } else {
    document.body.classList.add('font-default');
    localStorage.setItem('game-font', 'font-default');
  }
}

export function initFont() {
  const saved = localStorage.getItem('game-font') || 'font-default';
  applyFontChoice(saved);
}
