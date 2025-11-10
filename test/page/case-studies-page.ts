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
    readonly filterBySharedCode: Locator;
    readonly filterByComposeUI: Locator;
    readonly gridItem: Locator;

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
        this.switchServerSide = this.filterSwitch.getByRole('button', { name: 'Server-side' });
        this.filterBySharedCode = this.filterBlock.getByTestId('filter-by-shared-code').getByRole('checkbox');
        this.filterByComposeUI = this.filterBlock.getByTestId('filter-by-compose-ui');
        this.gridItem = this.gridBlock.getByTestId('case-studies-card');
    }

    async init() {
        await this.page.goto('/case-studies/');
        await this.layout.waitFor();
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
