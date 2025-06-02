
/* 
1) Purpose: Bootstraps LingoQuest2 app on load
2) Features: Loads profile, theme, header/footer, routes to main
3) Dependencies: profileManager.js, themeManager.js, uiHeader.js
4) Related: js/profile/, js/ui/, js/main.js
5) Special: Designed for large-button Minimal UI first
6) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
7) Timestamp: 2025-06-02 11:10 | File: js/app.js
*/

import { initProfile } from './profileManager.js';
import { applyTheme } from './themeManager.js';

window.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('🔧 Starting LingoQuest2 app initialization...');

    initProfile();
    console.log('👤 Profile initialized');

    applyTheme();
    console.log('🎨 Theme applied');

    console.log('📦 Loading header module...');
    const { renderAppHeader } = await import('./uiHeader.js');
    renderAppHeader();

    console.log('📦 Loading footer module...');
    const { renderAppFooter } = await import('./uiFooter.js');
    renderAppFooter();

    console.log('🧭 Loading main menu module...');
    const { renderGameMenu } = await import('./main.js');
    renderGameMenu();

    console.log('✅ App fully initialized.');
  } catch (err) {
    console.error('📛 App initialization failed:', err.message);
    console.error('📍 Error stack:', err.stack);

    const errorDiv = document.getElementById('errorLog');
    if (errorDiv) {
      errorDiv.innerHTML = `
        <h3>⚠️ LingoQuest2 Loading Error</h3>
        <p><strong>Reason:</strong> ${err.message}</p>
        <p>Check console for full stack trace.</p>
        <button onclick="location.reload()">🔄 Try Again</button>
      `;
    }

    // Optionally: show fallback UI
    document.getElementById('menuArea')?.classList.add('hidden');
    document.getElementById('gameArea')?.classList.add('hidden');
  }
});


