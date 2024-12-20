import { readFile } from 'node:fs/promises';
import { Cheerio, CheerioAPI, load } from 'cheerio';
import { AnyNode, CDATA, Comment, Element, Node, NodeWithChildren, Text } from 'domhandler';

export function nextElement(node?: Node): Element | null {
    let result: Node | undefined | null = node;

    do {
        result = result?.nextSibling;
    }
    while (result && !(result instanceof Element));

    return result instanceof Element ? result : null;
}

function findElementWith(direction: 'previous' | 'next', node: Node, test: (el: Element) => boolean): Element | null {
    const prop = direction === 'previous' ? 'previousSibling' : 'nextSibling';
    let result = null;

    let candidate: Node | null = node;
    while (candidate?.[prop]) {
        candidate = candidate[prop];
        if (candidate instanceof Element && test(candidate)) {
            result = candidate;
            break;
        }
    }

    return result;
}

export function findPrevElementWith(node: Node, test: (el: Element) => boolean): Element | null {
    return findElementWith('previous', node, test);
}

export function findNextElementWith(node: Node, test: (el: Element) => boolean): Element | null {
    return findElementWith('next', node, test);
}

export async function loadText(text: Parameters<typeof load>[0]) {
    return load(text, { xml: false });
}

export async function loadFile(file: string) {
    return await loadText(await readFile(file));
}

function cloneAttrsString(node: Element) {
    return Object.entries((node.attribs || {})).map(([key, value]) => {
        const val = typeof value === 'string' ? `="${value}"` : '';
        return `${key}${val}`;
    }).join(' ');

}

export function replaceNode(
    article: Cheerio<AnyNode>,
    selector: string,
    cb: ($node: Cheerio<Element>, attrs: string, content: string) => string
) {
    const listStrong = article.find(selector);

    for (let i = 0, length = listStrong.length; i < length; i++) {
        const $node = listStrong.eq(i);
        const newNode = cb($node, cloneAttrsString(listStrong[i]), $node.html() || '');
        if (newNode) $node.replaceWith(newNode);
    }
}

export function cleanText(text: string) {
    return text.replace(/\n/g, ' ').trim();
}

type FakeNode = Node | string;
type FakeNodeWithLevel = [Node, number];

export async function htmlToText(
    $: CheerioAPI,
    list: Node[],
    isFinalNode?: (node: FakeNode, level: number) => boolean
): Promise<string> {
    let nodes: [FakeNode, number][] = list.map(item => ([item, 0]));

    const contentNodes: string[] = [];

    while (nodes.length) {
        const [node, level] = nodes.pop();

        if (!node) continue;
        if (isFinalNode && isFinalNode(node, level)) break;

        if (node instanceof Comment)
            continue;

        if (!(node instanceof Node)) {
            contentNodes.push(node);
            continue;
        }

        let result: (FakeNode | FakeNodeWithLevel)[] = [node];

        if (node instanceof Element) {
            const tag = node.tagName.toLowerCase();

            if (tag === 'script' || tag === 'style' || tag === 'th')
                continue;

            if (tag === 'code') {
                const text = $(node).text().trim();
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

            if (tag === 'strong' || tag === 'b')
                result = ['*', ...result, '*'];

            if (tag === 'img') {
                const text = $(node).attr('alt') || $(node).attr('title');
                result = [text ? `&lt;see ${text}&gt;` : '&lt;image&gt;'];
            }
        }

        if (node instanceof NodeWithChildren && node.firstChild) result = result.map((item) => {
            if (item === node) return [node.firstChild, level + 1];
            return item;
        });

        nodes.push(
            [node.nextSibling, level],
            ...result.reverse().map(function(item): [FakeNode, number] {
                if (item instanceof Node) {
                    if (node instanceof Element || node instanceof Text || node instanceof CDATA)
                        item = cleanText($(node).text());
                }
                return Array.isArray(item) ? [item[0], item[1]] : [item, level];
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
