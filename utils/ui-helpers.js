/**
 * UI Helper functions for BetterFiction extension
 * These functions are dynamically imported by content scripts
 */

/**
 * Creates a promise to get extension data
 * @param {string} messageType - The message type to send ('info' or 'links')
 * @returns {Promise<Object|Array>} Extension data
 */
export const createMessagePromise = (messageType = 'info') => {
    const fullMessage = 'get-' + messageType;
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ message: fullMessage })
            .then((response) => {
                resolve(response.result);
            })
            .catch((error) => {
                console.error(`Failed to retrieve ${fullMessage} data:`, error);
                resolve(messageType === 'info' ? {} : []);
            });
    });
};

/**
 * Applies big covers styling to images
 * @param {NodeList} images - Image elements
 * @param {NodeList} imagesParent - Parent container elements
 */
export const applyBigCovers = (images, imagesParent) => {
    images.forEach((element) => {
        element.style.width = '75px';
        element.style.height = '112px';
    });
    imagesParent.forEach((element) => {
        element.style.height = '115px';
    });
};

/**
 * Applies separate fics styling
 * @param {NodeList} imagesParent - Parent container elements
 */
export const applySeparateFics = (imagesParent) => {
    imagesParent.forEach((element) => {
        element.style.marginBottom = '10px';
        element.style.borderBottom = '1px solid #969696';
        element.style.borderTop = '1px solid #969696';
        element.style.borderRight = '1px solid #969696';
    });
};

/**
 * Applies better info color styling
 * @param {NodeList} imagesParent - Parent container elements
 */
export const applyBetterInfoColor = (imagesParent) => {
    imagesParent.forEach((element) => {
        const descriptionDiv = element.querySelector('div').querySelector('div');

        // Language color
        const languageSpan = descriptionDiv.querySelector('.lang');
        if (languageSpan) {
            if (languageSpan.innerText === 'English') {
                languageSpan.style.color = '#970000';
            } else if (languageSpan.innerText === 'Spanish') {
                languageSpan.style.color = '#ab8f00';
            } else {
                languageSpan.style.color = '#0000ff';
            }
        }

        // Status color
        const statusSpan = descriptionDiv.querySelector('.status');
        if (statusSpan) {
            statusSpan.style.color = '#00631f';
            statusSpan.style.fontWeight = '600';
        }

        // Rating color
        const ratingSpan = descriptionDiv.querySelector('.rated');
        if (ratingSpan) {
            ratingSpan.style.color = '#088383';
        }

        // Words and chapters color
        const wordsSpan = descriptionDiv.querySelector('.words-cnt');
        const chaptersSpan = descriptionDiv.querySelector('.chapters-cnt');
        if (wordsSpan) wordsSpan.style.color = '#000000';
        if (chaptersSpan) chaptersSpan.style.color = '#000000';

        // Favs, follows, reviews color
        const favSpan = descriptionDiv.querySelector('.fav-cnt');
        const followSpan = descriptionDiv.querySelector('.fol-cnt');
        const reviewSpan = descriptionDiv.querySelector('.rew-cnt');
        if (favSpan) favSpan.style.color = '#000000';
        if (followSpan) followSpan.style.color = '#000000';
        if (reviewSpan) reviewSpan.style.color = '#000000';

        // Genre color
        const genreSpan = descriptionDiv.querySelector('.genres');
        if (genreSpan) {
            genreSpan.style.color = '#903000';
        }
    });
};

/**
 * Marks fics with bookmarks
 * @param {NodeList} imagesParent - Parent container elements
 * @param {Array} bookmarkLinks - Bookmark data array
 */
export const markFicsWithBookmarks = (imagesParent, bookmarkLinks) => {
    imagesParent.forEach((element) => {
        if (bookmarkLinks.includes(element.querySelector('a').href)) {
            element.style.backgroundColor = '#e1edff';
            const bookmarkIcon = document.createElement('img');
            bookmarkIcon.src = chrome.runtime.getURL('icons/bookmark1.png');
            bookmarkIcon.width = '14';
            bookmarkIcon.height = '14';
            element.querySelector('div').before(bookmarkIcon);
        }
    });
};

/**
 * Processes text arrays to add count spans
 * @param {Element} span - The span element to process
 * @param {string} className - The CSS class name for the count span
 */
export const processSpan = (span, className) => {
    if (span) {
        const textArray = span.innerText.split(' ');
        textArray[1] = `<span class='${className}-cnt'>${textArray[1]}</span>`;
        span.innerHTML = textArray.join(' ');
    }
};

/**
 * Applies better info styling with page-specific customizations
 * @param {NodeList} imagesParent - Parent container elements
 * @param {Object} settings - Extension settings
 * @param {string} pageType - Type of page ('search', 'crossover', 'profile', etc.)
 */
export const applyBetterInfo = (imagesParent, settings, pageType = '') => {
    imagesParent.forEach((element) => {
        const descriptionDiv = element.querySelector('div').querySelector('div');
        
        if (settings.bigCovers) {
            descriptionDiv.style.marginLeft = '62px';
        }
        
        let fandomSpans;
        let genreSpan;
        let wordsSpan;
        let followSpan;
        let publishedSpan;
        let hasExtraInfo = 0;
        
        genreSpan = descriptionDiv.querySelector('.genres');
        fandomSpans = element.querySelectorAll('.fran');
        
        if (fandomSpans[fandomSpans.length - 1]) {
            fandomSpans[fandomSpans.length - 1].after(document.createElement('br'));
        }

        if (genreSpan) {
            genreSpan.after(document.createElement('br'));
        } else {
            descriptionDiv.querySelector('.lang').after(document.createElement('br'));
        }

        wordsSpan = descriptionDiv.querySelector('.words');
        wordsSpan.after(document.createElement('br'));

        followSpan = descriptionDiv.querySelector('.follow');
        if (followSpan) {
            followSpan.after(document.createElement('br'));
        } else if (descriptionDiv.querySelector('.fav')) {
            descriptionDiv.querySelector('.fav').after(document.createElement('br'));
        } else if (descriptionDiv.querySelector('.review')) {
            descriptionDiv.querySelector('.review').after(document.createElement('br'));
        } else {
            hasExtraInfo = 1;
        }

        publishedSpan = descriptionDiv.querySelector('.published');
        if (descriptionDiv.querySelector('.status') || descriptionDiv.querySelector('.characters')) {
            publishedSpan.after(document.createElement('br'));
        }

        element.style.height = 'auto';
        element.style.minHeight = '120px';

        descriptionDiv.innerHTML = descriptionDiv.innerHTML.replace(/<br>.{2}/g, '<br>');
    });
};

/**
 * Applies fandom styling (bold font weight)
 * @param {NodeList} imagesParent - Parent container elements
 */
export const applyFandomStyling = (imagesParent) => {
    imagesParent.forEach((element) => {
        const descriptionDiv = element.querySelector('div').querySelector('div');
        const fandomSpans = descriptionDiv.querySelectorAll('.fran');
        fandomSpans.forEach((span) => {
            span.style.fontWeight = '600';
        });
    });
};

/**
 * Universal meta span processor that handles common functionality for all page types
 * @param {NodeList} imagesParent - Parent container elements
 * @param {string} pageType - Type of page for specific processing
 */
export const processMetaSpans = (imagesParent, pageType) => {
    for (const element of imagesParent) {
        const descriptionDiv = element.querySelector('div')?.querySelector('div');
        if (!descriptionDiv) continue;

        // Create spans from description text
        const metaItems = descriptionDiv.innerText.split(' - ');
        const newString = metaItems.map((item) => `<span>${item}</span>`).join(' - ');
        descriptionDiv.innerHTML = newString;
        const metaSpans = descriptionDiv.querySelectorAll('span');
        if (!metaSpans || metaSpans.length === 0) continue;

        // Apply page-specific class assignments with null checks
        if (pageType === 'story' || pageType === 'search' || pageType === 'just-in' || pageType === 'crossover' || pageType === 'community' || pageType === 'profile') {
            // Story pages logic
            if (metaSpans[0] && !metaSpans[0].innerText.includes('Rated')) {
                if (metaSpans[0].innerText === 'Crossover') {
                    if (metaSpans[0]) metaSpans[0].classList = 'fran';
                    if (metaSpans[1]) metaSpans[1].classList = 'fran';
                    if (metaSpans[3]) metaSpans[3].classList = 'lang';
                    if (metaSpans[4] && !metaSpans[4].innerText.includes('Chapters')) {
                        metaSpans[4].classList = 'genres';
                    }
                } else {
                    if (metaSpans[0]) metaSpans[0].classList = 'fran';
                    if (metaSpans[2]) metaSpans[2].classList = 'lang';
                    if (metaSpans[3] && !metaSpans[3].innerText.includes('Chapters')) {
                        metaSpans[3].classList = 'genres';
                    }
                }
            } else {
                if (metaSpans[1]) metaSpans[1].classList = 'lang';
                if (metaSpans[2] && !metaSpans[2].innerText.includes('Chapters')) {
                    metaSpans[2].classList = 'genres';
                }
            }

            if (metaSpans[metaSpans.length - 1] && metaSpans[metaSpans.length - 1].innerText === 'Complete') {
                metaSpans[metaSpans.length - 1].classList = 'status';
            }
        } else if (pageType === 'forum' || pageType === 'communities') {
            // Forum and communities pages logic
            if (metaSpans[0]) metaSpans[0].classList = 'lang';
        } else if (pageType === 'canon') {
            // Canon pages logic
            if (metaSpans[1]) metaSpans[1].classList = 'lang';
            if (metaSpans[2] && !metaSpans[2].innerText.includes('Chapters')) {
                metaSpans[2].classList = 'genres';
            }
        }

        // Apply universal span type classifications with null checks
        for (const span of metaSpans) {
            if (!span) continue;
            
            const item = span.innerText;
            let spanType = '';
            
            // Universal span types (common across all pages)
            if (item.includes('Rated')) {
                spanType = 'rated';
            } else if (item.includes('Chapters')) {
                spanType = 'chapters';
            } else if (item.includes('Words')) {
                spanType = 'words';
            } else if (item.includes('Reviews')) {
                spanType = 'review';
            } else if (item.includes('Favs')) {
                spanType = 'fav';
            } else if (item.includes('Follows')) {
                spanType = 'follow';
            } else if (item.includes('Updated')) {
                spanType = 'updated';
            } else if (item.includes('Published')) {
                spanType = 'published';
            } else if (item.includes('Complete')) {
                spanType = 'status';
            }
            
            // Page-specific span types
            if (pageType === 'forum') {
                if (item.includes('Topics')) {
                    spanType = 'top';
                } else if (item.includes('Posts')) {
                    spanType = 'pst';
                } else if (item.includes('Since')) {
                    spanType = 'since';
                } else if (item.includes('Admin')) {
                    spanType = 'admin';
                }
            } else if (pageType === 'communities') {
                if (item.includes('Staff')) {
                    spanType = 'stf';
                } else if (item.includes('Archive')) {
                    spanType = 'arh';
                } else if (item.includes('Followers')) {
                    spanType = 'fol';
                } else if (item.includes('Since')) {
                    spanType = 'since';
                } else if (item.includes('Founder')) {
                    spanType = 'founder';
                }
            }

            if (spanType) {
                span.classList.add(spanType);
            }
        }

        // Handle page-specific special cases with null checks
        if (pageType === 'canon') {
            const characterSpan = descriptionDiv.querySelector(':not([class])');
            if (characterSpan) {
                characterSpan.className = 'characters';
            }
        }

        // Process common spans with null checks
        const wordsSpan = descriptionDiv.querySelector('.words');
        const chaptersSpan = descriptionDiv.querySelector('.chapters');
        const favSpan = descriptionDiv.querySelector('.fav');
        const followSpan = descriptionDiv.querySelector('.follow');
        const reviewSpan = descriptionDiv.querySelector('.review');

        processSpan(wordsSpan, 'words');
        processSpan(chaptersSpan, 'chapters');
        processSpan(favSpan, 'fav');
        processSpan(followSpan, 'fol');
        processSpan(reviewSpan, 'rew');

        // Page-specific span processing
        if (pageType === 'forum') {
            const topicsSpan = descriptionDiv.querySelector('.top');
            const postsSpan = descriptionDiv.querySelector('.pst');
            processSpan(topicsSpan, 'top');
            processSpan(postsSpan, 'pst');
        } else if (pageType === 'communities') {
            const staffSpan = descriptionDiv.querySelector('.stf');
            const followSpan = descriptionDiv.querySelector('.fol');
            const archiveSpan = descriptionDiv.querySelector('.arh');
            processSpan(staffSpan, 'stf');
            processSpan(followSpan, 'fol');
            processSpan(archiveSpan, 'arh');
        }
    }
};

/**
 * Main page processor that handles all common functionality
 * @param {string} pageType - Type of page ('search', 'crossover', 'just-in', 'community', 'profile', 'forum', 'communities', 'canon')
 * @returns {Promise<void>}
 */
export const processPage = async (pageType) => {
    // Get settings
    const settings = await createMessagePromise();
    
    // Determine selectors based on page type
    let imagesParentSelector, imagesSelector;
    
    switch (pageType) {
        case 'search':
        case 'just-in':
        case 'community':
        case 'communities':
        case 'forum':
            imagesParentSelector = '.z-list';
            imagesSelector = '.cimage';
            break;
        case 'crossover':
            imagesParentSelector = '.z-list.zhover';
            imagesSelector = '.cimage';
            break;
        case 'profile':
            imagesParentSelector = '.mystories, .favstories';
            imagesSelector = '[height="66"]';
            break;
        case 'canon':
            imagesParentSelector = '[class="z-list zhover zpointer "]';
            imagesSelector = '.cimage';
            break;
        default:
            console.error(`Unknown page type: ${pageType}`);
            return;
    }

    const imagesParent = document.querySelectorAll(imagesParentSelector);
    const images = document.querySelectorAll(imagesSelector);

    // Process meta spans using universal function
    processMetaSpans(imagesParent, pageType);

    // Apply common styling
    if (settings.bigCovers) {
        applyBigCovers(images, imagesParent);
    }

    if (settings.separateFics) {
        applySeparateFics(imagesParent);
    }

    if (settings.betterInfoColor) {
        applyBetterInfoColor(imagesParent);
        
        // Apply page-specific styling
        if (['search', 'crossover', 'profile'].includes(pageType)) {
            applyFandomStyling(imagesParent);
        }
    }

    if (settings.betterInfo) {
        applyBetterInfo(imagesParent, settings, pageType);
    }

    // Handle bookmarks if needed
    if (settings.markFicWithBookmark && ['just-in', 'crossover', 'profile', 'canon'].includes(pageType)) {
        const bookmarkLinks = await createMessagePromise('links');
        markFicsWithBookmarks(imagesParent, bookmarkLinks);
    }
}; 