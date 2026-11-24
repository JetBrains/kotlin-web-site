import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';
import { ARCHIVE_URL } from '../../blocks/benchmark/constants';

export class KotlinBenchmarkArchivePage implements BasePage {
    readonly page: Page;
    readonly root: Locator;
    readonly title: Locator;
    readonly meta: Locator;
    readonly select: Locator;
    readonly editions: Locator;
    readonly tables: Locator;
    readonly rows: Locator;
    readonly notice: Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.getByTestId('benchmark-archive');
        this.title = page.getByTestId('bench-archive-title');
        this.meta = page.getByTestId('bench-archive-meta');
        this.select = page.getByTestId('bench-archive-select');
        this.editions = page.getByTestId('bench-archive-edition');
        this.tables = page.getByTestId('bench-leaderboard-table');
        this.rows = page.getByTestId('bench-row');
        this.notice = page.getByTestId('bench-notice');
    }

    /** The edition currently on screen; hidden editions stay in the DOM. */
    visibleEdition(): Locator {
        return this.editions.locator('visible=true');
    }

    async init(query = '') {
        await this.page.goto(`${ARCHIVE_URL}${query}`);

        await Promise.all([this.root.waitFor(), this.page.locator('html.hydrated').waitFor()]);
    }
}
