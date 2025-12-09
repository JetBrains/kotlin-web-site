import { Locator, Page } from '@playwright/test';
import { GlobalSearch } from '../component/global-search';
import { PageWithGlobalSearch } from './page-with-global-search';

export class MultiplatformPage implements PageWithGlobalSearch {
    readonly page: Page;
    readonly globalSearch: GlobalSearch;
    readonly heroBanner: Locator;
    readonly heroTitle: Locator;
    readonly heroSubTitle: Locator;
    readonly heroPlatforms: Locator;
    readonly heroActionButon: Locator;
    readonly shareWhatBlock: Locator;
    readonly shareWhatTitle: Locator;
    readonly shareWhatChipAnchor: Locator;
    readonly shareWhatChipContent: Locator;
    readonly shareWhatChipContentTitle: Locator;
    readonly shareWhatChipContentText: Locator;
    readonly shareWhatChipContentAction: Locator;
    readonly ctaBlockTitle: Locator;
    readonly ctaBlockAction: Locator;

    constructor(page) {
        this.page = page;
        this.globalSearch = new GlobalSearch(this.page);

        this.heroBanner = page.getByTestId('hero-banner');
        this.heroTitle = page.getByTestId('hero-title');
        this.heroSubTitle = page.getByTestId('hero-subtitle');
        this.heroPlatforms = page.getByTestId('hero-platfroms');
        this.heroActionButon = page.getByTestId('hero-action-button');
        this.shareWhatBlock = page.getByTestId('share-what-block');
        this.shareWhatTitle = page.getByTestId('share-what-title');
        this.shareWhatChipAnchor = page.getByTestId('share-what-chip-anchor');
        this.shareWhatChipContent = page.getByTestId('share-what-chip-content');
        this.shareWhatChipContentTitle = page.getByTestId('share-what-chip-content-title');
        this.shareWhatChipContentText = page.getByTestId('share-what-chip-content-text');
        this.shareWhatChipContentAction = page.getByTestId('share-what-chip-content-action');
        this.ctaBlockTitle = page.getByTestId('cta-block-title');
        this.ctaBlockAction = page.getByTestId('cta-block-action');
    }

    async init() {
        await this.page.goto('/multiplatform/');

        await this.page.getByTestId('multiplatform-landing').waitFor();
    }
}
