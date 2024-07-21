import { loadFile } from '../lib/html.mjs';

/**
 * @param url {string}
 * @param file {string}
 * @returns {Promise<[string, import('cheerio').CheerioAPI|null]>}
 */
export async function getType(url, file) {
    let pageType = 'Unknown';

    if (url.endsWith('/') || url.endsWith('.html')) {
        const $ = await loadFile(file);

        if ($('meta[http-equiv=refresh]').length)
            return ['Redirect', $];

        if ($('meta[name=robots][content=noindex]').length)
            return ['Hidden', $];

        pageType = 'Page_Undetected';

        if (url.startsWith('community/')) pageType = 'Page_Community';
        if (url === 'docs/reference/grammar.html') pageType = 'Page_Grammar';
        if (url === '404.html' || url === '404/') pageType = 'Page_NotFound';

        if (url.startsWith('api/latest/'))
            pageType = url.includes('jvm/stdlib') ? 'Page_API_stdlib' : 'Page_API_test';

        if (url.startsWith('spec/')) pageType = 'Page_Spec';

        if ($('body[data-article-props]').length)
            pageType = 'Page_Documentation';

        if ($('.global-content > article.page-content[role="main"]').length)
            pageType = 'Page_LegacyDocumentation';

        return [pageType, $];
    }

    if (url.endsWith('/package-list') || url.endsWith('index.yml')) pageType = 'File_Text';
    if (url.endsWith('.pdf')) pageType = 'File_Pdf';
    if (url.endsWith('.zip')) pageType = 'File_Archive';
    if (url.endsWith('.js') || url.endsWith('.css')) pageType = 'File_Asset';
    if (url.endsWith('.json') || url.endsWith('.xml') || url.endsWith('.txt'))
        pageType = url.toLowerCase().includes('license') && url.endsWith('.txt') ? 'File_License' : 'File_Data';

    if (url.endsWith('.woff') || url.endsWith('.woff2') || url.endsWith('.ttf')) pageType = 'File_Font';

    if (
        url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.webp') ||
        url.endsWith('.svg') || url.endsWith('.ico') || url.endsWith('.gif')
    ) pageType = 'File_Image';

    return [pageType, null];
}
