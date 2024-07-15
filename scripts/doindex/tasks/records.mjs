import { loadFile } from '../lib/html.mjs';
import * as PARSERS from '../parsers/index.mjs';

function log(type, ...args) {
    process.send({ event: 'log', type, data: args });
}

['log', 'warn', 'error'].forEach((type) => {
    console[type] = log.bind(console, type);
});

async function parsePage({ url, type, file, ...data }) {
    const parser = PARSERS[type];

    if (!parser) {
        console.log(`skip: /${url} no parser for ${type}`);
        return [];
    }

    return parser(url, data, await loadFile(file));
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
