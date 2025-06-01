
/* 
1) Purpose: Renders main menu and routes game mode selection
2) Features: Injects game mode buttons (e.g. MixLingo, Echo Expedition), uses modeLoader.js
3) Dependencies: modeLoader.js, eventLogger.js
4) Related: Called from app.js after profile/theme setup
5) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
6) Timestamp: 2025-06-01 01:10 | File: js/main.js
*/

import { logEvent } from './tools/eventLogger.js';
import { loadMode } from './modeLoader.js';
import { renderSettingsPanel } from './ui/uiSettingsPanel.js';

// Game mode configuration
const gameModes = [
  {
    id: 'echoExpBtn',
    emoji: '🗺️',
    title: 'Echo Expedition',
    modeKey: 'echoexp',
    i18nKey: 'start_echo_expedition'
  },
  {
    id: 'mixLingoBtn', 
    emoji: '🌍',
    title: 'MixLingo',
    modeKey: 'mixlingo',
    i18nKey: 'start_mixlingo'
  },
  {
    id: 'relicBtn',
    emoji: '🏺', 
    title: 'Relic Mode',
    modeKey: 'relic',
    i18nKey: 'start_relic'
  }
];

export function showMainMenu() {
  const menu = document.getElementById('menuArea');
  if (!menu) {
    console.error('Menu area not found');
    return;
  }

  // Clear existing content
  menu.innerHTML = '';
  menu.hidden = false;
  
  // Ensure game area is hidden
  const gameArea = document.getElementById('gameArea');
  if (gameArea) {
    gameArea.hidden = true;
  }

  // Create main heading
  const heading = document.createElement('h2');
  heading.textContent = 'Choose a Game Mode';
  heading.className = 'menu-heading';
  menu.appendChild(heading);

  // Create game mode buttons container
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'game-modes-container';

  // Generate buttons for each game mode
  gameModes.forEach(mode => {
    const button = createGameModeButton(mode);
    buttonsContainer.appendChild(button);
  });

  menu.appendChild(buttonsContainer);

  // Add settings panel after menu
  renderSettingsPanel();
  
  // Log menu display
  logEvent('menu_displayed', { 
    timestamp: Date.now(),
    availableModes: gameModes.map(m => m.modeKey)
  });
}

function createGameModeButton(modeConfig) {
  const button = document.createElement('button');
  button.id = modeConfig.id;
  button.className = 'game-mode-btn';
  button.textContent = `${modeConfig.emoji} ${modeConfig.title}`;
  button.setAttribute('data-i18n', modeConfig.i18nKey);
  button.setAttribute('aria-label', `Start ${modeConfig.title} game mode`);

  // Add click event listener
  button.addEventListener('click', async () => {
    await handleModeSelection(modeConfig);
  });

  // Add keyboard support
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      button.click();
    }
  });

  return button;
}

async function handleModeSelection(modeConfig) {
  try {
    // Log button click
    logEvent('button_click', { 
      id: modeConfig.id, 
      label: modeConfig.title,
      modeKey: modeConfig.modeKey
    });

    // Disable button to prevent double-clicks
    const button = document.getElementById(modeConfig.id);
    if (button) {
      button.disabled = true;
      button.textContent = `${modeConfig.emoji} Loading...`;
    }

    // Load and start the game mode
    const mode = await loadMode(modeConfig.modeKey);
    
    if (mode && mode.start) {
      await mode.start();
    } else {
      throw new Error(`Mode ${modeConfig.modeKey} does not have a start function`);
    }

  } catch (error) {
    console.error(`Failed to load mode ${modeConfig.modeKey}:`, error);
    
    // Log the error
    logEvent('mode_load_error', {
      modeKey: modeConfig.modeKey,
      error: error.message
    });

    // Show error to user
    showModeLoadError(modeConfig.title, error.message);
    
    // Re-enable button
    const button = document.getElementById(modeConfig.id);
    if (button) {
      button.disabled = false;
      button.textContent = `${modeConfig.emoji} ${modeConfig.title}`;
    }
  }
}

function showModeLoadError(modeTitle, errorMessage) {
  const menu = document.getElementById('menuArea');
  if (!menu) return;

  // Remove any existing error messages
  const existingError = menu.querySelector('.mode-error');
  if (existingError) {
    existingError.remove();
  }

  // Create error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'mode-error';
  errorDiv.innerHTML = `
    <div class="error-content">
      <h3>❌ Failed to Load ${modeTitle}</h3>
      <p>${errorMessage}</p>
      <button class="error-dismiss-btn" onclick="this.parentElement.parentElement.remove()">
        Dismiss
      </button>
    </div>
  `;

  // Insert error message at the top of menu
  const heading = menu.querySelector('.menu-heading');
  if (heading) {
    heading.insertAdjacentElement('afterend', errorDiv);
  } else {
    menu.insertBefore(errorDiv, menu.firstChild);
  }

  // Auto-remove error after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 5000);
}

// Export utility functions for potential external use
export { handleModeSelection, createGameModeButton };

// Initialize settings panel when module loads
renderSettingsPanel();
