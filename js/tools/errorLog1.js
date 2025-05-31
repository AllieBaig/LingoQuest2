
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

// ✅ Automatic Browser Error Catching
window.addEventListener("error", function (event) {
  const type = event.error?.name || "GenericError";
  const msg = `${type}: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`;
  logError(msg);
});

window.addEventListener("unhandledrejection", function (event) {
  const reason = event.reason;
  const type = reason?.name || "UnhandledPromiseRejection";
  const msg = `${type}: ${reason?.message || String(reason)}`;
  logError(msg);
});
