/**
 * Universal page script that handles all page types by detecting them from the URL
 * Replaces: communities, community, crossover, forum, just-in, list, profile, search
 * Uses the exact same URL pattern matching logic as the original manifest.json
 * @returns {Promise<void>}
 */
async function main() {
    try {
        // Dynamic import of utility functions
        const { processPage } = await import(chrome.runtime.getURL('utils/ui-helpers.js'));

        // Detect page type based on URL using the exact same logic as manifest.json
        const url = window.location.href;
        let pageType = '';

        // Exact URL patterns from the original manifest.json
        if (url.match(/https:\/\/www\.fanfiction\.net\/anime\/.*\/.*/) ||
            url.match(/https:\/\/www\.fanfiction\.net\/book\/.*\/.*/) ||
            url.match(/https:\/\/www\.fanfiction\.net\/cartoon\/.*\/.*/) ||
            url.match(/https:\/\/www\.fanfiction\.net\/comic\/.*\/.*/) ||
            url.match(/https:\/\/www\.fanfiction\.net\/game\/.*\/.*/) ||
            url.match(/https:\/\/www\.fanfiction\.net\/misc\/.*\/.*/) ||
            url.match(/https:\/\/www\.fanfiction\.net\/movie\/.*\/.*/) ||
            url.match(/https:\/\/www\.fanfiction\.net\/play\/.*\/.*/) ||
            url.match(/https:\/\/www\.fanfiction\.net\/tv\/.*\/.*/)) {
            // These are story listing pages (list/canon)
            pageType = 'canon';
        } else if (url.match(/https:\/\/www\.fanfiction\.net\/u\/.*\/.*/)) {
            // Profile pages
            pageType = 'profile';
        } else if (url.match(/https:\/\/www\.fanfiction\.net\/.*\/.*\/.*\/.*/)) {
            // Crossover pages (4-level deep URLs)
            pageType = 'crossover';
        } else if (url.match(/https:\/\/www\.fanfiction\.net\/search\/.*/)) {
            // Search pages
            pageType = 'search';
        } else if (url.match(/https:\/\/www\.fanfiction\.net\/communities\/.*\/.*\/.*/)) {
            // Communities pages
            pageType = 'communities';
        } else if (url.match(/https:\/\/www\.fanfiction\.net\/community\/.*\/.*\/.*/)) {
            // Community pages
            pageType = 'community';
        } else if (url.match(/https:\/\/www\.fanfiction\.net\/forums\/.*\/.*\/.*/)) {
            // Forum pages
            pageType = 'forum';
        } else if (url.match(/https:\/\/www\.fanfiction\.net\/j\/.*/)) {
            // Just-in pages
            pageType = 'just-in';
        } else {
            // Default fallback
            pageType = 'canon';
        }

        // Process the entire page with one function call
        await processPage(pageType);
        
    } catch (error) {
        console.error('Failed to apply UI enhancements and features on universal page:', error);
    }
}

main(); 