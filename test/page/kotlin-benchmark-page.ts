import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export const KOTLIN_BENCHMARK_URL = '/kotlin-benchmark/';

export class KotlinBenchmarkPage implements BasePage {
    readonly page: Page;
    readonly root: Locator;
    readonly heroTitle: Locator;
    readonly heroIntro: Locator;
    readonly tableScroll: Locator;
    readonly table: Locator;
    readonly rows: Locator;
    readonly ranks: Locator;
    readonly colHeaders: Locator;
    readonly methodologyCta: Locator;
    readonly githubCta: Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.getByTestId('kotlin-benchmark-landing');
        this.heroTitle = page.getByTestId('bench-hero-title');
        this.heroIntro = page.getByTestId('bench-hero-intro');
        this.tableScroll = page.getByTestId('bench-scroll');
        this.table = page.getByTestId('bench-leaderboard-table');
        this.rows = page.getByTestId('bench-row');
        this.ranks = page.getByTestId('bench-rank');
        this.colHeaders = page.getByTestId('bench-col-header');
        this.methodologyCta = page.getByTestId('bench-cta-methodology');
        this.githubCta = page.getByTestId('bench-cta-github');
    }

    /** Resolution-rate cells, in row order. */
    resolutionRateCells(): Locator {
        return this.rows.locator('td[data-col="resolutionRate"]');
    }

    /** Token cells, in row order. */
    tokensCells(): Locator {
        return this.rows.locator('td[data-col="tokens"]');
    }

    /** Latency cells, in row order. */
    latencyCells(): Locator {
        return this.rows.locator('td[data-col="latency"]');
    }

    async init() {
        await this.page.goto(KOTLIN_BENCHMARK_URL);

        await Promise.all([this.root.waitFor(), this.page.locator('html.hydrated').waitFor()]);
    }
}
