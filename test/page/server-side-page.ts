import { Locator, Page } from '@playwright/test';
import { GlobalSearch } from '../component/global-search';
import { PageWithGlobalSearch } from './page-with-global-search';

export class ServerSidePage implements PageWithGlobalSearch {
    readonly page: Page;
    readonly globalSearch: GlobalSearch;
    readonly layout: Locator;
    readonly heroBlock: Locator;
    readonly heroTitle: Locator;
    readonly heroSubTitle: Locator;
    readonly heroAnchors: Locator;
    readonly heroGetStartedLink: Locator;
    readonly heroCaseStudiesLink: Locator;
    readonly ktorGetStartedLink: Locator;
    readonly springGetStartedLink: Locator;
    readonly customersBlock: Locator;
    readonly customersLink: Locator;
    readonly downloadIdeaButton: Locator

    constructor(page) {
        this.page = page;
        this.globalSearch = new GlobalSearch(this.page);

        this.layout = page.getByTestId('server-side-page');
        this.heroBlock = page.getByTestId('hero-block');
        this.heroTitle = page.getByTestId('hero-block-title');
        this.heroSubTitle = page.getByTestId('hero-block-subtitle');
        this.heroAnchors = page.getByTestId('hero-block-anchor');
        this.heroGetStartedLink = page.getByTestId('hero-block-get-started-link');
        this.heroCaseStudiesLink = page.getByTestId('hero-block-case-studies-link');
        this.ktorGetStartedLink = page.getByTestId('ktor-get-started-link');
        this.springGetStartedLink = page.getByTestId('spring-get-started-link');
        this.customersBlock = page.getByTestId('customers-block');
        /**
         * The marqueeComponent duplicates the links, so we need to get them via the context of the component
         */
        this.customersLink = page.getByTestId('marquee-component').getByTestId('customers-link');
        this.downloadIdeaButton = page.getByTestId('download-idea-button');
    }

    async init() {
        await this.page.goto('/server-side/');
        await this.layout.waitFor();
    }
}
