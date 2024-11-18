import { CheerioAPI } from 'cheerio';

import { Opts } from '../lib/files/execTask.js';
import { FileType, getType } from '../lib/files/type.js';
import { GetRecords, SearchRecord, withSearchParser } from '../lib/search/records.js';
import * as PARSERS from '../lib/search/parsers/index.js';
import { Metadata } from './metadata.js';

const PARSER_LIST = PARSERS as {
    [Property in FileType]?: GetRecords
};

function sendEvent(...args: Parameters<typeof process.send>) {
    process.send(...args);
}

function sendWarning() {
    console.error('process.send is not defined');
}

const send = process.send ? sendEvent : sendWarning;

export async function getRecords($: CheerioAPI, { url, type }: {
    url: string,
    type: FileType
}): Promise<SearchRecord[]> {
    const parser = PARSER_LIST[type];

    if (!parser) {
        console.log(`skip: /${url} no parser for ${type}`);
        return [];
    }

    return parser($, url);
}

function checkUnique(r: SearchRecord, i: number, list: SearchRecord[]) {
    const id = r.objectID;

    for (let j = i + 1, length = list.length; j < length; j++) {
        if (list[j].objectID === id)
            throw new Error(`Object ${id} isn't uniq`);
    }
}

async function onMessage({ filePath, relativePath }: Opts) {
    const [type, $] = await getType(relativePath, filePath);
    let modified: number;

    if (type === 'Page_Documentation') {
        const date = Date.parse($('.last-modified').text().replace('Last modified: ', ''));
        if (!isNaN(date)) modified = date;
    }

    const url = relativePath.replace(/(^|\/)index\.html$/g, '/');

    let records: SearchRecord[] = [];

    if (withSearchParser) {
        if (!type.startsWith('Page')) console.log(`skip: /${url} skipped by type ${type}`);
        else records = (await getRecords($, { url, type })).filter(function filterEmpty(record) {
            const isValid = Boolean(record.objectID && record.url && record.pageTitle && record.content);

            if (isValid) console.log(`added ${record.objectID}`);
            else console.log(`skip: ${record.url} has invalid value!`);

            return isValid;
        });

        // `objectID` should be uniq for any record
        // if it isn't, it will be failed in push to algolia without extra description
        records.forEach(checkUnique);
    }

    const data: Metadata = [url, { type, records, modified }];

    send({ event: 'result', data });
}

process.on('message', onMessage);
send({ event: 'inited' });
