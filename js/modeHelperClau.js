
/*
 * Purpose: Helper functions for game mode management
 * Features: Error handling, mode validation, utility functions
 * MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
 * Timestamp: 2025-06-02 15:30 | file: js/modeHelper.js
 */

import { logError, logEvent } from './eventLogger.js';

/**
 * Handles errors that occur during game mode loading
 * @param {Error} error - The error that occurred
 * @param {string} modeKey - The mode that failed to load
 */
export function handleGameLoadError(error, modeKey) {
    // Log the error
    logError(error, `Loading game mode: ${modeKey}`);
    
    // Log the event for analytics
    logEvent('game_load_error', {
        mode: modeKey,
        errorMessage: error.message,
        errorType: error.name
    }, 'error');

    // Display user-friendly error message
    showErrorToUser(modeKey, error);
    
    // Optionally attempt fallback or recovery
    attemptFallback(modeKey);
}

/**
 * Shows a user-friendly error message
 * @param {string} modeKey - The mode that failed to load
 * @param {Error} error - The original error
 */
function showErrorToUser(modeKey, error) {
    const errorContainer = document.getElementById('error-container') || createErrorContainer();
    
    const errorMessage = `
        <div class="error-alert">
            <h3>🚨 LingoQuest2 Loading Error</h3>
            <p><strong>Failed to load game mode:</strong> ${modeKey}</p>
            <p><strong>Reason:</strong> ${getErrorMessage(error)}</p>
            <button onclick="location.reload()" class="retry-button">🔄 Try Again</button>
            <button onclick="this.parentElement.remove()" class="close-button">✕ Close</button>
        </div>
    `;
    
    errorContainer.innerHTML = errorMessage;
    errorContainer.style.display = 'block';
}

/**
 * Creates an error container if it doesn't exist
 * @returns {HTMLElement} The error container element
 */
function createErrorContainer() {
    const container = document.createElement('div');
    container.id = 'error-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        max-width: 400px;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .error-alert {
            padding: 20px;
            color: #721c24;
            background: #f8d7da;
            border-radius: 8px;
        }
        .error-alert h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
        }
        .error-alert p {
            margin: 5px 0;
            font-size: 14px;
        }
        .retry-button, .close-button {
            margin: 10px 5px 0 0;
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        .retry-button {
            background: #007bff;
            color: white;
        }
        .retry-button:hover {
            background: #0056b3;
        }
        .close-button {
            background: #6c757d;
            color: white;
        }
        .close-button:hover {
            background: #545b62;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(container);
    return container;
}

/**
 * Gets a user-friendly error message
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
function getErrorMessage(error) {
    if (error.message.includes('Failed to fetch')) {
        return 'Network connection issue or file not found';
    }
    if (error.message.includes('404')) {
        return 'Game mode file not found';
    }
    if (error.message.includes('SyntaxError')) {
        return 'Game mode file has syntax errors';
    }
    return error.message || 'Unknown error occurred';
}

/**
 * Attempts to provide a fallback when a mode fails to load
 * @param {string} modeKey - The mode that failed to load
 */
function attemptFallback(modeKey) {
    logEvent('attempting_fallback', { originalMode: modeKey });
    
    // You could implement fallback logic here, such as:
    // - Loading a default/demo mode
    // - Showing offline content
    // - Redirecting to a working mode
    
    console.log(`🔄 Attempting fallback for failed mode: ${modeKey}`);
}

/**
 * Validates if a mode key is valid
 * @param {string} modeKey - The mode key to validate
 * @returns {boolean} True if valid
 */
export function isValidModeKey(modeKey) {
    const validModes = ['mixlingo', 'echoexpedition', 'wordrelic', 'cinequest', 'hollybolly'];
    return validModes.includes(modeKey);
}

/**
 * Sanitizes a mode key for safe usage
 * @param {string} modeKey - The mode key to sanitize
 * @returns {string} Sanitized mode key
 */
export function sanitizeModeKey(modeKey) {
    return modeKey.toLowerCase().replace(/[^a-z0-9]/g, '');
}
