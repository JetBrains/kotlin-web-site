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
            const isValid = record?.objectID && record?.url && record?.pageTitle && record?.content;

            if (isValid) console.log(`added ${record.objectID}`);
            else console.log(`skip: ${record.url} has invalid value!`);

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
        result.forEach((r, i, list) => {
            const id = r.objectID;
            for (let j = i + 1, length = list.length; j < length; j++) {
                if (list[j].objectID === id) throw new Error(`Object ${id} isn't uniq`);
            }
        });

        return result;
    });
}
