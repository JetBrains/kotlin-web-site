import { load } from 'cheerio';
import { readFile } from 'node:fs/promises';

/**
 * @param text
 */
async function loadText(text) {
    return load(text, { xml: false });
}

/**
 * @param url {string}
 * @param file {string}
 * @returns {Promise<string>}
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


process.on('message',
    /**
     * @param {[string, string]} args
     * @returns {Promise<void>}
     */
    async function([url, file]) {
        process.send({
            event: 'result', data: { url, file, type: await getPage(url, file) }
        });
    }
);

process.send({ type: 'inited' });
