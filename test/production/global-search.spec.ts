import { Page, test } from '@playwright/test';

import { IndexPage } from '../page/index-page';
import { CommunityPage } from '../page/community-page';

const SEARCH_STRING = 'Community';

const pagesWithGlobalSearch = [
    {
        name: 'Index',
        getInstance: (page: Page) => new IndexPage(page)
    },
    {
        name: 'Community',
        getInstance: (page: Page) => new CommunityPage(page)
    },
    // {
    //     name: 'Teach',
    //     getInstance: (page: Page) => new TeachPage(page)
    // }
];

test.describe('Global Search Component', async () => {
    for (const pageWithGlobalSearch of pagesWithGlobalSearch) {

        test(`Quick Search on ${pageWithGlobalSearch.name} Page`, async ({ page }) => {
            const currentPage = pageWithGlobalSearch.getInstance(page);
            await currentPage.init();
            await currentPage.globalSearch.openQuickSearch();
            await currentPage.globalSearch.inputQuickSearch(SEARCH_STRING);
            await currentPage.globalSearch.closeQuickSearch();
        });

        test(`Full Search on ${pageWithGlobalSearch.name} Page`, async ({ page }) => {
            const currentPage = pageWithGlobalSearch.getInstance(page);
            await currentPage.init();
            await currentPage.globalSearch.openFullSearch(SEARCH_STRING);
            await currentPage.globalSearch.closeFullSearch();
        });

        test(`Full Search with keyboard shortcut on ${pageWithGlobalSearch.name} Page`, async ({ page }) => {
            const currentPage = pageWithGlobalSearch.getInstance(page);
            await currentPage.init();
            await currentPage.globalSearch.openFullSearchWithShortcut();
            await currentPage.globalSearch.closeFullSearch();
        });
    }
});
