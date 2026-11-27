import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';
import { METHODOLOGY_URL } from '../../blocks/benchmark/constants';

export class KotlinBenchmarkMethodologyPage implements BasePage {
    readonly page: Page;
    readonly root: Locator;
    readonly title: Locator;
    readonly datasetTable: Locator;
    readonly datasetRows: Locator;
    readonly multiSweBenchLink: Locator;
    readonly futureCards: Locator;
    readonly topMenu: Locator;
    readonly benchmarkCta: Locator;
    readonly versionSwitcher: Locator;
    readonly datasetCharts: Locator;
    readonly references: Locator;
    readonly refMarkers: Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.getByTestId('benchmark-methodology');
        this.title = page.getByTestId('methodology-title');
        this.datasetTable = page.getByTestId('methodology-dataset-table');
        this.datasetRows = page.getByTestId('methodology-dataset-row');
        this.multiSweBenchLink = page.getByTestId('methodology-msb-link');
        this.futureCards = page.getByTestId('methodology-future-card');
        this.topMenu = page.getByTestId('top-menu');
        this.benchmarkCta = page.getByTestId('methodology-benchmark-cta');
        this.versionSwitcher = page.getByTestId('methodology-version-switcher');
        this.datasetCharts = page.getByTestId('methodology-dataset-charts');
        this.references = page.getByTestId('methodology-references');
        this.refMarkers = page.getByTestId('methodology-ref');
    }

    /** Section heading by its visible text. */
    sectionHeading(name: string): Locator {
        return this.root.getByRole('heading', { name, level: 2 });
    }

    /** `path` is relative to the methodology URL, e.g. `1/` for methodology 1.0. */
    async init(path = '') {
        await this.page.goto(`${METHODOLOGY_URL}${path}`);

        await Promise.all([this.root.waitFor(), this.page.locator('html.hydrated').waitFor()]);
    }
}
