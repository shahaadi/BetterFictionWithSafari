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
// replace with a function that splits the id out of the link and searches the bookmarkLinks for the id, not the link itself

// List of meta types and their corresponding [fontWeight, color] (null if no change)
export const metaTypes = {
    FandomMetaType: ['600', null],
    RatedMetaType: [null, '#088383'],
    LanguageMetaType: {
        English: [null, '#970000'],
        Spanish: [null, '#ab8f00'],
        default: [null, '#0000ff'],
    },
    GenreMetaType: [null, '#903000'],
    ChaptersMetaType: [null, '#000000'],
    WordsMetaType: [null, '#000000'],
    ReviewMetaTypes: [null, '#000000'],
    FavsMetaType: [null, '#000000'],
    FollowsMetaType: [null, '#000000'],
    UpdatedMetaType: [null, null],
    PublishedMetaType: [null, null],
    CharactersMetaType: [null, null],
    CompleteMetaType: ['600', '#00631f'],
    StaffMetaType: [null, '#000000'],
    ArchiveMetaType: [null, '#000000'],
    FollowersMetaType: [null, '#000000'],
    TopicsMetaType: [null, '#000000'],
    PostsMetaType: [null, '#000000'],
    SinceMetaType: [null, null],
    FounderMetaType: [null, null],
    AdminMetaType: [null, null],
    idMetaType: [null, null],
};

/**
 * Universal meta span processor that handles common functionality for all page types
 * @param {NodeList} imagesParent - Parent container elements
 * @param {string} pageType - Type of page for specific processing
 */
export const processMetaSpans = (imagesParent, pageType) => {
    // Use the shared metaTypes array
    for (const element of imagesParent) {
        const descriptionDiv = element.querySelector('div')?.querySelector('div');
        if (!descriptionDiv) continue;

        // Create spans from description text
        const metaItems = descriptionDiv.innerText.split(' - ');
        const newString = metaItems.map((item) => `<span>${item}</span>`).join(' - ');
        descriptionDiv.innerHTML = newString;
        const metaSpans = descriptionDiv.querySelectorAll('span');
        if (!metaSpans || metaSpans.length === 0) continue;

        // Apply universal span type classifications with null checks
        for (const span of metaSpans) {
            if (!span) continue;
            
            const item = span.innerText;
            let metaType = '';
        
            // Check if any of the metaTypes are found in item
            for (const check of Object.keys(metaTypes)) {
                if (item.includes(check.replace('MetaType', '') + ': ')) {
                    metaType = check.toLowerCase();
                    break;
                } else if (item.includes('Complete')) {
                    metaType = 'completemetatype';
                    break;
                }
            }

            if (metaType) {
                span.classList.add(metaType);
            }
        }

        let counter = 0;
        
        // Check if there's a 'sinceMetaType' span type in metaSpans
        const hasSinceSpan = Array.from(metaSpans).some(span => span.classList.contains('sincemetatype'));
        
        // Apply fandom class - only if first span is not ratedMetaType, is crossover or fandom, and there's no sinceMetaType span
        if (!hasSinceSpan && metaSpans[counter] && metaSpans[counter].classList.length === 0) {
            if (metaSpans[counter].innerText === 'Crossover') {
                metaSpans[counter].classList = 'fandommetatype';
                counter++;
            }
            metaSpans[counter].classList = 'fandommetatype';
            counter++;
        }

        if (metaSpans[counter] && metaSpans[counter].classList.length > 0) {
            counter++;
        }

        // Apply languageMetaType class - only if first span is not ratedMetaType
        if (metaSpans[counter] && metaSpans[counter].classList.length === 0) {
            metaSpans[counter].classList = 'languagemetatype';
            counter++;
        }

        // Apply genreMetaType class
        if (!hasSinceSpan && metaSpans[counter] && metaSpans[counter].classList.length === 0) {
            metaSpans[counter].classList = 'genremetatype';
            counter++;
        }

        // Handle character span (list-specific)
        const characterSpan = descriptionDiv.querySelector(':not([class])');
        if (!hasSinceSpan && characterSpan) {
            characterSpan.className = 'charactersmetatype';
        }

        // Process spans that have count values by checking if they contain numbers
        for (const metaType of Object.keys(metaTypes)) {
            const className = metaType.toLowerCase();
            const selector = `.${className}`;
            const span = descriptionDiv.querySelector(selector);
            
            // Only process spans that contain ": " followed by a digit (indicating they have count values)
            if (span && /: /.test(span.innerText)) {
                const textArray = span.innerText.split(': ');
                textArray[1] = `<span class='${className}-val'>${textArray[1]}</span>`;
                span.innerHTML = textArray.join(': ');
            }

            if (span && className === 'idmetatype') {
                span.remove();
            }
        }
    }
};

/**
 * Applies better info styling with page-specific customizations
 * @param {NodeList} imagesParent - Parent container elements
 * @param {Object} settings - Extension settings
 */
export const applyBetterInfo = (imagesParent, settings) => {
    imagesParent.forEach((element) => {
        const descriptionDiv = element.querySelector('div').querySelector('div');
        
        if (settings.bigCovers) {
            descriptionDiv.style.marginLeft = '62px';
        }
        
        // if there is a fandom span, add a <br> after it - shows up on the Just In, Search, and Profile pages
        let span = element.querySelectorAll('.fandommetatype');
        if (span[span.length - 1]) {
            span[span.length - 1].after(document.createElement('br'));
        }

        // if there is a genre span, add a <br> after it - otherwise add a <br> after the language span
        span = descriptionDiv.querySelector('.genremetatype') || descriptionDiv.querySelector('.languagemetatype');
        span.after(document.createElement('br'));

        // all pages have either a words, posts, or followers span, add a <br> after whichever one is present
        span = descriptionDiv.querySelector('.wordsmetatype') || descriptionDiv.querySelector('.postsmetatype') || descriptionDiv.querySelector('.followersmetatype');
        span.after(document.createElement('br'));

        // if there is a follows, favs, or reviews span, add a <br> after the last one present in the descriptionDiv
        span = descriptionDiv.querySelector('.followsmetatype') || descriptionDiv.querySelector('.favsmetatype') || descriptionDiv.querySelector('.reviewsmetatype');
        if (span) {
            span.after(document.createElement('br'));
        }

        // if there is a complete or characters span, add a <br> after the published span
        if (descriptionDiv.querySelector('.completemetatype') || descriptionDiv.querySelector('.charactersmetatype')) {
            descriptionDiv.querySelector('.publishedmetatype').after(document.createElement('br'));
        }

        element.style.height = 'auto';
        element.style.minHeight = '120px';

        descriptionDiv.innerHTML = descriptionDiv.innerHTML.replace(/<br>.{2}/g, '<br>');
    });
};
// add <br>s for each meta type that must be on a new line for the communities and forum pages

/**
 * Applies better info color styling
 * @param {NodeList} imagesParent - Parent container elements
 */
export const applyBetterInfoColor = (imagesParent) => {
    imagesParent.forEach((element) => {
        const descriptionDiv = element.querySelector('div').querySelector('div');
        if (descriptionDiv) {
            for (let [metaType, styleVal] of Object.entries(metaTypes)) {
                const className = '.' + metaType.toLowerCase();
                const span = descriptionDiv.querySelector(className + '-val') || descriptionDiv.querySelector(className);
                if (!span) continue;
                if (!Array.isArray(styleVal)) {
                    styleVal = styleVal[span.innerText];
                }
                if (Array.isArray(styleVal)) {
                    const [fw, color] = styleVal;
                    if (fw) span.style.fontWeight = fw;
                    if (color) span.style.color = color;
                }
            }
        }
    });
};

// add sort buttons for favs and follows to the profile page - needs editing
export const applyMoreSortOptions = () => {
    const addButtons = (place) => {
        let storyType = 'favstories';
        if (place === 'st') {
            storyType = 'mystories';
        }

        const newEl = document.createElement('span');
        const newEl2 = document.createElement('span');
        const point = () => {
            const pointSpan = document.createElement('span');
            pointSpan.innerText = ' . ';
            return pointSpan;
        };
        newEl.innerHTML = 'Favs';
        newEl.className = 'gray';
        newEl2.innerHTML = 'Follows';
        newEl2.className = 'gray';
        let sortType = 0;
        if (place === 'fs') {
            sortType = 1;
        }

        const sortButton = document.querySelector(
            `[onclick="stories_init(${place}_array,'.${storyType}');${place}_array.sort(sortByReviews); storylist_draw('${place}_inside', ${place}_array, 1, 1, ${sortType});"]`
        );
        sortButton.after(newEl2);
        sortButton.after(point());
        sortButton.after(newEl);
        sortButton.after(point());

        const myStories = document.querySelector(`#${place}`).querySelectorAll(`.${storyType}`);
        newEl.addEventListener('click', () => {
            const array = Array.from(myStories);
            array.sort((a, b) => {
                let favCountA, favCountB;
                try {
                    favCountA = Number(a.querySelector('.favsmetatype-val').innerText.replaceAll(',', ''));
                } catch {
                    favCountA = 0;
                }
                try {
                    favCountB = Number(b.querySelector('.favsmetatype-val').innerText.replaceAll(',', ''));
                } catch {
                    favCountB = 0;
                }
                return favCountB - favCountA;
            });

            document
                .querySelector(`#${place}`)
                .querySelectorAll(`.${storyType}`)
                .forEach((element) => {
                    element.remove();
                });

            const storyContainer = document.querySelector(`#${place}_inside`);
            array.forEach((element) => {
                storyContainer.appendChild(element);
            });
        });

        newEl2.addEventListener('click', () => {
            const array = Array.from(myStories);

            array.sort((a, b) => {
                let followCountA, followCountB;
                try {
                    followCountA = Number(a.querySelector('.fol-cnt').innerText.replaceAll(',', ''));
                } catch {
                    followCountA = 0;
                }
                try {
                    followCountB = Number(b.querySelector('.fol-cnt').innerText.replaceAll(',', ''));
                } catch {
                    followCountB = 0;
                }
                return followCountB - followCountA;
            });

            document
                .querySelector(`#${place}`)
                .querySelectorAll(`.${storyType}`)
                .forEach((element) => {
                    element.remove();
                });

            const storyContainer = document.querySelector(`#${place}_inside`);
            array.forEach((element) => {
                storyContainer.appendChild(element);
            });
        });
    };

    addButtons('st');
    addButtons('fs');
};

/**
 * Main page processor that handles all common functionality
 * @param {string} pageType - Type of page ('search', 'crossover', 'just-in', 'community', 'profile', 'forum', 'communities', 'list')
 * @returns {Promise<void>}
 */
export const processPage = async (pageType) => {
    // Get settings
    const settings = await createMessagePromise();
    
    // Determine selector parent span based on page type
    let imagesParent;
    
    switch (pageType) {
        case 'story':
            imagesParent = document.querySelector('[target="rating"]').parentElement;
            break;
        case 'profile':
            if (settings.moreOptionsInProfile) {
                applyMoreSortOptions();
            }
        case 'list':
        case 'crossover':
        case 'just-in':
        case 'communities':
        case 'community':
        case 'forum':
        case 'search':
            imagesParent = document.querySelectorAll('.z-list');
            break;
        default:
            console.error(`Unknown page type: ${pageType}`);
            return;
    }

    // Process meta spans using universal function
    processMetaSpans(imagesParent);

    // Apply common styling
    if (settings.bigCovers) {
        applyBigCovers(document.querySelectorAll('.cimage'), imagesParent);
    }

    if (settings.separateFics) {
        applySeparateFics(imagesParent);
    }

    if (settings.betterInfo) {
        applyBetterInfo(imagesParent, settings);
    }

    if (settings.betterInfoColor) {
        applyBetterInfoColor(imagesParent);
    }

    // Handle bookmarks if needed
    if (settings.markFicWithBookmark) {
        const bookmarkLinks = await createMessagePromise('links');
        markFicsWithBookmarks(imagesParent, bookmarkLinks);
    }
}; 