import { test } from '@playwright/test';

import { IndexPage } from '../page/index-page';
import { CommunityPage } from '../page/community-page';
import { TeachPage } from '../page/teach-page';

const SEARCH_STRING = 'Community';

const pagesWithGlobalSearch = [
    {
        name: 'Index',
        getInstance: (page) => new IndexPage(page),
    },
    {
        name: 'Community',
        getInstance: (page) => new CommunityPage(page),
    },
    {
        name: 'Teach',
        getInstance: (page) => new TeachPage(page),
    },
];

test.describe('Global Search Component', async () => {
    for (const pageWithGlobalSearch of pagesWithGlobalSearch) {
        test(`Regular Page Search on ${pageWithGlobalSearch.name} Page`, async ({ page }) => {
            const currentPage = pageWithGlobalSearch.getInstance(page);
            await currentPage.init();
            await currentPage.globalSearch.openSearch();
            await currentPage.globalSearch.inputSearch(SEARCH_STRING);
            await currentPage.globalSearch.closeSearch();
        });

        test(`Search with Query Params on ${pageWithGlobalSearch.name} Page`, async ({ page }) => {
            const currentPage = pageWithGlobalSearch.getInstance(page);
            await currentPage.init();
            await currentPage.globalSearch.openSearch();
            await currentPage.globalSearch.inputSearch(SEARCH_STRING);
            await currentPage.page.reload();
            await currentPage.globalSearch.searchIsVisible();
            await currentPage.globalSearch.closeSearch();
        });
    }
});
