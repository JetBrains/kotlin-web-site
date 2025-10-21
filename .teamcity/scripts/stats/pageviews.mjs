import { open } from 'node:fs/promises';

const INPUT_FILE_PATH = 'data/unique_pageviews_pages_000000000000.json';
const input = await open(INPUT_FILE_PATH, 'r');

async function openReportFile(name) {
    const file = await open(name, 'w');
    await file.truncate(0);
    return file;
}

const [listViews, mapViews] = await Promise.all([
    openReportFile('page_views_list.json'),
    openReportFile('page_views_map.json')
]);

try {
    async function append(line) {
        const { webpage: url, unique_pageviews: views } = JSON.parse(line);

        const pageviews = Number(views);

        if (views === '' || isNaN(pageviews)) {
            console.warn(`${url} has incorrect unique_pageviews=${views}`);
            return;
        }

        if (pageviews < 1) return;

        try {
            let uri = new URL(url);

            if (uri.host.match(/^(www\.)?jetbrains\.com$/) && uri.pathname.startsWith('/help/kotlin-multiplatform-dev/')) {
                uri.hostname = 'kotlinlang.org';
                uri.pathname = uri.pathname.replace('/help/kotlin-multiplatform-dev/', '/docs/multiplatform/');
            }

            if (uri.host !== 'kotlinlang.org') return;

            const path = uri.toString();

            await Promise.all([
                listViews.appendFile(JSON.stringify({ path, pageviews }) + ','),
                mapViews.appendFile(`${JSON.stringify(path)}: ${pageviews},`)
            ]);
        } catch (e) {
            console.error('Error in', line, 'line');
        }
    }

    const lines = [];

    await Promise.all([
        listViews.write('['),
        mapViews.write('{')
    ]);

    const readlineInterface = input.readLines();

    readlineInterface.on('line', line => {
        lines.push(append(line));
    });

    const waitInputRead = new Promise(resolve => {
        readlineInterface.on('close', () => {
            resolve();
        });
    });

    await waitInputRead;
    await Promise.all(lines);

    async function replaceLastCharacter(file, ch) {
        const { size } = await file.stat();
        file.write(ch, size - 1);
    }

    await Promise.all([
        replaceLastCharacter(listViews, ']'),
        replaceLastCharacter(mapViews, '}')
    ]);
} finally {
    await Promise.all([
        input.close(),
        listViews.close(),
        mapViews.close()
    ]);
}
