
/* 
1) Purpose: In-game footer UI with "Answers in Language" selector
2) Features: Lets user change answer language (en, fr, de)
3) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
4) Timestamp: 2025-05-31 23:50 | File: js/ui/ingameFoot.js
*/

export function renderIngameFoot() {
  const container = document.createElement('div');
  container.id = 'ingameFoot';

  const label = document.createElement('label');
  label.setAttribute('for', 'answerLangSelect');
  label.textContent = 'Answers in: ';

  const select = document.createElement('select');
  select.id = 'answerLangSelect';

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ];

  languages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang.value;
    option.textContent = lang.label;
    select.appendChild(option);
  });

  // Load saved selection
  const saved = localStorage.getItem('answerLang') || 'en';
  select.value = saved;

  select.addEventListener('change', () => {
    localStorage.setItem('answerLang', select.value);
    document.dispatchEvent(new CustomEvent('answerLangChanged', { detail: select.value }));
  });

  container.appendChild(label);
  container.appendChild(select);

  const gameArea = document.getElementById('gameArea');
  if (gameArea) {
    gameArea.appendChild(container);
  }
}
