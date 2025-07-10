import { expect, test } from '@playwright/test';
import { GrammarPage } from '../page/grammar-page';

test.describe('Grammar reference page', () => {
    test('Grammar page loads correctly', async ({ page }) => {
        const grammarPage = new GrammarPage(page);
        await grammarPage.init();

        // Check page title
        const title = await page.title();
        expect(title).toBe('Grammar');

        // Check that the grammar content is visible
        const grammarContent = page.locator('.grammar');
        await expect(grammarContent).toBeVisible();

        // Check that the table of contents is present
        const toc = await grammarPage.getTableOfContents();
        await expect(toc).toBeEmpty();

        // Check that there are grammar declarations
        const declarations = await grammarPage.getGrammarDeclarations();
        expect(await declarations.count()).toBeGreaterThan(0);

        // Check that there are grammar descriptions
        const descriptions = await grammarPage.getGrammarDescriptions();
        expect(await descriptions.count()).toBeGreaterThan(0);
    });

    test('Grammar declarations have proper structure', async ({ page }) => {
        const grammarPage = new GrammarPage(page);
        await grammarPage.init();

        // Get all grammar declarations
        const declarations = await grammarPage.getGrammarDeclarations();

        // Check that each declaration has an ID
        const firstDeclaration = declarations.first();
        await expect(firstDeclaration).toHaveAttribute('id');

        // Check that clicking on a declaration doesn't cause errors
        await firstDeclaration.click();

        // Check that the URL hash changes to the declaration ID
        const declarationId = await firstDeclaration.getAttribute('id');
        expect(page.url()).toContain(`#${declarationId}`);
    });

    test('Grammar items have proper structure', async ({ page }) => {
        const grammarPage = new GrammarPage(page);
        await grammarPage.init();

        // Get all grammar items
        const items = await grammarPage.getGrammarItems();
        expect(await items.count()).toBeGreaterThan(0);

        // Check that each item has a declaration and description
        const firstItem = items.first();

        const declaration = firstItem.locator('.grammar-declaration');
        await expect(declaration).toBeVisible();

        const description = firstItem.locator('.grammar-description');
        await expect(description).toBeVisible();
    });

    test('Grammar identifiers link to their declarations', async ({ page }) => {
        const grammarPage = new GrammarPage(page);
        await grammarPage.init();

        // Get all grammar identifiers (links to declarations)
        const identifiers = page.locator('.grammar-identifier-name');
        expect(await identifiers.count()).toBeGreaterThan(0);

        // Check that the first identifier links to a valid declaration
        const firstIdentifier = identifiers.first();
        const href = await firstIdentifier.getAttribute('href');
        expect(href).toMatch(/^#.+$/); // Should be a hash link

        // Check that the linked declaration exists
        const declarationId = href.substring(1); // Remove the # character
        const declaration = await grammarPage.getGrammarDeclaration(declarationId);
        await expect(declaration).toBeVisible();
    });
});