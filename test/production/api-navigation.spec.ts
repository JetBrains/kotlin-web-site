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

    test('Click on "Test library" button should open the related page', async ({ page }) => {
        const testLibraryButton = page.getByText('Test library').first();
        await expect(testLibraryButton).toBeVisible();
        await testLibraryButton.click();
        await expect(page.url()).toContain('/api/core/kotlin-test/');
    });

    test('Click on "Coroutines" button should open the related page', async ({ page }) => {
        const coroutinesButton = page.getByText('Coroutines').first();
        await expect(coroutinesButton).toBeVisible();
        await coroutinesButton.click();
        await expect(page.url()).toContain('/api/kotlinx.coroutines/');
    });

    test('Click on "Serialization" button should open the related page', async ({ page }) => {
        const serializationButton = page.getByText('Serialization').first();
        await expect(serializationButton).toBeVisible();
        await serializationButton.click();
        await expect(page.url()).toContain('/api/kotlinx.serialization/');
    });

    test('Click on "Kotlin I/O library" button should open the related page', async ({ page }) => {
        const ioButton = page.getByText('Kotlin I/O library').first();
        await expect(ioButton).toBeVisible();
        await ioButton.click();
        await expect(page.url()).toContain('/api/kotlinx-io/');
    });

    test('Click on "Date and time" button should open the related page', async ({ page }) => {
        const datetimeButton = page.getByText('Date and time').first();
        await expect(datetimeButton).toBeVisible();
        await datetimeButton.click();
        await expect(page.url()).toContain('/api/kotlinx-datetime/');
    });


    test('Click on "JVM Metadata" button should open the related page', async ({ page }) => {
        const metadataButton = page.getByText('JVM Metadata').first();
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
        const ktorButton = page.getByText('Ktor').first();
        await expect(ktorButton).toBeVisible();
        await ktorButton.click();
        await expect(page.url()).toContain('api.ktor.io');
    });
});