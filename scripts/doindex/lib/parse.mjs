import { Node } from 'domhandler';

export const DEFAULT_RECORD = Object.freeze({
    objectID: null,
    type: 'Documentation',
    product: 'help/kotlin-reference',
    pageViews: 0,
    content: null
});

/**
 * @param {string} text
 * @returns {string}
 */
export function cleanText(text) {
    return text.replace(/\n/g, ' ').trim();
}

/**
 * @typedef {import('cheerio').CheerioAPI} CheerioAPI
 */

/**
 * @param {CheerioAPI} doc
 * @param {Node[]} list
 * @param {(node: *, [level]: number) => boolean} [isFinalNode]
 * @param {string} [url]
 * @returns {Promise<string>}
 */
export async function htmlToText(doc, list, isFinalNode, url = '') {
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

        // if (
        //     tag && tag !== 'p' && tag !== 'div' && tag !== 'li' && tag !== 'a' && tag !== 'br' && tag !== 'code' &&
        //     tag !== 'strong' && tag !== 'h3' && tag !== 'h4' && tag !== 'h5' && tag !== 'em' && tag !== 'ul' &&
        //     tag !== 'ol'
        // ) console.log('node: tag:', node.tagName, 'https://kotlinlang.org/' + url);

        if (tag === 'code') {
            const text = doc(node).text();
            if (!text.includes('\n')) {
                contentNodes.push('`' + cleanText(text) + '`');
                nodes.push([node.nextSibling, level]);
                continue;
            }
        }

        if (tag === 'li')
            result = ['\n  * ', ...result];

        // if (tag === 'a' && doc(node).text().trim())
        //     result = ['[', ...result, ']'];

        if (tag === 'strong')
            result = ['*', ...result, '*'];

        if (node.firstChild) result = result.map(item => {
            if (item === node) return [node.firstChild, level + 1];
            return item;
        });

        nodes.push([node.nextSibling, level], ...result.reverse().map(item => {
            if (item instanceof Node) item = cleanText(doc(node).text());
            return Array.isArray(item) ? item : [item, level];
        }));
    }

    return contentNodes
        .join(' ')
        .replace(/\/\/sampleStart/g, '')
        .replace(/\/\/sampleEnd/g, '')
        .replace(/[^\S\r\n]+/g, ' ')
        .trim();
}
