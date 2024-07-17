import { loadFile } from '../lib/html.mjs';
import * as PARSERS from '../parsers/index.mjs';

function log(type, ...args) {
    process.send({ event: 'log', type, data: args });
}

['log', 'warn', 'error'].forEach((type) => {
    console[type] = log.bind(console, type);
});

/**
 * @param {string} url
 * @param {string} type
 * @param {string} file
 * @param {Object.<string, *>} data
 */
async function parsePage({ url, type, file, ...data }) {
    const parser = PARSERS[type];

    if (!parser) {
        console.log(`skip: /${url} no parser for ${type}`);
        return [];
    }

    return await parser(await loadFile(file), url, data);
}

process.on('message',
    /**
     * @returns {Promise<void>}
     */
    async function(msg) {
        process.send({ event: 'result', data: await parsePage(msg) });
    }
);

process.send({ event: 'inited' });
