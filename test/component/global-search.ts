import { Page } from '@playwright/test';
import { testSelector } from '../utils';

export class GlobalSearch {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async searchIsVisible() {
        await this.page.isVisible(testSelector('search-popup'));
    }

    async openSearch() {
        await this.page.click(testSelector('header-search-button'));
        await this.searchIsVisible();
    }

    async closeSearch() {
        await this.page.click(testSelector('search-popup-close'));
        await this.page.isHidden(testSelector('search-popup'));
    }

    async inputSearch(query: string) {
        await this.page.fill(`${testSelector('search-popup-input')} input`, query);
        await this.page.waitForSelector(testSelector('search-popup-result-item'));
        await this.page.waitForLoadState('networkidle');
    }
}
