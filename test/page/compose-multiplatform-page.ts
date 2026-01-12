import { Locator, Page } from '@playwright/test';
import { GlobalSearch } from '../component/global-search';
import { PageWithGlobalSearch } from './page-with-global-search';

export class ComposeMultiplatformPage implements PageWithGlobalSearch {
    readonly page: Page;
    readonly globalSearch: GlobalSearch;
    readonly main: Locator;

    readonly hero: Locator;
    readonly heroTitle: Locator;
    readonly heroSubTitle: Locator;
    readonly heroActionButton: Locator;
    readonly heroCarousel: Locator;

    readonly featuresBlock: Locator;
    readonly featureItems: Locator;
    readonly featureTitles: Locator;

    readonly quoteSection: Locator;
    readonly quoteCards: Locator;

    readonly ctaBlock: Locator;
    readonly ctaBlockTitle: Locator;
    readonly ctaBlockButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.globalSearch = new GlobalSearch(this.page);

        this.main = page.getByTestId('compose-multiplatform-landing');

        this.hero = page.getByTestId('hero-block');
        this.heroTitle = page.getByTestId('hero-title');
        this.heroSubTitle = page.getByTestId('hero-subtitle');
        this.heroActionButton = page.getByTestId('hero-get-started-button');
        this.heroCarousel = page.getByTestId('hero-carousel');

        this.featuresBlock = page.getByTestId('features-block');
        this.featureItems = page.getByTestId('feature-item');
        this.featureTitles = page.getByTestId('feature-title');
        this.quoteSection = page.getByTestId('quote-section');
        this.quoteCards = page.getByTestId('quote-card');

        this.ctaBlock = page.getByTestId('cta-block');
        this.ctaBlockTitle = page.getByTestId('cta-block-title');
        this.ctaBlockButton = page.getByTestId('cta-block-button');
    }

    async init() {
        await this.page.goto('/compose-multiplatform/');

        await Promise.all([this.main.waitFor(), this.page.locator('html.hydrated').waitFor()]);
    }
}
