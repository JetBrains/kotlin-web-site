export * from './api.mjs';
export * from './docs.mjs';

/**
 * @param {string} name
 * @returns {(url) => []}
 */
function reportSkipParser(name) {
    return function reportFirstPage(url) {
        console.log(`skip: for /${url} skipped by ${name}`);
        return [];
    };
}

export const Page_NotFound = reportSkipParser('Page_NotFound');
export const Page_Spec = reportSkipParser('Page_Spec');
