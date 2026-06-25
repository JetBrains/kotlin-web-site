import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export const KOTLIN_BENCHMARK_METHODOLOGY_URL = '/kotlin-benchmark/methodology/';

export class KotlinBenchmarkMethodologyPage implements BasePage {
    readonly page: Page;
    readonly root: Locator;
    readonly title: Locator;
    readonly datasetTable: Locator;
    readonly datasetRows: Locator;
    readonly multiSweBenchLink: Locator;
    readonly futureCards: Locator;
    readonly topMenu: Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.getByTestId('kotlin-benchmark-methodology');
        this.title = page.getByTestId('methodology-title');
        this.datasetTable = page.getByTestId('methodology-dataset-table');
        this.datasetRows = page.getByTestId('methodology-dataset-row');
        this.multiSweBenchLink = page.getByTestId('methodology-msb-link');
        this.futureCards = page.getByTestId('methodology-future-card');
        this.topMenu = page.getByTestId('top-menu');
    }

    /** Section heading by its visible text. */
    sectionHeading(name: string): Locator {
        return this.root.getByRole('heading', { name, level: 2 });
    }

    async init() {
        await this.page.goto(KOTLIN_BENCHMARK_METHODOLOGY_URL);

        await Promise.all([this.root.waitFor(), this.page.locator('html.hydrated').waitFor()]);
    }
}
