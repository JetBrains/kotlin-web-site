import { open, readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { load } from 'cheerio';

const ROOT_DIR = resolve('..', '..');
const DIST_DIR = join(ROOT_DIR, 'dist/');
const DATA_DIR = join(ROOT_DIR, 'data/');

/**
 * @param text
 */
async function loadText(text) {
    return load(text, { xml: false });
}

/**
 * @param url {string}
 * @param file {string}
 * @returns {Promise<*>}
 */
async function getPage(url, file) {
    let pageType = 'Unknown';

    if (url.endsWith('/') || url.endsWith('.html')) {
        const doc = await loadText(await readFile(file));

        if (doc('meta[http-equiv=refresh]').length)
            return 'Redirect';

        if (doc('meta[name=robots][content=noindex]').length)
            return 'Hidden';

        pageType = 'Page';

        if (url.startsWith('community')) pageType = 'Page_Community';
        if (url.startsWith('docs/reference')) pageType = 'Page_Reference';
        if (url.startsWith('docs/tutorials')) pageType = 'Page_Tutorial';
        if (url === '404.html') pageType = 'Page_NotFound';

        if (url.startsWith('api/latest/'))
            pageType = url.includes('jvm/stdlib') ? 'Page_API_stdlib' : 'Page_API_test';

        if (url.startsWith('/spec/')) pageType = 'Page_Spec';

        if (doc('body[data-article-props]').length)
            pageType = 'Page_Documentation';

        return pageType;
    }

    if (url.endsWith('/package-list') || url.endsWith('index.yml')) pageType = 'File_Text';
    if (url.endsWith('.pdf')) pageType = 'File_Pdf';
    if (url.endsWith('.zip')) pageType = 'File_Archive';
    if (url.endsWith('.js') || url.endsWith('.css')) pageType = 'File_Asset';
    if (url.endsWith('.json') || url.endsWith('.xml') || url.endsWith('.txt')) pageType = 'File_Data';


    if (url.endsWith('.woff') || url.endsWith('.woff2') || url.endsWith('.ttf')) pageType = 'File_Font';

    if (
        url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.webp') ||
        url.endsWith('.svg') || url.endsWith('.ico') || url.endsWith('.gif')
    ) pageType = 'File_Image';

    return pageType;
}

/**
 * @param {string} rootDir - entry point directory
 *
 * @returns {Promise<PageType[]>}
 */
async function readTypedPages(rootDir, reportUrlCb) {
    /**
     * @const
     * @type {PageType[]}
     */
    const result = [];
    const folders = [rootDir];

    while (folders.length > 0) {
        const folder = folders.shift();
        const files = await readdir(folder, { withFileTypes: true });

        await Promise.all(files.map(
            /**
             * @param file {Dirent}
             * @returns {Promise<void>}
             */
            async file => {
                const filePath = join(folder, file.name);

                if (file.isDirectory()) {
                    folders.push(filePath);
                    return;
                }

                let pageUrl = filePath.substring(rootDir.length)
                    .replace(/\/index\.html$/, '/');

                const type = await getPage(pageUrl, filePath);

                if (reportUrlCb) await reportUrlCb({ type, pageUrl, filePath, result });

                if (type.startsWith('Page_')) result.push({ url: pageUrl, type });

            }
        ));
    }

    return result;
}

/**
 * @returns {Promise<Map<string, number>>}
 */
async function readStats() {
    return JSON.parse(await readFile(DATA_DIR + 'page_views_map.json', { encoding: 'utf8' }));
}

const [reportUnknown, reportRedirects, reportTypes, reportSlash] = await Promise.all([
    open(ROOT_DIR + '/report.unknown_files.txt', 'w'),
    open(ROOT_DIR + '/report.redirects.txt', 'w'),
    open(ROOT_DIR + '/report.types.txt', 'w'),
    open(ROOT_DIR + '/report.trailing_slash.txt', 'w')
]);

const report = {};

async function addFileReports({ type, pageUrl: url }) {
    await Promise.all([
        type === 'Unknown' && reportUnknown.appendFile(url + '\n', { encoding: 'utf8' }),
        type === 'Redirect' && reportRedirects.appendFile(url + '\n', { encoding: 'utf8' }),
        url.endsWith('/') && reportSlash.appendFile(url + '\n', { encoding: 'utf8' })
    ]);

    if (!report[type]) report[type] = 0;
    report[type]++;
}

const [stats, pages] = await Promise.all([
    readStats(),
    readTypedPages(DIST_DIR, addFileReports)
]);

await Promise.all([
    reportUnknown.close(),
    reportRedirects.close(),
    reportTypes.writeFile(Object.keys(report)
            .sort((a, b) => report[b] - report[a])
            .map(key => `${key}: ${report[key]}`)
            .join('\n'),
        { encoding: 'utf8' }
    )
        .then(() => reportTypes.close())
]);
