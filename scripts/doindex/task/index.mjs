import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { newTaskExecutor } from '../lib/pool.mjs';

/**
 * @typedef {object} Page
 * @property {string} url
 * @property {string} type
 * @property {string} [file]
 */

/**
 * @param {string} rootDir
 * @param {Object.<string, number>} stats
 * @param {(page: Page) => void} reportUrl
 */
export async function readPagesIndex(rootDir, stats, reportUrl) {
    let result = [];

    const folders = [rootDir];
    let isPathsWalked = false;

    function onReady({ type, file, url, records }) {
        if (reportUrl) reportUrl({ type, url, file });

        if (records.length === 0) return;

        records = records.filter(record => {
            const isValid = record?.objectID && record?.url && record?.pageTitle && record?.content;

            if (isValid) console.log(`added ${record.objectID}`);
            else console.log(`skip: ${record.url} has invalid value!`);

            return isValid;
        });

        result = [...result, ...records];
    }

    function isFinished() {
        return isPathsWalked;
    }

    const [pool, finish, updatePoolState] = newTaskExecutor(
        import.meta.dirname + '/task.mjs', onReady, isFinished
    );

    while (folders.length > 0) {
        const folder = folders.pop();
        const files = await readdir(folder, { withFileTypes: true });

        await Promise.all(files.map(
            /**
             * @param file {Dirent}
             * @returns {Promise<void>}
             */
            async function processFile(file) {
                const filePath = join(folder, file.name);

                if (file.isDirectory()) {
                    folders.push(filePath);
                    return;
                }

                let pageUrl = filePath.substring(rootDir.length)
                    .replace(/\/index\.html$/, '/');

                const statsKey = 'https://kotlinlang.org/' + pageUrl;

                pool.push([pageUrl, filePath, { pageViews: stats[statsKey] || 0 }]);
            }
        ));
    }

    isPathsWalked = true;
    updatePoolState();

    return finish.then(() => {
        // do safe for algolia record.
        // ToDo: if you want use tags in algolia drop it,
        //  but remember **ALL** key and values should be escaped in-place.
        for (const record of result) {
            for (const [key, val] of Object.entries(record)) {
                if (typeof val === 'string') {
                    record[key] = val
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
                }
            }
        }

        // `objectID` should be uniq for any record
        // if it isn't, it will be failed in push to algolia without extra description
        if (!isRecordsUnique(result))
            throw new Error(`Object ${id} isn't uniq`);

        return result;
    });
}

function isRecordsUnique(records) {
    return records.every((r, i, list) => {
        const id = r.objectID;

        for (let j = i + 1, length = list.length; j < length; j++) {
            if (list[j].objectID === id)
                return false;
        }

        return true;
    });
}