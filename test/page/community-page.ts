import { Locator, Page } from '@playwright/test';
import { testSelector } from '../utils';
import { GlobalSearch } from '../component/global-search';
import { PageWithGlobalSearch } from './page-with-global-search';

export class CommunityPage implements PageWithGlobalSearch {
    readonly page: Page;
    readonly globalSearch: GlobalSearch;
    readonly keepInTouchBlock: Locator;

    constructor(page) {
        this.page = page;
        this.globalSearch = new GlobalSearch(this.page);
        this.keepInTouchBlock = page.getByTestId('keep-in-touch-block');
    }

    async init() {
        await this.page.goto('/community/');

        await this.page.waitForSelector(testSelector('community-banner'));
    }
}
