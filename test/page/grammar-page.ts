import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export const GRAMMAR_URL = '/grammar/';

export class GrammarPage implements BasePage {
    readonly page: Page;
    readonly layout: Locator;
    readonly title: Locator;
    readonly items: Locator;
    readonly declarations: Locator;
    readonly identifiers: Locator;

    constructor(page: Page) {
        this.page = page;
        this.layout = page.getByTestId('grammar-page');
        this.title = page.locator('h1').filter({ hasText: 'Grammar' });
        this.items = page.getByTestId('grammar-item');
        this.declarations = page.getByTestId('grammar-declaration');
        this.identifiers = page.getByTestId('grammar-identifier');
    }

    async init() {
        await this.page.goto(GRAMMAR_URL);
        await this.layout.waitFor();
    }

    async gotoHash(hash: string) {
        await this.page.goto(`${GRAMMAR_URL}#${hash}`);
        await this.layout.waitFor();
    }

    getDeclarationById(name: string): Locator {
        return this.layout.locator(`#${name}`);
    }

    getIdentifierLink(name: string): Locator {
        return this.identifiers.filter({ hasText: name }).first();
    }
}
