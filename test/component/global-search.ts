import { Page } from '@playwright/test';
import { testSelector } from '../utils';

export class GlobalSearch {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Quick search

    async quickSearchIsVisible() {
        await this.page.waitForSelector(testSelector('quick-search-input'));
    }

    async openQuickSearch() {
        await this.page.click(testSelector('header-search-button'));
        await this.quickSearchIsVisible();
    }

    async closeQuickSearch() {
        await this.page.click(testSelector('quick-search-input'));
        await this.page.isHidden(testSelector('quick-search-input'));
    }

    async inputQuickSearch(query: string) {
        await this.page.fill(`${testSelector('quick-search-input')} input`, query);
        await this.page.waitForSelector(testSelector('quick-search-results'));
        await this.page.waitForLoadState('networkidle');
    }

    // Full search

    async fullSearchIsVisible() {
        await this.page.waitForSelector(testSelector('full-search'));
    }

    async openFullSearch(query: string) {
        await this.openQuickSearch()
        await this.inputQuickSearch(query);
        await this.page.click(`${testSelector('advanced-search-button')}`);
        await this.page.waitForTimeout(5000);
        await this.fullSearchIsVisible();

    }

    async openFullSearchWithShortcut() {
        await this.page.keyboard.press('Control+K');
        await this.fullSearchIsVisible();
    }

    async closeFullSearch() {
        await this.page.click(testSelector('close-full-search'));
        await this.page.isHidden(testSelector('full-search'));
    }

    async inputFullSearch(query: string) {
        await this.page.fill(`${testSelector('full-search-input')} input`, query);
        await this.page.waitForSelector(testSelector('full-search-results'));
        await this.page.waitForLoadState('networkidle');
    }


}
