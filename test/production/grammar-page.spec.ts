import { test, expect } from '@playwright/test';

test.describe('Grammar Page', () => {
    test.beforeEach(async ({ page, context, baseURL }) => {
        // Close cookies consent banner if it appears
        await page.goto('/');
        await page.waitForSelector('button.ch2-btn.ch2-btn-primary', { timeout: 5000 }).catch(() => {});
        await page.click('button.ch2-btn.ch2-btn-primary').catch(() => {});
    });

    test('Grammar page structure and elements', async ({ page }) => {
        // Navigate to the grammar page
        await page.goto('/docs/reference/grammar.html');
        
        // Check title
        await expect(page.locator('title')).toContainText('Grammar');
        await expect(page.locator('h1')).toContainText('Grammar');
        
        // Check table of contents
        const toc = page.locator('#js-toc');
        await expect(toc).toBeVisible();
        
        // Check grammar content
        const grammarContent = page.locator('.grammar');
        await expect(grammarContent).toBeVisible();
        
        // Check grammar items sets
        const grammarItemsSets = page.locator('.grammar-items-set');
        await expect(grammarItemsSets).toBeVisible();
        
        // Check grammar items
        const grammarItems = page.locator('.grammar-item');
        await expect(grammarItems).toBeVisible();
        
        // Check grammar declarations
        const grammarDeclarations = page.locator('.grammar-declaration');
        await expect(grammarDeclarations).toBeVisible();
        
        // Check grammar descriptions
        const grammarDescriptions = page.locator('.grammar-description');
        await expect(grammarDescriptions).toBeVisible();
    });

    test('Grammar page navigation and links', async ({ page }) => {
        // Navigate to the grammar page
        await page.goto('/docs/reference/grammar.html');
        
        // Check that declaration names are visible
        const declarationNames = page.locator('.grammar-declaration-name');
        await expect(declarationNames).toBeVisible();
        
        // Get the first declaration name
        const firstDeclarationName = await declarationNames.first().textContent();
        
        // Check that the declaration has an ID
        await expect(declarationNames.first()).toHaveAttribute('id', firstDeclarationName);
        
        // Check that identifier links work
        const identifierLinks = page.locator('.grammar-identifier-name');
        
        // If there are identifier links, check that they navigate correctly
        const count = await identifierLinks.count();
        if (count > 0) {
            // Get the href of the first identifier link
            const href = await identifierLinks.first().getAttribute('href');
            
            // Click the link
            await identifierLinks.first().click();
            
            // Check that the URL fragment matches the href
            await expect(page.url()).toContain(href);
        }
    });

    test('Grammar page script loading', async ({ page }) => {
        // Navigate to the grammar page
        await page.goto('/docs/reference/grammar.html');
        
        // Check that the grammar.js script is loaded
        const script = page.locator('script[src*="grammar.js"]');
        await expect(script).toBeAttached();
    });

    test('Grammar page accessibility', async ({ page }) => {
        // Navigate to the grammar page
        await page.goto('/docs/reference/grammar.html');
        
        // Check that all declaration names have IDs for accessibility
        const declarationNames = page.locator('.grammar-declaration-name');
        const count = await declarationNames.count();
        
        for (let i = 0; i < Math.min(count, 10); i++) { // Check up to 10 to avoid too many checks
            const name = await declarationNames.nth(i).textContent();
            await expect(declarationNames.nth(i)).toHaveAttribute('id', name);
        }
        
        // Check that all links have proper text
        const links = page.locator('.grammar a');
        const linkCount = await links.count();
        
        for (let i = 0; i < Math.min(linkCount, 10); i++) { // Check up to 10 to avoid too many checks
            await expect(links.nth(i)).not.toHaveText('');
        }
    });
});