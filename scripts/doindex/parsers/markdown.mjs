import { DEFAULT_RECORD, htmlToText } from '../lib/parser.mjs';
import { findPrevElementWith } from '../lib/html.mjs';

const LIST_HEADERS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/**
 * Build headings with all headers, like:
 *     [h1 <- (skip h2-h6) <- h2 <- (skip h3-h6) <- h3]
 * @param {import('cheerio').CheerioAPI} $
 * @param {import('domhandler').Element} titleNode
 * @returns {Promise<Element[]>}
 */
async function collectHeadings($, titleNode) {
    const headings = [titleNode];

    let node = titleNode;
    let level = titleNode.tagName;

    while (node && level !== 'h1') {
        const tags = LIST_HEADERS.slice(0, LIST_HEADERS.indexOf(level));

        node = findPrevElementWith(node, el =>
            $(el).is(`.typo-header:is(${tags.join(',')})`));

        if (!node) break;

        level = node.tagName;
        headings.push(node);
    }

    return headings;
}

/**
 * Parsing old markdown documentation like '/community/slackccugl.html'
 * @param {import('cheerio').CheerioAPI} $
 * @param {string} url
 * @param {Object.<string, *>} data
 */
async function legacyMarkdown($, url, data) {
    const article = $('.page-content[role="main"]');
    const pageUrl = new URL($('meta[property="og:url"][content]').attr('content'));
    const headers = article.find('.typo-header[id]');

    return Promise.all([...headers].map(async function(titleNode) {
        const $titleNode = $(titleNode);
        const id = $titleNode.attr('id');
        const finalUrl = `/${url}#${id}`;

        const headings = (await collectHeadings($, titleNode)).map(node =>
            $(node).text()
                .replace(/:$/g, ''));

        return {
            ...DEFAULT_RECORD,
            ...data,

            objectID: finalUrl,
            pageType: 'docs',
            url: new URL(finalUrl, pageUrl).toString(),
            parent: '/' + url,

            headings: headings.join(' | '),
            mainTitle: headings[headings.length - 1],
            pageTitle: headings.slice(0, -1).reverse().join(': '),
            content: await htmlToText($, [titleNode.nextSibling], function isFinalNode(node, level) {
                return level === 0 && $(node).is('.typo-header[id]');
            })
        };
    }));
}

export const Page_LegacyDocumentation = legacyMarkdown;
