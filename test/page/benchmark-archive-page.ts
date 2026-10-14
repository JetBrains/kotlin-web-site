import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';
import { ARCHIVE_URL } from '../../blocks/benchmark/constants';

export class KotlinBenchmarkArchivePage implements BasePage {
    readonly page: Page;
    readonly root: Locator;
    readonly title: Locator;
    readonly subtitle: Locator;
    readonly select: Locator;
    readonly backLink: Locator;
    readonly editions: Locator;
    readonly tables: Locator;
    readonly rows: Locator;
    readonly notice: Locator;
    readonly methodologyCta: Locator;
    readonly githubCta: Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.getByTestId('benchmark-archive');
        this.title = page.getByTestId('bench-archive-title');
        this.subtitle = page.getByTestId('bench-archive-subtitle');
        this.select = page.getByTestId('bench-archive-select');
        this.backLink = page.getByTestId('bench-archive-back');
        this.editions = page.getByTestId('bench-archive-edition');
        this.tables = page.getByTestId('bench-leaderboard-table');
        this.rows = page.getByTestId('bench-row');
        this.notice = page.getByTestId('bench-notice');
        this.methodologyCta = page.getByTestId('bench-cta-methodology');
        this.githubCta = page.getByTestId('bench-cta-github');
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
