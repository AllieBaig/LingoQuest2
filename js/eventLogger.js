

/*
1) Purpose: Centralized logging for user interactions and app events.
2) Features: Logs all game actions, errors, setting changes, mode starts, etc.
3) Used in: All game modes and shared modules (modeHelpers, themeManager, etc.)
4) Future Scope: Extend to send logs to a server or analytics endpoint.
5) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
6) Timestamp: 2025-06-01 23:59 | File: js/tools/eventLogger.js
*/

// ✅ Logs all events consistently across app
export function logEvent(type, data = {}) {
  const timestamp = new Date().toISOString();
  const entry = {
    type,
    data,
    timestamp,
    user: getUserProfile(),
  };

  console.log('📋 EventLog:', entry);

  // ⬇️ Future: Send to remote analytics server
  // navigator.sendBeacon('/log', JSON.stringify(entry));
}

// ✅ Example minimal user ID or nickname (extendable)
function getUserProfile() {
  const nickname = localStorage.getItem('nickname') || 'Anonymous';
  const profileID = localStorage.getItem('profile-id') || 'unknown-id';
  return { nickname, profileID };
}
