
/* 
1) Purpose: Bootstraps LingoQuest2 app on load
2) Features: Loads profile, theme, header/footer, routes to main
3) Dependencies: profileManager.js, themeManager.js, uiHeader.js
4) Related: js/profile/, js/ui/, js/main.js
5) Special: Designed for large-button Minimal UI first
6) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
7) Timestamp: 2025-05-30 20:00 | File: js/app.js
*/

import { initProfile } from './profile/profileManager.js';
import { applyTheme } from './themeManager.js';

window.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('🚀 Starting LingoQuest2 app initialization...');
    
    // Initialize static imports first
    console.log('📋 Initializing profile...');
    initProfile();
    
    console.log('🎨 Applying theme...');
    applyTheme();
    
    // Test dynamic imports one by one
    console.log('📤 Loading header module...');
    const headerModule = await import('./uiHeader.js');
    const { renderHeader } = headerModule;
    
    console.log('📥 Loading footer module...');
    const footerModule = await import('./uiFooter.js');
    const { renderFooter } = footerModule;
    
    console.log('🏠 Loading main menu module...');
    const mainModule = await import('./main.js');
    const { showMainMenu } = mainModule;
    
    // Render UI components
    console.log('🔧 Rendering header...');
    renderHeader();
    
    console.log('🔧 Rendering footer...');
    renderFooter();
    
    console.log('🔧 Showing main menu...');
    showMainMenu();
    
    console.log('✅ LingoQuest2 app initialized successfully!');
    
  } catch (error) {
    console.error('❌ App initialization failed:', error);
    console.error('📍 Error message:', error.message);
    console.error('📍 Error stack:', error.stack);
    
    // Show user-friendly error message
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
        <h2>⚠️ LingoQuest2 Loading Error</h2>
        <p>Sorry, there was a problem loading the application.</p>
        <details style="margin-top: 20px;">
          <summary>Technical Details (for developers)</summary>
          <pre style="text-align: left; background: #f5f5f5; padding: 10px; margin-top: 10px;">
Error: ${error.message}

Check the browser console for more details.
          </pre>
        </details>
        <p><a href="javascript:location.reload()">🔄 Try Again</a></p>
      </div>
    `;
  }
});
