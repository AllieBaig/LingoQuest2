
/* 
1) Purpose: Logs critical errors in-game to bottom of index page
2) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
3) Timestamp: 2025-06-01 00:10 | File: tools/errorLog.js
*/

export function logError(message) {
  console.error('[ErrorLog]', message);
  const el = document.getElementById('errorLog');
  if (el) {
    const line = document.createElement('div');
    line.textContent = `⚠️ ${message}`;
    el.appendChild(line);
  }
}
