
/* 
1) Purpose: Renders in-game bottom bar with "Answers in Language" dropdown
2) Features: Triggers callback on selection change
3) Dependencies: lang files (mixlingo-options-*.json)
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-05-31 11:16 | File: js/ui/ingameFoot.js
*/

export function renderIngameFoot(onLangChange, containerId = 'gameArea') {
  const container = document.getElementById(containerId);
  const foot = document.createElement('div');
  foot.id = 'ingameFoot';
  foot.style.marginTop = '2rem';
  foot.style.display = 'flex';
  foot.style.justifyContent = 'center';

  foot.innerHTML = `
    <label for="answerLangSelect" style="margin-right: 0.5rem;"><strong>Answers in:</strong></label>
    <select id="answerLangSelect">
      <option value="en">🇬🇧 English</option>
      <option value="fr">🇫🇷 French</option>
      <option value="de">🇩🇪 German</option>
    </select>
  `;

  container.appendChild(foot);

  document.getElementById('answerLangSelect').addEventListener('change', (e) => {
    if (typeof onLangChange === 'function') {
      onLangChange(e.target.value);
    }
  });
}
