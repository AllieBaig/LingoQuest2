
/*
1) Purpose: Renders the "Answers In Language" dropdown for MCQ languages
2) Features: Persists selection via localStorage, dispatches event to update questions
3) Used in: renderIngameFoot() in game modes like MixLingo, CineQuest, HollyBolly
4) Dependencies: Minimal UI layout, language-aware game modes
5) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
6) Timestamp: 2025-06-01 23:58 | File: js/answerLangDropdown.js
*/

export function renderAnswerLangDropdown(containerId = 'gameArea') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const dropdown = document.createElement('div');
  dropdown.className = 'answer-lang-dropdown';
  dropdown.innerHTML = `
    <label for="answerLangSelect" style="margin-right: 6px;">🌐 Answers In:</label>
    <select id="answerLangSelect">
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
    </select>
  `;

  container.appendChild(dropdown);

  const select = dropdown.querySelector('#answerLangSelect');
  const stored = localStorage.getItem('answerLang') || 'en';
  select.value = stored;

  select.addEventListener('change', () => {
    const lang = select.value;
    localStorage.setItem('answerLang', lang);
    const evt = new CustomEvent('answerLangChanged', { detail: lang });
    document.dispatchEvent(evt);
  });
}
