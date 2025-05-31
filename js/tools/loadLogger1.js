
/* 
1) Purpose: Logs script/page load times and device info
2) Stores: LocalStorage or sends to remote file endpoint
3) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
4) Timestamp: 2025-05-31 22:30 | File: tools/loadLogger.js
*/

export function logPageLoadTime(scriptName = 'app.js') {
  const loadTime = performance.now().toFixed(2);
  const device = navigator.userAgent;
  const timestamp = new Date().toISOString();

  const entry = {
    script: scriptName,
    time: `${loadTime} ms`,
    device,
    when: timestamp
  };

  // Log to console
  console.log('[LoadLogger]', entry);

  // Save locally (fallback)
  const existing = JSON.parse(localStorage.getItem('loadLogs') || '[]');
  existing.push(entry);
  localStorage.setItem('loadLogs', JSON.stringify(existing));

  // TODO: Optional — POST to remote server here
  /*
  fetch('https://your-server.com/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  });
  */
}
