
/*
1) Purpose: Renders a dropdown to filter movie-related game modes by decade.
2) Features: Dispatches a custom 'cinequestDecadeChanged' event on change.
3) Used in: renderIngameHead() for CineQuest, HollyBolly (optional).
4) Persists selection via localStorage key: 'cinequest-decade'
5) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
6) Timestamp: 2025-06-01 23:59 | File: js/decadeDropdown.js
*/

export function renderDecadeDropdown(containerId = 'gameArea') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'decade-dropdown';
  wrapper.innerHTML = `
    <label for="decadeSelect" style="margin-right: 6px;">🎞️ Decade:</label>
    <select id="decadeSelect">
      <option value="all">All</option>
      <option value="1970s">1970s</option>
      <option value="1980s">1980s</option>
      <option value="1990s">1990s</option>
      <option value="2000s">2000s</option>
      <option value="2010s">2010s</option>
      <option value="2020s">2020s</option>
    </select>
  `;

  container.appendChild(wrapper);

  const select = wrapper.querySelector('#decadeSelect');
  const storedDecade = localStorage.getItem('cinequest-decade') || 'all';
  select.value = storedDecade;

  select.addEventListener('change', () => {
    const decade = select.value;
    localStorage.setItem('cinequest-decade', decade);
    const evt = new CustomEvent('cinequestDecadeChanged', { detail: decade });
    document.dispatchEvent(evt);
  });
}
