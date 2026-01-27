import { test, expect } from '@playwright/test';
import { testSelector } from '../utils';

test.describe('Solutions tab', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        const navbar = page.locator('[data-test="header"]');
        const solutionsButton = navbar.getByText('Solutions');
        await expect(solutionsButton).toBeVisible();
        await solutionsButton.click();
    });

    test('Click on "Multiplatform" button should open the related page', async ({ page, baseURL }) => {
        const multiplatformButton = page.locator(testSelector("header")).getByText('Multiplatform').first();
        await expect(multiplatformButton).toBeVisible();
        await multiplatformButton.click();
        expect(page.url()).toContain(`/multiplatform/`);
    });

    test('Click on "Server-side" button should open the related page', async ({ page }) => {
        const serverSideButton = page.locator(testSelector("header")).getByText('Server-side').first();
        await expect(serverSideButton).toBeVisible();
        await serverSideButton.click();
        await expect(page.url()).toContain('/server-side/');
    });

    test('Click on "Data science" button should open the related page', async ({ page }) => {
        const dataScienceButton = page.locator(testSelector("header")).getByText('Data science');
        await expect(dataScienceButton).toBeVisible();
        await dataScienceButton.click();
        // We need a timeout here because of redirect to another URL.
        await page.waitForTimeout(2000);
        await expect(page.url()).toContain('/docs/data-analysis-overview.html');
    });

    test('Click on "Android" button should open the related page', async ({ page }) => {
        const androidButton = page.locator(testSelector("header")).getByText('Android').first();
        await expect(androidButton).toBeVisible();
        await androidButton.click();
        await expect(page.url()).toContain('/docs/android-overview.html');
    });
});
