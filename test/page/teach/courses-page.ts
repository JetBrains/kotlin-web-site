import { Page } from '@playwright/test';
import { GlobalSearch } from '../../component/global-search';
import { PageWithGlobalSearch } from '../page-with-global-search';
import { testSelector } from '../../utils';

export class CoursesPage implements PageWithGlobalSearch {
    readonly page: Page;
    readonly globalSearch: GlobalSearch;

    constructor(page: Page) {
        this.page = page;
        this.globalSearch = new GlobalSearch(this.page);
    }

    async init() {
        await this.page.goto('/education/courses.html');

        // Wait for the page to load
        await this.page.waitForSelector(testSelector('teach-courses'));
    }
}