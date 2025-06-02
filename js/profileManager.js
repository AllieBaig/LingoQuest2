
/* 
 * Purpose: Manage user profile without login
 * Features: Device-based UUID, nickname generator, persistent XP
 * Depends on: localStorage
 * MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
 * Timestamp: 2025-06-02 23:58 | File: profile/profileManager.js
 */

const PROFILE_KEY = 'lq2-profile';

export function getUserProfile() {
  const stored = localStorage.getItem(PROFILE_KEY);
  if (stored) return JSON.parse(stored);

  const newProfile = createDefaultProfile();
  localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
  return newProfile;
}

export function saveUserProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function addXPToProfile(amount = 10) {
  const profile = getUserProfile();
  profile.xp = (profile.xp || 0) + amount;
  profile.level = Math.floor(profile.xp / 100) + 1;
  saveUserProfile(profile);
  return profile;
}

function createDefaultProfile() {
  return {
    id: generateUUID(),
    nickname: generateNickname(),
    xp: 0,
    level: 1,
    created: Date.now()
  };
}

function generateUUID() {
  return 'lq2-' + Math.random().toString(36).substring(2, 10);
}

function generateNickname() {
  const adjectives = ['Brave', 'Silent', 'Quick', 'Wise', 'Clever', 'Nimble'];
  const animals = ['Tiger', 'Owl', 'Fox', 'Panda', 'Dolphin', 'Wolf'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const ani = animals[Math.floor(Math.random() * animals.length)];
  return `${adj}${ani}`;
}

// js/profileManager.js

/*
export function initProfile() {
  console.log('🔐 Profile initialized.');
  // load nickname, avatar, XP, etc.
}
*/


export function initProfile() {
  getUserProfile(); // ensures profile exists
  console.log('🧑‍💼 Profile initialized.');
}



