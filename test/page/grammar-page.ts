import { Page } from '@playwright/test';
import { GlobalSearch } from '../component/global-search';
import { PageWithGlobalSearch } from './page-with-global-search';

export class GrammarPage implements PageWithGlobalSearch {
    readonly page: Page;
    readonly globalSearch: GlobalSearch;

    constructor(page: Page) {
        this.page = page;
        this.globalSearch = new GlobalSearch(this.page);
    }

    async init() {
        await this.page.goto('/docs/reference/grammar.html');

        // Wait for the grammar content to be loaded
        await this.page.waitForSelector('.grammar');
    }

    /**
     * Gets the table of contents element
     */
    async getTableOfContents() {
        return this.page.locator('#js-toc');
    }

    /**
     * Gets all grammar declaration elements
     */
    async getGrammarDeclarations() {
        return this.page.locator('.grammar-declaration-name');
    }

    /**
     * Gets a specific grammar declaration by name
     */
    async getGrammarDeclaration(name: string) {
        return this.page.locator(`.grammar-declaration-name#${name}`);
    }

    /**
     * Gets all grammar description elements
     */
    async getGrammarDescriptions() {
        return this.page.locator('.grammar-description');
    }

    /**
     * Gets all grammar item elements
     */
    async getGrammarItems() {
        return this.page.locator('.grammar-item');
    }
}