import { Page } from '@playwright/test';
import { testSelector } from '../utils';
import { GlobalSearch } from '../component/global-search';
import { PageWithGlobalSearch } from './page-with-global-search';

export class CoursesPage implements PageWithGlobalSearch {
    readonly page: Page;
    readonly globalSearch: GlobalSearch;

    constructor(page) {
        this.page = page;
        this.globalSearch = new GlobalSearch(this.page);
    }

    async init() {
        await this.page.goto('/education/courses.html');

        // Wait for the page to load
        await this.page.waitForSelector('h1');
    }

    async switchToMapView() {
        const mapTab = this.page.locator('button').filter({ hasText: 'Map view' });
        await mapTab.click();
    }

    async switchToTableView() {
        const tableTab = this.page.locator('button').filter({ hasText: 'Table view' });
        await tableTab.click();
    }
}