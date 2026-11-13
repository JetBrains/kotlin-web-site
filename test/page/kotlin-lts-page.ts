import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';
import { KOTLIN_LTS_URL } from '../../blocks/kotlin-lts/constants';

export class KotlinLtsPage implements BasePage {
    readonly page: Page;
    readonly main: Locator;
    readonly hero: Locator;
    readonly newsletter: Locator;
    readonly benefits: Locator;
    readonly coverage: Locator;
    readonly process: Locator;
    readonly faq: Locator;
    readonly cta: Locator;
    readonly footer: Locator;

    constructor(page: Page) {
        this.page = page;
        this.main = page.getByRole('main');
        this.hero = page.getByTestId('lts-hero');
        this.newsletter = page.getByTestId('lts-newsletter');
        this.benefits = page.getByTestId('lts-benefits');
        this.coverage = page.getByTestId('lts-coverage');
        this.process = page.getByTestId('lts-how');
        this.faq = page.getByTestId('lts-faq');
        this.cta = page.getByTestId('lts-cta');
        this.footer = page.getByRole('contentinfo');
    }

    async init() {
        await this.page.goto(KOTLIN_LTS_URL);
        await this.page.locator('html.hydrated').waitFor();
    }

    async openSection(name: string) {
        const menu = this.page.getByTestId('top-menu');
        const overview = menu.getByRole('button', { name: 'Overview' });
        if (await overview.isVisible()) await overview.click();
        await this.page.getByRole('link', { name, exact: true }).click();
    }

    async expectNoOverflow() {
        return this.page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    }
}
