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
        expect(page.url()).toContain(`${baseURL}/multiplatform/`);
    });

    test('Click on "Backend" button should open the related page', async ({ page, baseURL }) => {
        const backendButton = page.locator(testSelector("header")).getByText('Backend').first();
        await expect(backendButton).toBeVisible();
        await backendButton.click();
        expect(page.url()).toContain(`${baseURL}/backend/`);
    });

    test('Click on "Data science" button should open the related page', async ({ page, baseURL }) => {
        const dataScienceButton = page.locator(testSelector("header")).getByText('Data science');
        await expect(dataScienceButton).toBeVisible();
        await dataScienceButton.click();
        // We need a timeout here because of redirect to another URL.
        await page.waitForTimeout(2000);
        expect(page.url()).toContain(`${baseURL}/docs/data-analysis-overview.html`);
    });

    test('Click on "Android" button should open the related page', async ({ page, baseURL }) => {
        const androidButton = page.locator(testSelector("header")).getByText('Android').first();
        await expect(androidButton).toBeVisible();
        await androidButton.click();
        expect(page.url()).toContain(`${baseURL}/docs/android-overview.html`);
    });
});
