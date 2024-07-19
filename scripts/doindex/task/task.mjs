import { loadFile } from '../lib/html.mjs';
import { getType } from './types.mjs';
import { getRecords } from './records.mjs';

function log(type, ...args) {
    process.send({ event: 'log', type, data: args });
}

['log', 'warn', 'error'].forEach((type) => {
    console[type] = log.bind(console, type);
});

/**
 * @param {string} url
 * @param {string} file
 * @param {Object.<string, *>} data
 * @returns {Promise<{records: *[], type: string}>}
 */
async function getResult(url, file, data) {
    const [type, $] = await getType(url, file);
    let records = [];

    if (type.startsWith('Page')) {
        records = await getRecords($ || await loadFile(file), { url, type, ...data });
    }

    return { type, records };
}

/**
 * @param {[string, string, Object.<string, *>]} args
 * @returns {Promise<void>}
 */
async function onMessage([url, file, opts]) {
    const data = { url, file, ...await getResult(url, file, opts) };
    process.send({ event: 'result', data });
}

process.on('message', onMessage);
process.send({ event: 'inited' });
