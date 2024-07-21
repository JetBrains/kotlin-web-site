import { env } from 'node:process';
import { join, resolve } from 'node:path';
import { mkdir, open, readFile } from 'node:fs/promises';

import algoliasearch from 'algoliasearch';

import { readPagesIndex } from './task/index.mjs';

console.time('Index objects successfully built');

const ROOT_DIR = resolve('..', '..');
const DIST_DIR = join(ROOT_DIR, 'dist/');
const DATA_DIR = join(ROOT_DIR, 'data/');
const REPORT_DIR = join(ROOT_DIR, 'search-report/');

await mkdir(REPORT_DIR, { recursive: true });

/** @returns {Promise<Object.<string, number>>} */
async function readStats() {
    return JSON.parse(await readFile(DATA_DIR + 'page_views_map.json', { encoding: 'utf8' }));
}

/** @type {Object.<string, number>} */
const pageTypesReport = {};

const [searchIndex, reportUnknown, reportRedirects, reportTypes] = await Promise.all([
    open(REPORT_DIR + 'index.json', 'w'),
    open(REPORT_DIR + 'report-files-unknown.txt', 'w'),
    open(REPORT_DIR + 'report-redirects.txt', 'w'),
    open(REPORT_DIR + 'report-types.txt', 'w')
]);

/**
 * @param {string} type
 * @param {string} url
 * @returns {Promise<void>}
 */
async function addFileReports({ type, url }) {
    await Promise.all([
        type === 'Unknown' && reportUnknown.appendFile(url + '\n', { encoding: 'utf8' }),
        type === 'Redirect' && reportRedirects.appendFile(url + '\n', { encoding: 'utf8' })
    ]);

    if (!pageTypesReport[type]) pageTypesReport[type] = 0;
    pageTypesReport[type]++;
}

const stats = await readStats();
const records = await readPagesIndex(DIST_DIR, stats, addFileReports);

/**
 * @param {Object.<string, number>} types
 * @returns {Promise<string>}
 */
async function getReportTypes(types) {
    return Object.keys(types)
        .sort((a, b) => pageTypesReport[b] - pageTypesReport[a])
        .map(key => `${key}: ${pageTypesReport[key]}`)
        .join('\n');
}

/** @param {Object.<string, number>} types */
async function reportFileTypes(types) {
    await reportTypes.writeFile(await getReportTypes(types), { encoding: 'utf8' });
}

/**
 * @typedef {Object.<string, *>} IndexRecord
 * @property {string} url
 * @property {string} objectID
 */

/**
 * @param {IndexRecord[]} records
 * @returns {Promise<void>}
 */
async function reportRecords(records) {
    await Promise.all([
        searchIndex.writeFile(
            JSON.stringify(
                records.sort((a, b) => a.objectID.localeCompare(b.objectID)), null, 2),
            { encoding: 'utf8' }
        ),

        env['WH_INDEX_NAME'] && algoliasearch(env['WH_SEARCH_USER'], env['WH_SEARCH_WRITE_KEY'])
            .initIndex(env['WH_INDEX_NAME'])
            .replaceAllObjects(records)
            .wait()
            .then(() =>
                console.log(`Submitting WH index objects to ${env['WH_INDEX_NAME']} index`))
    ]);
}

await Promise.all([
    reportRecords(records).then(() => searchIndex.close()),
    reportFileTypes(pageTypesReport).then(() => reportTypes.close()),
    reportUnknown.close(),
    reportRedirects.close()
]);

console.timeEnd('Index objects successfully built');
