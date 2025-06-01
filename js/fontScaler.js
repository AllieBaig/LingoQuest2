
/*
1) Purpose: Font size and UI scale control for accessibility
2) Features: Slider to scale font size, checkbox to also scale buttons/menus
3) Dependencies: Minimal UI styling (body.minimal-ui), localStorage for persistence
4) Used in: renderIngameHead() in game modes
5) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
6) Timestamp: 2025-06-01 23:55 | File: js/fontScaler.js
*/

export function renderFontScaler(containerId = 'gameArea') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'font-scaler';
  wrapper.innerHTML = `
    <label style="margin-right: 10px;">🔠 Font Size</label>
    <input type="range" id="fontSizeSlider" min="80" max="150" value="100" step="10" />
    <label style="margin-left: 10px;">
      <input type="checkbox" id="scaleAllUI" />
      Scale all UI
    </label>
  `;

  container.appendChild(wrapper);

  const fontSlider = wrapper.querySelector('#fontSizeSlider');
  const scaleCheckbox = wrapper.querySelector('#scaleAllUI');

  // Load previous state if exists
  const storedSize = localStorage.getItem('fontSizePercent');
  const storedUIFlag = localStorage.getItem('scaleAllUI');

  if (storedSize) fontSlider.value = storedSize;
  if (storedUIFlag === 'true') scaleCheckbox.checked = true;

  applyFontScaling(fontSlider.value, scaleCheckbox.checked);

  fontSlider.addEventListener('input', () => {
    const percent = fontSlider.value;
    const scaleAll = scaleCheckbox.checked;
    localStorage.setItem('fontSizePercent', percent);
    applyFontScaling(percent, scaleAll);
  });

  scaleCheckbox.addEventListener('change', () => {
    const percent = fontSlider.value;
    const scaleAll = scaleCheckbox.checked;
    localStorage.setItem('scaleAllUI', scaleAll);
    applyFontScaling(percent, scaleAll);
  });
}

function applyFontScaling(percent, scaleAllUI) {
  const root = document.documentElement;
  root.style.setProperty('--game-font-scale', `${percent}%`);
  document.body.classList.toggle('scale-ui', scaleAllUI);
}
