export * from './dokka.mjs';
export * from './writerside.mjs';

/**
 * @param {string} name
 * @returns {($: void, url: string) => []}
 */
function reportSkipParser(name) {
    return function reportFirstPage($, url) {
        console.log(`skip: for /${url} skipped by ${name}`);
        return [];
    };
}

export const Page_NotFound = reportSkipParser('Page_NotFound');
export const Page_Spec = reportSkipParser('Page_Spec');
