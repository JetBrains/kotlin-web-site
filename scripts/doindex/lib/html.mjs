import { load } from 'cheerio';
import { readFile } from 'node:fs/promises';
import { Element } from 'domhandler';

/**
 * @typedef {import('domhandler').Node} Node
 */

/**
 * @param {Node} node
 * @returns {Element|null}
 */
export function nextElement(node) {
    let result = node;
    do {
        result = result?.nextSibling || null;
    }
    while (node && !(node instanceof Element));
    return result;
}

/**
 * @param {Node} node
 * @param {(el: Element) => boolean} test
 * @param {'previous' | 'next'} direction
 * @returns {Element|null}
 */
function findElementWith(direction, node, test) {
    let result = node;
    const prop = direction + 'Sibling';
    while (result[prop]) {
        const candidate = result[prop];
        if (candidate instanceof Element && !test(candidate))
            break;
        result = candidate;
    }

    return result instanceof Element && result !== node ? result : null;
}

/**
 * @param {Node} node
 * @param {(el: Element) => boolean} test
 * @returns {Element|null}
 */
export function findPrevElementWith(node, test) {
    return findElementWith('previous', node, test);
}

/**
 * @param {Node} node
 * @param {(el: Element) => boolean} test
 * @returns {Element|null}
 */
export function findNextElementWith(node, test) {
    return findElementWith('next', node, test);
}

/**
 * @param text
 */
export async function loadText(text) {
    return load(text, { xml: false });
}

/**
 * @param {string} file
 */
export async function loadFile(file) {
    return await loadText(await readFile(file));
}
