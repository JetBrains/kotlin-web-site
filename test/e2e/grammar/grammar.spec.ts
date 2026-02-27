import { expect, test } from '@playwright/test';
import { GrammarPage } from './page';
import { checkScreenshot } from '../../utils';
import { MICRO_ANIMATION_TIMEOUT_LONG } from '../visual-constants';

test.describe('Grammar: support', () => {
    test('Should redirect from .html to clean URL', async ({ page }) => {
        await page.goto('/docs/reference/grammar.html');

        await expect(page).toHaveURL('/grammar/');

        const redirected = new GrammarPage(page);
        await expect(redirected.layout).toBeVisible();
    });

    test('Should redirect from nested URL', async ({ page }) => {
        await page.goto('/docs/reference/grammar/');

        await expect(page).toHaveURL('/grammar/');

        const redirected = new GrammarPage(page);
        await expect(redirected.layout).toBeVisible();
    });
})

test.describe('Grammar: content', () => {
    let grammar: GrammarPage;

    test.beforeEach(async ({ page }) => {
        grammar = new GrammarPage(page);
        await grammar.init();
    });

    test('Should render grammar page with title', async () => {
        await expect(grammar.layout).toBeVisible();
        await expect(grammar.title).toBeVisible();
    });

    test('Should have grammar items', async () => {
        expect(await grammar.items.count()).toBeGreaterThan(10);
    });

    test('Should have declarations with valid ids', async () => {
        expect(await grammar.declarations.count()).toBeGreaterThan(10);

        await expect(grammar.getDeclarationById('kotlinFile')).toBeVisible();
        await expect(grammar.getDeclarationById('script')).toBeVisible();
        await expect(grammar.getDeclarationById('classDeclaration')).toBeVisible();
    });

    test('Should navigate to declaration via direct anchor URL', async () => {
        await grammar.gotoHash('kotlinFile');

        await expect(grammar.getDeclarationById('kotlinFile')).toBeInViewport();
    });

    test('Should navigate when clicking identifier link', async () => {
        const identifierLink = grammar.getIdentifierLink('shebangLine');
        await identifierLink.click();

        expect(grammar.page.url()).toContain('#shebangLine');

        await expect(grammar.getDeclarationById('shebangLine')).toBeInViewport();
    });

    test('Should have working usages links', async () => {
        await grammar.gotoHash('shebangLine');
        const usagesLink = grammar.layout.locator('.grammar-declaration-usedby a').first();

        await expect(usagesLink).toBeVisible();

        const linkText = await usagesLink.textContent();
        await usagesLink.click();

        expect(grammar.page.url()).toContain(`#${linkText}`);
    });

    test('Should rebase relative URLs correctly', async () => {
        const externalLink = grammar.layout.locator('a[href*="github.com/Kotlin/kotlin-spec"]').first();
        await expect(externalLink).toBeVisible();

        const externalHref = await externalLink.getAttribute('href');
        expect(externalHref).toContain('https://github.com/Kotlin/kotlin-spec');

        const docsLink = grammar.layout.locator('a[href*="packages.html"]').first();
        await expect(docsLink).toBeVisible();

        const docsHref = await docsLink.getAttribute('href');
        expect(docsHref).toMatch('/docs/reference/packages.html');
    });

    test('Should render links with Inline Attribute List (target="_blank")', async () => {
        const externalLink = grammar.layout.locator('a[href^="https://github.com/Kotlin/kotlin-spec"][target="_blank"]').first();
        await expect(externalLink).toBeVisible();
    });

    test('Should apply DEFAULT_OPTIONS overrides for markdown elements', async () => {
        const h2Element = grammar.layout.locator('h2').first();
        await expect(h2Element).toBeVisible();

        const h2Class = await h2Element.getAttribute('class');
        expect(h2Class).toContain('rs-h2');

        const h3Element = grammar.layout.locator('h3').first();
        await expect(h3Element).toBeVisible();

        const h3Class = await h3Element.getAttribute('class');
        expect(h3Class).toContain('rs-h3');
    });

    test('Should render grammar item properly on desktop', async () => {
        const grammarItem = grammar.items.filter({
            has: grammar.page.locator('#kotlinFile')
        }).first();

        await expect(grammarItem).toBeVisible();
        await checkScreenshot(grammarItem);
    });

    test('Should render declaration with usages properly on desktop', async () => {
        const declaration = grammar.declarations.filter({
            has: grammar.page.locator('#shebangLine')
        }).first();

        await expect(declaration).toBeVisible();
        await checkScreenshot(declaration);
    });
});
