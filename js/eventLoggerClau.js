
/*
 * Purpose: Handles event logging and analytics for LingoQuest2
 * Features: Event tracking, user interactions, performance metrics
 * MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
 * Timestamp: 2025-06-02 15:30 | file: js/eventLogger.js
 */

/**
 * Logs events with timestamp and additional context
 * @param {string} eventName - Name of the event
 * @param {Object} data - Additional data associated with the event
 * @param {string} level - Log level: 'info', 'warn', 'error', 'debug'
 */
export function logEvent(eventName, data = {}, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        event: eventName,
        data,
        userAgent: navigator.userAgent,
        url: window.location.href
    };

    // Console logging with appropriate level
    const logMessage = `[${timestamp}] ${eventName}`;
    
    switch (level) {
        case 'error':
            console.error(`❌ ${logMessage}`, data);
            break;
        case 'warn':
            console.warn(`⚠️ ${logMessage}`, data);
            break;
        case 'debug':
            console.debug(`🐛 ${logMessage}`, data);
            break;
        default:
            console.log(`ℹ️ ${logMessage}`, data);
    }

    // Store in session storage for debugging (optional)
    try {
        const existingLogs = JSON.parse(sessionStorage.getItem('lingoquest_logs') || '[]');
        existingLogs.push(logEntry);
        
        // Keep only last 100 entries to prevent storage overflow
        if (existingLogs.length > 100) {
            existingLogs.splice(0, existingLogs.length - 100);
        }
        
        sessionStorage.setItem('lingoquest_logs', JSON.stringify(existingLogs));
    } catch (error) {
        console.warn('Failed to store log entry:', error);
    }
}

/**
 * Logs user interactions with UI elements
 * @param {string} element - The UI element that was interacted with
 * @param {string} action - The type of interaction (click, hover, etc.)
 * @param {Object} additionalData - Any additional context
 */
export function logUserInteraction(element, action, additionalData = {}) {
    logEvent('user_interaction', {
        element,
        action,
        ...additionalData
    });
}

/**
 * Logs game mode related events
 * @param {string} modeKey - The game mode identifier
 * @param {string} action - The action performed (start, complete, error, etc.)
 * @param {Object} additionalData - Additional context
 */
export function logGameEvent(modeKey, action, additionalData = {}) {
    logEvent('game_event', {
        mode: modeKey,
        action,
        ...additionalData
    });
}

/**
 * Logs performance metrics
 * @param {string} metric - The metric name
 * @param {number} value - The metric value
 * @param {string} unit - The unit of measurement
 */
export function logPerformance(metric, value, unit = 'ms') {
    logEvent('performance', {
        metric,
        value,
        unit
    }, 'debug');
}

/**
 * Logs errors with stack trace
 * @param {Error} error - The error object
 * @param {string} context - Additional context about where the error occurred
 */
export function logError(error, context = '') {
    logEvent('error', {
        message: error.message,
        stack: error.stack,
        context,
        name: error.name
    }, 'error');
}

/**
 * Retrieves stored logs for debugging
 * @returns {Array} Array of log entries
 */
export function getStoredLogs() {
    try {
        return JSON.parse(sessionStorage.getItem('lingoquest_logs') || '[]');
    } catch (error) {
        console.warn('Failed to retrieve stored logs:', error);
        return [];
    }
}

/**
 * Clears stored logs
 */
export function clearLogs() {
    try {
        sessionStorage.removeItem('lingoquest_logs');
        console.log('📝 Logs cleared');
    } catch (error) {
        console.warn('Failed to clear logs:', error);
    }
}


