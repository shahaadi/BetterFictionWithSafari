/**
 * Main function to apply UI changes and features based on user settings.
 * @returns {Promise<void>}
 */
async function main() {
    try {
        // Dynamic import of utility functions
        const { processPage } = await import(chrome.runtime.getURL('utils/ui-helpers.js'));
        
        // Process the entire page with one function call
        await processPage('just-in');
        
    } catch (error) {
        console.error('Failed to apply UI enhancements and features on just-in page:', error);
    }
}

main();

