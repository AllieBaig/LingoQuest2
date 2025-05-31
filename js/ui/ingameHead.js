
/* 
1) Purpose: Renders in-game top bar with title + font scaler
2) Features: Slider to scale only game text
3) Dependencies: None
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-05-31 11:15 | File: js/ui/ingameHead.js
*/

export function renderIngameHead(containerId = 'gameArea') {
  const container = document.getElementById(containerId);
  const bar = document.createElement('div');
  bar.id = 'ingameHead';
  bar.style.display = 'flex';
  bar.style.justifyContent = 'space-between';
  bar.style.alignItems = 'center';
  bar.style.marginBottom = '1rem';

  bar.innerHTML = `
    <strong>🌍 MixLingo Mode</strong>
    <div>
      <label for="fontScaleSlider" style="font-size: 1rem;">🔠 Font Size</label>
      <input type="range" id="fontScaleSlider" min="1" max="2" step="0.1" value="1.2" style="vertical-align: middle;" />
    </div>
  `;

  container.prepend(bar);

  document.getElementById('fontScaleSlider').addEventListener('input', (e) => {
    const scale = parseFloat(e.target.value);
    document.getElementById(containerId).style.fontSize = `${scale}rem`;
  });
}
