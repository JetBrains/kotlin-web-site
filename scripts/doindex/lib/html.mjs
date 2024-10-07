import { load } from 'cheerio';
import { readFile } from 'node:fs/promises';
import { Element } from 'domhandler';

/** @typedef {import('domhandler').Node} Node */

/**
 * @template {Node} TNode
 * @param {TNode} [node]
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
 * @template {Node} TNode
 * @param {TNode} node
 * @param {(el: Element) => boolean} test
 * @param {'previous' | 'next'} direction
 * @returns {Element|null}
 */
function findElementWith(direction, node, test) {
    const prop = direction + 'Sibling';
    let result = null;

    let candidate = node;
    while (candidate[prop]) {
        candidate = candidate[prop];
        if (candidate instanceof Element && test(candidate)) {
            result = candidate;
            break;
        }
    }

    return result;
}

/**
 * @template {Node} TNode
 * @param {TNode} node
 * @param {(el: Element) => boolean} test
 * @returns {Element|null}
 */
export function findPrevElementWith(node, test) {
    return findElementWith('previous', node, test);
}

/**
 * @template {Node} TNode
 * @param {TNode} node
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
