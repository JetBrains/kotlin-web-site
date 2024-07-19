import { Node } from 'domhandler';

export const DEFAULT_RECORD = Object.freeze({
    objectID: null,
    headings: null,
    mainTitle: null,
    pageTitle: null,
    content: null,
    url: null,
    type: 'Documentation',
    parent: null,
    pageViews: 0,
    product: 'help/kotlin-reference',
    pageType: null
});

/**
 * @param {string} text
 * @returns {string}
 */
export function cleanText(text) {
    return text.replace(/\n/g, ' ').trim();
}

/** @typedef {import('cheerio').CheerioAPI} CheerioAPI */

/**
 * @param {CheerioAPI} $
 * @param {Node[]} list
 * @param {(node: *, level?: number) => boolean} [isFinalNode]
 * @returns {Promise<string>}
 */
export async function htmlToText($, list, isFinalNode) {
    let nodes = list.map(item => ([item, 0]));

    const contentNodes = [];

    while (nodes.length) {
        const [node, level] = nodes.pop();

        if (!node) continue;
        if (isFinalNode && isFinalNode(node, level)) break;

        if (!(node instanceof Node)) {
            contentNodes.push(node);
            continue;
        }

        const tag = node.tagName?.toLowerCase();
        if (tag === 'script' || tag === 'style' || tag === 'th') continue;

        let result = [node];

        if (tag === 'code') {
            const text = $(node).text();
            if (!text.includes('\n')) {
                contentNodes.push('`' + cleanText(text) + '`');
                nodes.push([node.nextSibling, level]);
                continue;
            }
        }

        if (tag === 'li')
            result = ['\n  • ', ...result];

        // if (tag === 'a' && $(node).text().trim())
        //     result = ['[', ...result, ']'];

        if (tag === 'strong')
            result = ['*', ...result, '*'];

        if (tag === 'img') {
            const text = $(node).attr('alt') || $(node).attr('title');
            result = [text ? `&lt;see ${text}&gt;` : '&lt;image&gt;'];
        }

        if (node.firstChild) result = result.map(item => {
            if (item === node) return [node.firstChild, level + 1];
            return item;
        });

        nodes.push([node.nextSibling, level], ...result.reverse().map(item => {
            if (item instanceof Node) item = cleanText($(node).text());
            return Array.isArray(item) ? item : [item, level];
        }));
    }

    return contentNodes
        .join(' ')
        // sample drop
        .replace(/\/\/sampleStart/g, '')
        .replace(/\/\/sampleEnd/g, '')
        // newlines drop
        .replace(/[^\S\r\n]+/g, ' ')
        // drop unnecessary spaces.
        // ToDO: if you have a more problems with code-snippet context (like with ":" in `class Foo : Bar` case)
        //  it's better move it to `cleanText` and add to `htmlToText` skipping empty lines for correct working trim.
        .replace(/ ([;)])/g, '$1')
        .replace(/ ([,?!:]( |$))/g, '$1') // Symbols with space after required. Exclude '?:', '!=' for ex
        .replace(/( \.{3} )|( (\.( |$)))/g, '$1$3') // Space before dot. Exclude ' ... ' or '.method' for ex
        .replace(/([(]) /g, '$1') // space after (
        .trim();
}
