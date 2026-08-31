import { expect, Locator, Page } from '@playwright/test';
import { GlobalSearch } from '../component/global-search';
import { PageWithGlobalSearch } from './page-with-global-search';

export class CaseStudiesPage implements PageWithGlobalSearch {
    readonly page: Page;
    readonly globalSearch: GlobalSearch;
    readonly layout: Locator;
    readonly heroBlock: Locator;
    readonly heroTitle: Locator;
    readonly heroSubTitle: Locator;
    readonly filterBlock: Locator;
    readonly gridBlock: Locator;
    readonly filterSwitch: Locator;
    readonly switchAll: Locator;
    readonly switchKMP: Locator;
    readonly switchServerSide: Locator;
    readonly switchAi: Locator;
    readonly filterBySharedCode: Locator;
    readonly filterByComposeUI: Locator;
    readonly gridItem: Locator;
    readonly gridColumn: Locator;

    constructor(page) {
        this.page = page;
        this.globalSearch = new GlobalSearch(this.page);

        this.layout = page.getByTestId('case-studies-page');
        this.heroBlock = page.getByTestId('case-studies-hero');
        this.heroTitle = page.getByTestId('case-studies-hero-title');
        this.heroSubTitle = page.getByTestId('case-studies-hero-subtitle');
        this.filterBlock = page.getByTestId('case-studies-filter');
        this.gridBlock = page.getByTestId('case-studies-grid');
        this.filterSwitch = this.filterBlock.getByTestId('filter-by-type');
        this.switchAll = this.filterSwitch.getByRole('button', { name: 'All' });
        this.switchKMP = this.filterSwitch.getByRole('button', { name: 'Kotlin Multiplatform' });
        this.switchServerSide = this.filterSwitch.getByRole('button', { name: 'Backend' });
        this.switchAi = this.filterSwitch.getByRole('button', { name: 'AI' });
        this.filterBySharedCode = this.filterBlock.getByTestId('filter-by-shared-code').getByRole('checkbox');
        this.filterByComposeUI = this.filterBlock.getByTestId('filter-by-compose-ui');
        this.gridItem = this.gridBlock.getByTestId('case-studies-card');
        this.gridColumn = this.gridBlock.getByTestId('masonry-column');
    }

    async init(caseId? : string) {
        const hash = caseId ? `#${caseId}` : '';
        await this.page.goto(`/case-studies/${hash}`);
        await this.layout.waitFor();
    }

    /**
     * Heights of the case-study stacks, measured from the top of the first card to the bottom of the
     * last one, so the equal-height column boxes of the flex grid do not hide an unbalanced layout.
     */
    async columnContentHeights(): Promise<number[]> {
        return this.gridColumn.evaluateAll((columns) =>
            columns.map((column) => {
                const cards = column.querySelectorAll('[data-testid="case-studies-card"]');
                if (cards.length === 0) return 0;
                const first = cards[0].getBoundingClientRect();
                const last = cards[cards.length - 1].getBoundingClientRect();
                return Math.round(last.bottom - first.top);
            })
        );
    }

    /**
     * Ids of the case studies in each column, top to bottom, i.e. the arrangement the grid settled on.
     */
    async columnCardIds(): Promise<string[][]> {
        return this.gridColumn.evaluateAll((columns) =>
            columns.map((column) =>
                Array.from(column.querySelectorAll('[data-testid="case-studies-card"]'), (card) => card.id)
            )
        );
    }

    /**
     * Waits until the grid stops redistributing its cards, i.e. the column heights are the same in
     * two consecutive samples.
     */
    async waitForStableColumns() {
        await this.gridItem.first().waitFor();

        let previous: string | null = null;
        await expect(async () => {
            const current = JSON.stringify(await this.columnContentHeights());
            const settled = current === previous;
            previous = current;
            expect(settled).toBe(true);
        }).toPass({ intervals: [250, 250, 500, 500, 1000], timeout: 20000 });
    }

    /**
     * Waits for the grid to hold its final layout: every card image has finished loading and the
     * columns have stopped moving.
     */
    async waitForGridLayout() {
        await this.gridItem.first().waitFor();

        await this.gridBlock.locator('img').evaluateAll((images: HTMLImageElement[]) =>
            Promise.all(
                images.map(
                    (image) =>
                        image.complete ||
                        new Promise((resolve) => {
                            image.addEventListener('load', resolve, { once: true });
                            image.addEventListener('error', resolve, { once: true });
                        })
                )
            )
        );

        await this.waitForStableColumns();
    }

    async isSwitchActive(switchElement: Locator) {
        return expect(switchElement).toHaveClass(/_selected/);
    }

    async areAllSharedPlatformsSwitchedOff() {
        for (const checkbox of await this.filterBySharedCode.all()) {
            await expect(checkbox).not.toBeChecked();
        }
    }

    async isComposeUISwitchedOff() {
        return expect(this.filterByComposeUI).not.toBeChecked();
    }

    async caseStudiesHaveDescriptions() {
        await expect(this.gridBlock).toBeVisible();

        for (const item of await this.gridItem.all()) {
            await expect(item.getByTestId('case-studies-card-description')).not.toBeEmpty();
        }
    }
    
    async selectType(option: Locator) {
        await option.click();
    }
}
