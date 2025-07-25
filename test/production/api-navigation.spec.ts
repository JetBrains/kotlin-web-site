import { test, expect } from '@playwright/test';

test.describe('Api navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('button.ch2-btn.ch2-btn-primary');
        await page.click('button.ch2-btn.ch2-btn-primary');
        const navbar = page.locator('[data-test="header"]');
        const apiButton = navbar.getByText('API').first();
        await expect(apiButton).toBeVisible();
        await apiButton.click();
    });

    test('Click on "APIs overview" button should open the related page', async ({ page }) => {
        const apiOverviewButton = page.getByText('APIs overview').first();
        await expect(apiOverviewButton).toBeVisible();
        await apiOverviewButton.click();
        await expect(page.url()).toContain('/docs/api-references.html');
    });

    test('Click on "Standard library" button should open the related page', async ({ page }) => {
        const standardLibraryButton = page.getByText('Standard library').first();
        await expect(standardLibraryButton).toBeVisible();
        await standardLibraryButton.click();
        await expect(page.url()).toContain('/api/core/kotlin-stdlib/');
    });

    test('Click on "test library" button should open the related page', async ({ page }) => {
        const testLibraryButton = page.getByText('test library').first();
        await expect(testLibraryButton).toBeVisible();
        await testLibraryButton.click();
        await expect(page.url()).toContain('/api/core/kotlin-test/');
    });

    test('Click on "kotlinx.coroutines" button should open the related page', async ({ page }) => {
        const coroutinesButton = page.getByText('kotlinx.coroutines').first();
        await expect(coroutinesButton).toBeVisible();
        await coroutinesButton.click();
        await expect(page.url()).toContain('/api/kotlinx.coroutines/');
    });

    test('Click on "kotlinx.serialization" button should open the related page', async ({ page }) => {
        const serializationButton = page.getByText('kotlinx.serialization').first();
        await expect(serializationButton).toBeVisible();
        await serializationButton.click();
        await expect(page.url()).toContain('/api/kotlinx.serialization/');
    });

    test('Click on "kotlinx I/O" button should open the related page', async ({ page }) => {
        const ioButton = page.getByText('Kotlin I/O').first();
        await expect(ioButton).toBeVisible();
        await ioButton.click();
        await expect(page.url()).toContain('/api/kotlinx-io/');
    });

    test('Click on "kotlinx datetime" button should open the related page', async ({ page }) => {
        const datetimeButton = page.getByText('kotlinx-datetime').first();
        await expect(datetimeButton).toBeVisible();
        await datetimeButton.click();
        await expect(page.url()).toContain('/api/kotlinx-datetime/');
    });


    test('Click on "jvm metadata" button should open the related page', async ({ page }) => {
        const metadataButton = page.getByText('kotlin-metadata-jvm').first();
        await expect(metadataButton).toBeVisible();
        await metadataButton.click();
        await expect(page.url()).toContain('/api/kotlinx-metadata-jvm/');
    });

    test('Click on "Kotlin Gradle plugins" button should open the related page', async ({ page }) => {
        const kgpButton = page.getByText('Kotlin Gradle plugins').first();
        await expect(kgpButton).toBeVisible();
        await kgpButton.click();
        await expect(page.url()).toContain('/api/kotlin-gradle-plugin/');
    });

    test('Click on "Ktor" button should open the related page', async ({ page }) => {
        const kgpButton = page.getByText('Ktor').first();
        await expect(kgpButton).toBeVisible();
        await kgpButton.click();
        await expect(page.url()).toContain('api.ktor.io');
    });
});