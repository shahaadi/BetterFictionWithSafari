/**
 * Main function to apply UI changes and features based on user settings.
 * @returns {Promise<void>}
 */
async function main() {
    try {
        // Dynamic import of utility functions
        const { processPage } = await import(chrome.runtime.getURL('utils/ui-helpers.js'));

        // Detect page type based on URL
        const pageType = window.location.href.includes('crossover') ? 'crossover' : 'canon';

        // Process the entire page with one function call
        await processPage(pageType);
        
    } catch (error) {
        console.error('Failed to apply UI enhancements and features on list page:', error);
    }
}

main();
