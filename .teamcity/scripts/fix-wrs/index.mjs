import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const ROOT_DIR = resolve('.');
const DATA_DIR = join(ROOT_DIR, 'pages');

const toc = Object.keys(JSON.parse(await readFile(DATA_DIR + '/HelpTOC.json', 'utf8')).entities.pages);
const filelist = await readdir(DATA_DIR);

console.log('total', filelist.length);

const dels = filelist
    .map(async fileName => {
        if (!fileName.endsWith('.html')) return;
        const key = fileName.replace(/\.html$/, '');
        if (toc.includes(key)) return;

        const file = DATA_DIR + '/' + fileName;
        const text = await readFile(file);
        if (!text.includes('<meta name="built-on"')) return;

        const patched = text.toString().replace(/(<head>)/g, '$1<meta name="robots" content="noindex">');
        console.log('exclude', file);
        await writeFile(file, patched);
    });

await Promise.all(dels);