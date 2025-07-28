import { test, expect } from '@playwright/test';

test.describe('Solutions tab', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('button.ch2-btn.ch2-btn-primary');
        await page.click('button.ch2-btn.ch2-btn-primary');
        const navbar = page.locator('[data-test="header"]');
        const solutionsButton = navbar.getByText('Solutions');
        await expect(solutionsButton).toBeVisible();
        await solutionsButton.click();
    });

    test('Click on "Multiplatform" button should open the related page', async ({ page }) => {
        const multiplatformButton = page.getByText('Multiplatform').first();
        await expect(multiplatformButton).toBeVisible();
        await multiplatformButton.click();
        await expect(page.url()).toContain('https://www.jetbrains.com/kotlin-multiplatform/');
    });

    test('Click on "Server-side" button should open the related page', async ({ page }) => {
        const serverSideButton = page.getByText('Server-side').first();
        await expect(serverSideButton).toBeVisible();
        await serverSideButton.click();
        await expect(page.url()).toContain('/lp/server-side/');
    });

    test('Click on "Data science" button should open the related page', async ({ page }) => {
        const dataScienceButton = page.getByText('Data science');
        await expect(dataScienceButton).toBeVisible();
        await dataScienceButton.click();
        // We need a timeout here because of redirect to another URL.
        await page.waitForTimeout(2000);
        await expect(page.url()).toContain('/docs/data-analysis-overview.html');
    });

    test('Click on "Android" button should open the related page', async ({ page }) => {
        const androidButton = page.getByText('Android').first();
        await expect(androidButton).toBeVisible();
        await androidButton.click();
        await expect(page.url()).toContain('/docs/android-overview.html');
    });
});
