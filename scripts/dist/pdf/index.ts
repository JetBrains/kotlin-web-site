import { dirname, join } from 'node:path';
import { EventEmitter } from 'events';

import { DIST_FOLDER } from '../lib/files/index.js';
import { appendFile, open, readFile } from 'node:fs/promises';
import { processTocToUrls, Result } from './lib.js';
import { newTaskExecutor } from '../lib/pool.js';

console.time('Data successfully built');

const TASK_PATH = import.meta.dirname + '/task';

EventEmitter.defaultMaxListeners = 15;

const DOCS_PATH = join(DIST_FOLDER, 'docs');
const TOC_PATH = join(DOCS_PATH, 'HelpTOC.json');

const TOC = JSON.parse(await readFile(TOC_PATH, { encoding: 'utf-8' }));

const nodes = new Map(
    (await processTocToUrls(TOC))
        .map(id => new URL(id, 'https://kotlinlang.org/docs/'))
        .filter(url => url.hostname === 'kotlinlang.org' && dirname(url.pathname) === '/docs')
        .map(url => url.pathname.slice(1))
        .map(key => [key, ''])
);

if (nodes.size === 0) throw new Error('No nodes found');

async function onItem({ id, html }: Result) {
    nodes.set(id, html);
}

const [pool, finish] = newTaskExecutor(
    TASK_PATH, onItem
);

for (const id of nodes.keys()) {
    pool.push(id);
}

await finish;

const pdfFile = await open(join(DOCS_PATH, 'pdf.html'), 'w');

for (const html of nodes.values()) {
    await appendFile(pdfFile, html);
}

await pdfFile.close();

console.timeEnd('Data successfully built');
