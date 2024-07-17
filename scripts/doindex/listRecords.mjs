import { newTaskExecutor } from './lib/task.mjs';

/**
 * @typedef {object} Page
 * @property {string} url
 * @property {string} type
 * @property {string} [file]
 */

/**
 * @param {Page[]} pages
 * @param {Object.<string, number>} stats
 */
export function getRecords(pages, stats) {
    let result = [];

    const [pool, finish] = newTaskExecutor('records', function onReady(records) {
        records = records.filter(record => {
            const isValid = record?.pageTitle && record?.content;

            if (isValid) console.log(`added ${record.objectID}`);
            else console.log(`skip: ${record.url} with empty content`);

            return isValid;
        });
        result = [...result, ...records];
    });

    pages.forEach(page => {
        const key = 'https://kotlinlang.org/' + page.url;

        page.pageViews = stats[key] || 0;

        if (page.url.endsWith('/') && (stats[key.substring(0, key.length - 2)] || stats[key + '/index.html']))
            console.warn(`warn: for ${page.objectID} found multiple stats`);
    });

    pool.pushAll(pages);

    return finish.then(() => result);
}
