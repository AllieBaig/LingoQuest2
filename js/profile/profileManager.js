

/* 
1) Purpose: Manages block-based user profile (UUID, nickname, avatar)
2) Features: Generates + persists user identity, XP, and emoji avatar
3) Dependencies: localStorage only
4) Related: themeManager.js, uiHeader.js
5) Special: Uses emoji nicknames for senior-friendly feel
6) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
7) Timestamp: 2025-05-30 20:01 | File: js/profile/profileManager.js
*/

export function initProfile() {
  if (!localStorage.getItem('profile')) {
    const newProfile = {
      uuid: crypto.randomUUID(),
      nickname: generateNickname(),
      avatar: pickEmoji(),
      xp: 0
    };
    localStorage.setItem('profile', JSON.stringify(newProfile));
  }
}

export function getProfile() {
  return JSON.parse(localStorage.getItem('profile'));
}

export function addXP(amount) {
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');
  profile.xp = (profile.xp || 0) + amount;
  localStorage.setItem('profile', JSON.stringify(profile));
}


function generateNickname() {
  const animals = ['Fox', 'Bear', 'Owl', 'Lion', 'Cat'];
  const colors = ['Red', 'Blue', 'Green', 'Silver', 'Gold'];
  return `${colors[Math.floor(Math.random() * colors.length)]} ${animals[Math.floor(Math.random() * animals.length)]}`;
}

function pickEmoji() {
  const emojis = ['🦊', '🐻', '🦉', '🦁', '🐱'];
  return emojis[Math.floor(Math.random() * emojis.length)];
}
