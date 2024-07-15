import { load } from 'cheerio';
import { readFile } from 'node:fs/promises';
import { Element } from 'domhandler';

/**
 * @param  {Node} node
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
 * @param {(node) => boolean} test
 * @returns {Element|null}
 */
export function findFirstElementWith(node, test) {
    let result = node;

    while (result.previousSibling) {
        const candidate = result.previousSibling;
        if (candidate instanceof Element && !test(candidate))
            break;
        result = candidate;
    }

    return result instanceof Element && result !== node ? result : null;
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
