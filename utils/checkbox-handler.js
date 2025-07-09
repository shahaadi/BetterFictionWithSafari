/**
 * Checkbox handler utility for BetterFiction extension
 * This file is included via script tags in popup and tabs HTML files
 */

/**
 * Sets up checkbox event handlers for extension settings
 * Loads current settings and saves changes to chrome storage
 */
window.setupCheckboxes = () => {
    const checkboxes = document.querySelectorAll('[type="checkbox"]');

    for (const checkbox of checkboxes) {
        // Load current checkbox state
        chrome.storage.sync.get('settings')
            .then((result) => {
                const settings = result.settings;
                if (settings && settings[checkbox.id] !== undefined) {
                    checkbox.checked = settings[checkbox.id];
                }
            })
            .catch((error) => {
                console.error(`Failed to load checkbox state for ${checkbox.id}:`, error);
            });

        // Handle checkbox changes
        checkbox.addEventListener('click', () => {
            chrome.storage.sync.get('settings')
                .then((result) => {
                    let settings = result.settings;
                    if (!settings) {
                        settings = {};
                    }
                    settings[checkbox.id] = checkbox.checked;
                    return chrome.storage.sync.set({ settings: settings });
                })
                .catch((error) => {
                    console.error(`Failed to save checkbox state for ${checkbox.id}:`, error);
                });
        });
    }
}; 