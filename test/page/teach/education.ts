import { Page } from '@playwright/test';
import { testSelector } from '../../utils';
import { GlobalSearch } from '../../component/global-search';
import { PageWithGlobalSearch } from '../page-with-global-search';

export class TeachPage implements PageWithGlobalSearch {
    readonly page: Page;
    readonly globalSearch: GlobalSearch;

    constructor(page: Page) {
        this.page = page;
        this.globalSearch = new GlobalSearch(this.page);
    }

    async init() {
        await this.page.goto('/education/');

        await this.page.waitForSelector(testSelector('teach-index-page'));
    }
}
