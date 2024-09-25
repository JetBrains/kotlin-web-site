import { load } from 'cheerio';
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';


const ROOT_DIR = resolve('.');
const DATA_DIR = join(ROOT_DIR, 'kr.tree');

const text = (await readFile(DATA_DIR));
const $ = await load(text, { xml: true });

const ids = (await $('toc-element[hidden="true"]'))
    .map((i, e) => $(e).attr('id')).get();

const dels = ids
    .map(async id => {
        const fileName = id.replace(/.md$/g, '').replace(/\./g, '-') + '.html';
        const file = `${ROOT_DIR}/pages/${fileName}`;
        const text = await readFile(file);
        const patched = text.toString().replace(/(<head>)/g, '$1<meta name="robots" content="noindex">');
        console.log('exclude', file);
        await writeFile(file, patched);
    });

await Promise.all(dels);