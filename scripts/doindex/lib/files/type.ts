import { CheerioAPI } from 'cheerio';

import { loadFile } from '../html.js';

export type FileType =
    'File_Text' | 'File_Pdf' | 'File_Archive' | 'File_Asset'
    | 'File_Font' | 'File_Data' | 'File_License' | 'File_Image'
    | 'Page_Undetected' | 'NotFound' | 'Page_Spec' | 'Page_Grammar'
    | 'Page_API' | 'Page_API_stdlib' | 'Page_API_test' | 'Page_API_Deprecated'
    | 'Page_Community' | 'Page_Documentation' | 'Page_LegacyDocumentation'
    | 'Iframe' | 'Redirect' | 'Hidden' | 'Unknown';

export async function getType(url: string, filePath: string): Promise<[FileType, CheerioAPI | null]> {
    if (url.endsWith('/package-list') || url.endsWith('index.yml')) return ['File_Text', null];
    if (url.endsWith('.pdf')) return ['File_Pdf', null];
    if (url.endsWith('.zip')) return ['File_Archive', null];
    if (url.endsWith('.js') || url.endsWith('.css')) return ['File_Asset', null];
    if (url.endsWith('.woff') || url.endsWith('.woff2') || url.endsWith('.ttf')) return ['File_Font', null];

    if (url.endsWith('.json') || url.endsWith('.xml') || url.endsWith('.txt'))
        return [url.toLowerCase().includes('license') && url.endsWith('.txt') ? 'File_License' : 'File_Data', null];

    if (
        url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.webp') ||
        url.endsWith('.svg') || url.endsWith('.ico') || url.endsWith('.gif')
    ) return ['File_Image', null];

    let $ = null;
    let pageType: FileType = 'Unknown';

    if (url.endsWith('/') || url.endsWith('.html')) {
        pageType = 'Page_Undetected';

        $ = await loadFile(filePath);

        if ($('meta[http-equiv=refresh]').length)
            return ['Redirect', $];

        if ($('meta[name=robots][content=noindex]').length)
            return ['Hidden', $];

        if (url === '404.html' || url.match(/404\/(index\.html)?/g)) return ['NotFound', $];
        if (url.startsWith('spec/')) return ['Page_Spec', $];
        if (url === 'docs/reference/grammar.html') return ['Page_Grammar', $];

        if (url.startsWith('api/')) {
            if (url.startsWith('api/latest/')) pageType = url.includes('jvm/stdlib') ? 'Page_API_stdlib' : 'Page_API_test';
            else if (url.endsWith('/navigation.html') && $(':is(.sideMenu, .sideMenuPart) .sideMenuPart').length)
                pageType = 'Iframe';
            else if (url.includes('/older/')) return ['Page_API_Deprecated', $];
            else pageType = 'Page_API';
        }

        if (url.startsWith('community/')) pageType = 'Page_Community';

        if ($('body[data-article-props]').length)
            pageType = 'Page_Documentation';

        if ($('.global-content > article.page-content[role="main"]').length)
            pageType = 'Page_LegacyDocumentation';
    }

    return [pageType, $];
}
