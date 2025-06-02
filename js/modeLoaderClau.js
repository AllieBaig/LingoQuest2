
/*
 * Purpose: Handles dynamic loading of game mode modules
 * Features: Asynchronous module loading with error handling
 * MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
 * Timestamp: 2025-06-02 15:30 | file: js/modelLoader.js
 */

import { handleGameLoadError } from './modeHelper.js';

/**
 * Dynamically loads a game mode module
 * @param {string} modeKey - The key identifying the game mode
 * @returns {Promise<Object>} The loaded game mode module
 */
export async function loadMode(modeKey) {
    try {
        console.log(`🔄 Loading game mode: ${modeKey}`);
        
        // Construct the module path based on the mode key
        const modulePath = `./modes/${modeKey}.js`;
        
        // Dynamically import the module
        const module = await import(modulePath);
        
        console.log(`✅ Successfully loaded: ${modeKey}`);
        return module;
        
    } catch (error) {
        console.error(`❌ Failed to load mode: ${modeKey}`, error);
        
        // Handle the error using the helper function
        handleGameLoadError(error, modeKey);
        
        // Return a fallback module or throw the error
        throw new Error(`Failed to load game mode: ${modeKey}`);
    }
}

/**
 * Preloads multiple game modes
 * @param {string[]} modeKeys - Array of mode keys to preload
 * @returns {Promise<Object>} Object containing loaded modules
 */
export async function preloadModes(modeKeys) {
    const loadedModes = {};
    
    for (const modeKey of modeKeys) {
        try {
            loadedModes[modeKey] = await loadMode(modeKey);
        } catch (error) {
            console.warn(`⚠️ Failed to preload mode: ${modeKey}`, error);
        }
    }
    
    return loadedModes;
}

/**
 * Checks if a game mode module exists
 * @param {string} modeKey - The mode key to check
 * @returns {Promise<boolean>} True if the module exists
 */
export async function modeExists(modeKey) {
    try {
        await loadMode(modeKey);
        return true;
    } catch (error) {
        return false;
    }
}
