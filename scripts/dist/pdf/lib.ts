import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { CheerioAPI, load } from 'cheerio';

import { FileType } from '../lib/files/type.js';
import { ROOT_DIR } from '../lib/files/index.js';

export type Result = {
    id: string
    html: string
}

export function isHiddenProved(relativePath: string, type?: FileType) {
    return (!type || type === 'Hidden') && (
        relativePath.startsWith('docs/kotlin-tour-') ||
        relativePath === 'docs/multiplatform.html'
    );
}

const TREE_XML_PATH = join(ROOT_DIR + '/docs/kr.tree');

let TREE_XML: CheerioAPI | null = null;

async function readTreeXMLEntities() {
    if (!TREE_XML)
        TREE_XML = load(await readFile(TREE_XML_PATH, { encoding: 'utf-8' }), {
            xml: true
        });

    return TREE_XML;
}

async function getSubtreeItems(id: string) {
    const $tree = await readTreeXMLEntities();
    const topic = id.replace(/\.html$/, '.md');

    return $tree(`toc-element[topic="${topic}"] > toc-element[topic]`).toArray().map(node => {
        const file = node?.attribs?.topic?.replace(/\.(md|topic)$/, '.html');
        if (!file || !isHiddenProved(`docs/${file}`)) return null;
        return file;
    })
        .filter(Boolean);
}

export async function processTocToUrls({ topLevelIds, entities }: {
    entities: { pages: Record<string, { url?: string, pages: string[] }> },
    topLevelIds: string[]
}) {
    const result: string[] = [];
    const visited = new Set<string>();
    const stack = [...topLevelIds.reverse()]; // Reverse to maintain order
    const data = entities.pages;
    while (stack.length) {
        const id = stack.pop();

        if (visited.has(id)) continue;
        visited.add(id);

        const page = data[id];
        if (!page) continue;
        const { url, pages } = page;

        if (url) result.push(page.url);

        if (isHiddenProved(`docs/${page.url}`)) {
            const hiddenPages = await getSubtreeItems(page.url);
            for (const id of hiddenPages) {
                result.push(id);
            }
        }

        if (pages?.length) {
            for (let i = page.pages.length - 1; i >= 0; i--) {
                stack.push(page.pages[i]);
            }
        }
    }

    return result;
}
