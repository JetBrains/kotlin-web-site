import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { createResolve } from './index.mjs';
import { FixedThreadPool } from './pool.mjs';

/**
 * @typedef {object} Page
 * @property {string} url
 * @property {string} type
 * @property {string} [file]
 */

/**
 * @callback reportUrl
 * @param {Page} page
 * @returns {void}
 */

/**
 * @param {string} rootDir
 * @param {reportUrl} reportUrl
 * @returns {Promise<Page[]>}
 */
export async function readDirPages(rootDir, reportUrl) {
    /** @type {Page[]} */
    const result = [];
    const folders = [rootDir];
    const [resolve, finishPromise] = createResolve();

    function onReady({ type, url, file }) {
        if (reportUrl) reportUrl({ type, url, file });
        if (type.startsWith('Page')) result.push({ url, type });
        updateProgressState();
    }

    const pool = new FixedThreadPool('./tasks/type.mjs', onReady);

    let isPathsWalked = false;

    function updateProgressState() {
        const isFinish = isPathsWalked && pool.isIdle();

        if (isFinish) {
            pool.shutdown();
            resolve();
        }

        return isFinish;
    }

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

                pool.push([pageUrl, filePath]);
                pool.update();
            }
        ));
    }

    isPathsWalked = true;
    updateProgressState();

    return await finishPromise.then(() => result);
}
