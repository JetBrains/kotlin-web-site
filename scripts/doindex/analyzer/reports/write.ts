import { join } from 'node:path';
import { FileHandle, open, writeFile } from 'node:fs/promises';
import { DIST_FOLDER, REPORT_FOLDER } from '../../lib/files/index.js';
import { withMakeSearchIndex, withSearchParser } from '../../lib/search/records.js';
import { writeAlgoliaIndex } from '../../lib/search/algolia.js';
import { Metadata } from '../metadata.js';

import {
    FileStats,
    makeFileReport,
    makeSearchItem,
    makeSitemapItem,
    makeStatsReport,
    SITEMAP_CLOSE_TEXT,
    SITEMAP_OPEN_TEXT
} from './utils.js';

async function openWithText(path: string, text: string) {
    const file = await open(path, 'w');
    await file.write(text);
    return file;
}

async function closeWithText(file: FileHandle, text: string) {
    await file.write(text);
    await file.close();
}

export async function writeReports(list: Metadata[]) {
    const [files, unknown, redirects, types, searchIndex, sitemap] = await Promise.all([
        openWithText(join(REPORT_FOLDER, 'files-list.json5'), '{\n'),
        open(join(REPORT_FOLDER, 'files-unknown.txt'), 'w'),
        open(join(REPORT_FOLDER, 'files-redirects.txt'), 'w'),
        openWithText(join(REPORT_FOLDER, 'file-types.csv'), 'Filename, How many?\n'),
        withSearchParser && openWithText(join(REPORT_FOLDER, 'search-index.json5'), '{\n'),
        openWithText(join(DIST_FOLDER, 'sitemap.xml'), SITEMAP_OPEN_TEXT)
    ]);

    const fileTypes: FileStats = {};
    const algoliaIndex: Record<string, unknown>[] = [];

    try {
        for (const item of list) {
            const [path, playload] = item;
            const { type, records: { length: recordsSize } } = playload;

            const url = (new URL(path, 'https://kotlinlang.org/')).toString();

            await Promise.all([
                files.appendFile(makeFileReport(item), { encoding: 'utf8' }),
                type === 'Unknown' && unknown.appendFile(path + '\n', { encoding: 'utf8' }),
                type === 'Redirect' && redirects.appendFile(path + '\n', { encoding: 'utf8' }),
                type.startsWith('Page_') && sitemap.appendFile(makeSitemapItem(url, playload), { encoding: 'utf8' }),

                (type.startsWith('Page_') && recordsSize > 0) && (
                    makeSearchItem([url, playload]).then(function writeIndex(entries) {
                        if (withMakeSearchIndex) {
                            for (const entry of entries) {
                                algoliaIndex.push({ ...entry });
                            }
                        }

                        return searchIndex && searchIndex.appendFile(
                            `  ${JSON.stringify(url)}: ${JSON.stringify(entries, null, 2)},\n`,
                            { encoding: 'utf8' }
                        );
                    }))
            ]);

            fileTypes[type] = (fileTypes[type] || 0) + 1;
        }
        for (const [type, value] of Object.entries(fileTypes)) {
            console.log(`##teamcity[buildStatisticValue key='${type}' value='${value}']`);
        }
    } finally {
        await Promise.all([
            writeFile(types, makeStatsReport(fileTypes), 'utf8').finally(() => types.close()),
            closeWithText(files, '}'), closeWithText(sitemap, SITEMAP_CLOSE_TEXT),
            searchIndex && closeWithText(searchIndex, '}'),
            algoliaIndex.length && writeAlgoliaIndex(algoliaIndex),
            unknown.close(), redirects.close()
        ]);
    }
}
