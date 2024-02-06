import { Page } from '@playwright/test';
import { testSelector } from '../utils';
import { BasePage } from './base-page';

export class WebHelpPage implements BasePage {
    readonly page: Page;
    readonly url: string;

    constructor(page, url) {
        this.page = page;
        this.url = url;
    }

    async init() {
        await this.page.goto(this.url);

        await this.page.waitForSelector(testSelector('article'));
    }
}
