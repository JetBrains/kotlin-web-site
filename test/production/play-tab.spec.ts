import { test, expect } from '@playwright/test';

test.describe('Play tab', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('button.ch2-btn.ch2-btn-primary');
        await page.click('button.ch2-btn.ch2-btn-primary');
        const navbar = page.locator('[data-test="header"]');
        const solutionsButton = navbar.getByText('Play').first();
        await expect(solutionsButton).toBeVisible();
        await solutionsButton.click();
    });

    test('Click on "Play" button should open the related page', async ({ page }) => {
        const multiplatformButton = page.getByText('Playground').first();
        await expect(multiplatformButton).toBeVisible();
        await multiplatformButton.click();
        await expect(page.url()).toContain('https://play.kotlinlang.org/');
    });

    test('Click on "Examples" button should open the related page', async ({ page }) => {
        const multiplatformButton = page.getByText('Examples').first();
        await expect(multiplatformButton).toBeVisible();
        await multiplatformButton.click();
        await expect(page.url()).toContain('https://play.kotlinlang.org/byExample');

    });

    test('Click on "Koans" button should open the related page', async ({ page }) => {
        const multiplatformButton = page.getByText('Koans');
        await expect(multiplatformButton).toBeVisible();
        await multiplatformButton.click();
        await expect(page.url()).toContain('https://play.kotlinlang.org/koans');
    });
});