import * as PARSERS from '../parsers/index.mjs';

/**
 * @param {import('cheerio').CheerioAPI} $
 * @param {string} url
 * @param {string} type
 * @param {Object.<string, *>} data
 */
export async function getRecords($, { url, type, ...data }) {
    const parser = PARSERS[type];

    if (!parser) {
        console.log(`skip: /${url} no parser for ${type}`);
        return [];
    }

    return await parser($, url, data);
}
