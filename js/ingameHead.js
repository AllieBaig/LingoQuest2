/* 
1) Purpose: In-game header UI with font scaling and font dropdown
2) Features: Font size slider + dropdown to switch game text font live
3) Persists settings in localStorage
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-05-31 22:10 | File: js/ui/ingameHead.js
*/

export function renderIngameHead() {
  const container = document.createElement('div');
  container.id = 'ingameHead';

  // === Font Size Slider ===
  const sliderLabel = document.createElement('label');
  sliderLabel.textContent = 'Text Size: ';
  sliderLabel.setAttribute('for', 'fontSizeSlider');

  const fontSizeSlider = document.createElement('input');
  fontSizeSlider.id = 'fontSizeSlider';
  fontSizeSlider.type = 'range';
  fontSizeSlider.min = '16';
  fontSizeSlider.max = '48';

  // Load saved font size or default
  const savedSize = localStorage.getItem('game-font-size') || '24';
  fontSizeSlider.value = savedSize;
  document.documentElement.style.setProperty('--game-font-size', `${savedSize}px`);

  fontSizeSlider.addEventListener('input', () => {
    const newSize = fontSizeSlider.value;
    document.documentElement.style.setProperty('--game-font-size', `${newSize}px`);
    localStorage.setItem('game-font-size', newSize);
  });

  // === Font Family Dropdown ===
  const fontLabel = document.createElement('label');
  fontLabel.textContent = 'Font: ';
  fontLabel.setAttribute('for', 'fontSelect');

  const fontSelect = document.createElement('select');
  fontSelect.id = 'fontSelect';

  const fonts = [
    { label: 'Default', value: '' },
    { label: 'Tinos', value: 'tinos' },
    { label: 'Crimson Text', value: 'crimson' },
    { label: 'Source Serif Pro', value: 'source-serif' },
    { label: 'Neuton', value: 'neuton' },
    { label: 'Lora', value: 'lora' },
    { label: 'Sans Forgetica', value: 'sans-forgetica' }
  ];

  fonts.forEach(font => {
    const opt = document.createElement('option');
    opt.textContent = font.label;
    opt.value = font.value;
    fontSelect.appendChild(opt);
  });

  // Load saved font class if any
  const savedFont = localStorage.getItem('game-font');
  if (savedFont) {
    fontSelect.value = savedFont;
    document.body.classList.add(`font-${savedFont}`);
  }

  fontSelect.addEventListener('change', () => {
    document.body.className = document.body.className.replace(/font-\S+/g, '').trim();
    if (fontSelect.value) {
      document.body.classList.add(`font-${fontSelect.value}`);
      localStorage.setItem('game-font', fontSelect.value);
    } else {
      localStorage.removeItem('game-font');
    }
  });

  // === Append to header ===
  container.appendChild(sliderLabel);
  container.appendChild(fontSizeSlider);
  container.appendChild(document.createTextNode(' '));
  container.appendChild(fontLabel);
  container.appendChild(fontSelect);

  const headArea = document.getElementById('gameArea');
  if (headArea) {
    headArea.prepend(container);
  }
}
