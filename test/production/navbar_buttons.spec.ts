import { test, expect } from '@playwright/test';

test.describe('Navbar buttons', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('button.ch2-btn.ch2-btn-primary');
        await page.click('button.ch2-btn.ch2-btn-primary');
    });

    test('Kotlin logo opens the homepage', async ({ page }) => {
        const kotlinLogo = page.locator('.ktl-logo-large-module_link_AOGas');
        await expect(kotlinLogo).toBeVisible();
        await kotlinLogo.click();
        await expect(page.url()).toContain('https://kotlinlang.org/');
    });

    test('Kotlin version link opens the related GitHub page', async ({ page, context }) => {
        const versionLink = page.locator('.ktl-logo-large-module_version-tag_k12Hw');
        await expect(versionLink).toBeVisible();
        const versionText = await versionLink.textContent();
        console.log(`Version is: ${versionText}`);
        const newPagePromise = context.waitForEvent('page');
        await versionLink.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        const expectedUrl = `https://github.com/JetBrains/kotlin/releases/tag/${versionText!.trim()}`;
        await expect(newPage.url()).toContain(expectedUrl);
    });

    test('Solutions button is visible in navbar', async ({ page }) => {
        const navbar = page.locator('[data-test="header"]');
        const solutionsButton = navbar.getByText('Solutions');
        await expect(solutionsButton).toBeVisible();
    });

    test('Docs button is visible in navbar', async ({ page }) => {
        const navbar = page.locator('[data-test="header"]');
        const docsButton = navbar.getByText('Docs');
        await expect(docsButton).toBeVisible();
    });

    test('API button is visible in navbar', async ({ page }) => {
        const navbar = page.locator('[data-test="header"]');
        const teachButton = navbar.getByText('API').first();
        await expect(teachButton).toBeVisible();
    });

    test('Community button is visible in navbar', async ({ page }) => {
        const navbar = page.locator('[data-test="header"]');
        const communityButton = navbar.getByText('Community');
        await expect(communityButton).toBeVisible();
    });

    test('Teach button is visible in navbar', async ({ page }) => {
        const navbar = page.locator('[data-test="header"]');
        const teachButton = navbar.getByText('Teach');
        await expect(teachButton).toBeVisible();
    });

    test('Play button is visible in navbar', async ({ page }) => {
        const navbar = page.locator('[data-test="header"]');
        const playButton = navbar.getByText('Play').first();
        await expect(playButton).toBeVisible();
    });

    test('Search button is visible in navbar', async ({ page }) => {
        const searchButton = page.locator('[data-test="header-search-button"]');
        await expect(searchButton).toBeVisible();
    });
});
