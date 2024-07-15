import { newTaskExecutor } from './lib/task.mjs';

export function getRecords(pages, stats) {
    let result = [];

    const [pool, finish] = newTaskExecutor('records', function onReady(records) {
        records = records.filter(record => {
            const isValid = record?.pageTitle && record?.content;
            if (!isValid) console.log(`skip: ${record.objectID} with empty content`);
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
