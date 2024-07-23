import { loadFile } from '../lib/html.mjs';
import { getType } from './types.mjs';
import { getRecords } from './records.mjs';

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
 * @param {[url: string, file: string, opts: Object.<string, *>]} args
 * @returns {Promise<void>}
 */
async function onMessage([url, file, opts]) {
    const data = { url, file, ...await getResult(url, file, opts) };
    process.send({ event: 'result', data });
}

process.on('message', onMessage);
process.send({ event: 'inited' });
