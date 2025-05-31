/* 
1) Purpose: Logs all user interactions like button/menu clicks
2) Features: Console + localStorage log for analytics/debug
3) Dependencies: None
4) Related: Called from buttons, menus, dropdowns
5) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
6) Timestamp: 2025-05-31 22:50 | File: tools/eventLogger.js
*/

export function logEvent(action, detail = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    detail,
    device: navigator.userAgent
  };

  console.log('[EventLog]', logEntry);

  // Store locally
  const existing = JSON.parse(localStorage.getItem('eventLogs') || '[]');
  existing.push(logEntry);
  localStorage.setItem('eventLogs', JSON.stringify(existing));

  // Future: Upload to remote endpoint here
  // fetch('/api/log', { method: 'POST', body: JSON.stringify(logEntry) });
}
