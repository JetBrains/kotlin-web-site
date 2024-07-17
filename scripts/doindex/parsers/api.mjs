import { DEFAULT_RECORD, htmlToText } from '../lib/parse.mjs';
import { findPrevElementWith, nextElement } from '../lib/html.mjs';

/** @typedef {import('domhandler').Node} Node */

/** @typedef {import('domhandler').Element} Element */

/**
 * @param {Node} node
 * @param {number} level
 * @returns {boolean}
 */
function isFinalNode(node, level) {
    return level === 0 && /^h[3-9]$/gi.test(node.tagName);
}

/**
 * @param {import('cheerio').Cheerio<Element>} article
 * @returns {void}
 */
function dropSourceLinks(article) {
    article.find('a[href*="https://github.com"]:contains("source\\)")').remove();
}

/**
 * @param {import('cheerio').Cheerio<Element>} article
 * @returns {void}
 */
function dropPlatformSwitches(article) {
    article.find('div[data-kotlin-version][data-platform]> .tags').remove();
}

/**
 * @param {import('cheerio').CheerioAPI} $
 * @param {import('cheerio').Cheerio<Element>} article
 * @returns {string[]}
 */
function dropBreadcrumbs($, article) {
    const breadcrumbsNode = article.find('.api-docs-breadcrumbs').remove();
    const breadcrumbs = [...breadcrumbsNode.find('a').map(
        (i, el) => $(el).text()
    )];

    if (breadcrumbs[0] === 'kotlin-stdlib' || breadcrumbs[0] === 'kotlin.test')
        breadcrumbs.shift();

    return breadcrumbs;
}

const SIGNATURE_SELECTOR = 'div[data-kotlin-version][data-platform]:has(> .signature)';

/**
 * @param {Node} child
 * @returns {boolean}
 */
function isSignatureDescriptionNode(child) {
    return !child.tagName || child.tagName === 'p';
}

/**
 * @param {import('cheerio').CheerioAPI} $
 * @param {import('cheerio').Cheerio<Element>} article
 * @returns {void}
 */
function swapSignatureCodeAndText($, article) {
    const signatures = article.find(SIGNATURE_SELECTOR);

    for (const signature of signatures) {
        const nextNode = nextElement(signature);

        /* Filter empty and description with code samples.
           Cause code samples less interesting than signature? */
        const hasDescription = Boolean(nextNode && $(nextNode).is('div[data-kotlin-version][data-platform]:has(> p)') &&
            nextNode.childNodes?.every(isSignatureDescriptionNode));

        if (hasDescription) {
            /* if description for more than one signature, we put it before first.
               see: https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-contains.html#kotlin.test$assertContains(kotlin.ranges.IntRange,%20kotlin.Int,%20kotlin.String?) */
            const firstSignature = findPrevElementWith(nextNode, node => $(node).is(SIGNATURE_SELECTOR));

            if (firstSignature) {
                /* move description before all signatures */
                const description = $(nextNode).remove();
                description.insertBefore(firstSignature);
            }
        }
    }
}

/**
 * @param {import('cheerio').CheerioAPI} $
 * @param {import('cheerio').Cheerio<Element>} article
 * @returns {import('cheerio').Cheerio<Element>}
 */
function findTitleNode($, article) {
    let titleNode = article.find('h1[id]');
    const packageTitle = article.find('h2[id^=package-]');

    if (packageTitle.length) titleNode = packageTitle;

    /**
     * API is not a package, no page title:
     *  check h2 heading. See: https://kotlinlang.org/api/latest/jvm/stdlib/
     */
    if (!titleNode.length)
        titleNode = article.find('h2[id]');

    if (titleNode.length > 1)
        console.error(`err: legacy api package has two headers unexpectedly`);

    return titleNode;
}

/**
 * @param {import('cheerio').CheerioAPI} $
 * @param {string} url
 */
async function legacyApi($, url, data) {
    let content = null;

    const article = $('.page-content');

    if (!article.length) {
        console.warn(`skip: /${url} with unexpected page dom!!!`);
        return [];
    }

    dropPlatformSwitches(article);
    dropSourceLinks(article);
    swapSignatureCodeAndText($, article);

    const breadcrumbs = dropBreadcrumbs($, article);

    const titleNode = findTitleNode($, article)[0];

    if (titleNode)
        content = await htmlToText($, [titleNode.nextSibling], isFinalNode, url);
    else {
        // check extension page like: https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/java.time.-duration/
        const isExtensionPage = article.find('> *:first-child').eq(0).is('h3[id^="extensions-for-"]');
        if (!isExtensionPage) {
            throw new Error(`Title for ${url} not found!`);
        }
    }

    let title = breadcrumbs && breadcrumbs.length ?
        breadcrumbs.join(' \u203a ') :
        $(titleNode).text();

    if (url.endsWith('/alltypes/')) {
        content = `All types for ${title}`;
        title += ' (alltypes)'
    }
    return [
        {
            // ...DEFAULT_RECORD,

            objectID: '/' + url,
            headings: title,
            mainTitle: title,
            pageTitle: title,

            content,
            url: 'https://kotlinlang.org/' + url,
            type: DEFAULT_RECORD.type,
            ...data,
            product: DEFAULT_RECORD.product,
            pageType: 'api'
        }
    ];
}

export const Page_API_stdlib = legacyApi;
export const Page_API_test = legacyApi;
