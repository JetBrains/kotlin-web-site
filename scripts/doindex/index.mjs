import { open, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { readDirPages } from './lib/types.mjs';

const ROOT_DIR = resolve('..', '..');
const DIST_DIR = join(ROOT_DIR, 'dist/');
const DATA_DIR = join(ROOT_DIR, 'data/');

/**
 * @returns {Promise<Object.<string, number>>}
 */
async function readStats() {
    return JSON.parse(await readFile(DATA_DIR + 'page_views_map.json', { encoding: 'utf8' }));
}

/** @type {Object.<string, number>} */
const pageTypesReport = {};

const [reportUnknown, reportRedirects, reportTypes, reportSlash] = await Promise.all([
    open(ROOT_DIR + '/report.unknown_files.txt', 'w'),
    open(ROOT_DIR + '/report.redirects.txt', 'w'),
    open(ROOT_DIR + '/report.types.txt', 'w')
]);

async function addFileReports({ type, url }) {
    await Promise.all([
        type === 'Unknown' && reportUnknown.appendFile(url + '\n', { encoding: 'utf8' }),
        type === 'Redirect' && reportRedirects.appendFile(url + '\n', { encoding: 'utf8' })
    ]);

    if (!pageTypesReport[type]) pageTypesReport[type] = 0;
    pageTypesReport[type]++;
}

const [stats, pages] = await Promise.all([
    readStats(),
    readDirPages(DIST_DIR, addFileReports)
]);

function getReport() {
    return Object.keys(pageTypesReport)
        .sort((a, b) => pageTypesReport[b] - pageTypesReport[a])
        .map(key => `${key}: ${pageTypesReport[key]}`)
        .join('\n');
}

await Promise.all([
    reportUnknown.close(),
    reportRedirects.close(),
    reportTypes.writeFile(getReport(), { encoding: 'utf8' })
        .then(() => reportTypes.close())
]);
