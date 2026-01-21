import { expect, test } from '@playwright/test';
import { closeCookiesConsentBanner, isStaging } from '../utils';
import { GrammarPage } from '../page/grammar-page';

test.describe('Grammar page', () => {
    test.beforeEach(async ({ context, baseURL }) => {
        await closeCookiesConsentBanner(context, baseURL);
    });

    test('Grammar page should be accessible', async ({ page }) => {
        const grammar = new GrammarPage(page);
        await grammar.init();

        await expect(grammar.layout).toBeVisible();
        await expect(grammar.title).toBeVisible();
    });

    test('Grammar page should have content', async ({ page }) => {
        const grammar = new GrammarPage(page);
        await grammar.init();

        // Check that known stable grammar rules exist
        await expect(grammar.getDeclarationById('kotlinFile')).toBeVisible();
        await expect(grammar.getDeclarationById('script')).toBeVisible();
        await expect(grammar.getDeclarationById('classDeclaration')).toBeVisible();

        // Check grammar items are rendered
        const itemsCount = await grammar.items.count();
        expect(itemsCount).toBeGreaterThan(10);
    });

    test('Anchor navigation should work', async ({ page }) => {
        const grammar = new GrammarPage(page);
        await grammar.gotoHash('kotlinFile');

        await expect(grammar.layout).toBeVisible();
        await expect(grammar.getDeclarationById('kotlinFile')).toBeInViewport();
    });

    test('Should redirect from .html to clean URL', async ({ page, baseURL }) => {
        await page.goto('/docs/reference/grammar.html');

        // Should redirect to clean URL
        await expect(page).toHaveURL(/\/docs\/reference\/grammar\/$/);

        const grammar = new GrammarPage(page);
        await expect(grammar.layout).toBeVisible();
    });
});
