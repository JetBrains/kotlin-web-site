export * from './api.mjs';
export * from './docs.mjs';

function reportSkipParser(name, prefix) {
    return function reportFirstPage() {
        if (!reportSkipParser.cache[name]) {
            reportSkipParser.cache[name] = true;
            console.log(`skip: ${prefix ? ` ${prefix} ` : ''}pages for ${name} parser`);
        }
        return [];
    };
}

reportSkipParser.cache = {};

export const Page_NotFound = reportSkipParser('Page_NotFound', '404');
export const Page_Spec = reportSkipParser('Page_Spec', '/spec/*');
