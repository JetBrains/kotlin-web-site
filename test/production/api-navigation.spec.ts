import { expect, Page, test } from '@playwright/test';

test.describe('Api navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('button.ch2-btn.ch2-btn-primary');
        await page.click('button.ch2-btn.ch2-btn-primary');
        const navbar = page.locator('[data-test="header"]');
        const apiButton = navbar.getByText('API', { exact: true });
        await expect(apiButton).toBeVisible();
        await apiButton.click();
        await expect(apiButton).toBeVisible();
        await apiButton.click();
    });

    test('Click on "APIs overview" button should open the related page', async ({ page }) => {
        const apiOverviewButton = await hoverOverApiElement(page, 'APIs overview');
        await expect(apiOverviewButton).toBeVisible();
        await apiOverviewButton.click();
        expect(page.url()).toContain('/docs/api-references.html');
    });

    test('Click on "Standard library" button should open the related page', async ({ page }) => {
        const standardLibraryButton = await hoverOverApiElement(page, 'Standard library');
        await expect(standardLibraryButton).toBeVisible();
        await standardLibraryButton.click();
        expect(page.url()).toContain('/api/core/kotlin-stdlib/');
    });

    test('Click on "Test library" button should open the related page', async ({ page }) => {
        const testLibraryButton = await hoverOverApiElement(page, 'Test library');
        await expect(testLibraryButton).toBeVisible();
        await testLibraryButton.click();
        expect(page.url()).toContain('/api/core/kotlin-test/');
    });

    test('Click on "Coroutines" button should open the related page', async ({ page }) => {
        const coroutinesButton = await hoverOverApiElement(page, 'Coroutines');
        await expect(coroutinesButton).toBeVisible();
        await coroutinesButton.click();
        expect(page.url()).toContain('/api/kotlinx.coroutines/');
    });

    test('Click on "Serialization" button should open the related page', async ({ page }) => {
        const serializationButton = await hoverOverApiElement(page, 'Serialization');
        await expect(serializationButton).toBeVisible();
        await serializationButton.click();
        expect(page.url()).toContain('/api/kotlinx.serialization/');
    });

    test('Click on "Kotlin I/O library" button should open the related page', async ({ page }) => {
        const ioButton = await hoverOverApiElement(page, 'Kotlin I/O library');
        await expect(ioButton).toBeVisible();
        await ioButton.click();
        expect(page.url()).toContain('/api/kotlinx-io/');
    });

    test('Click on "Date and time" button should open the related page', async ({ page }) => {
        const datetimeButton = await hoverOverApiElement(page, 'Date and time');
        await expect(datetimeButton).toBeVisible();
        await datetimeButton.click();
        expect(page.url()).toContain('/api/kotlinx-datetime/');
    });

    test('Click on "JVM Metadata" button should open the related page', async ({ page }) => {
        const metadataButton = await hoverOverApiElement(page, 'JVM Metadata');
        await expect(metadataButton).toBeVisible();
        await metadataButton.click();
        expect(page.url()).toContain('/api/kotlinx-metadata-jvm/');
    });

    test('Click on "Kotlin Gradle plugins" button should open the related page', async ({ page }) => {
        const kgpButton = await hoverOverApiElement(page, 'Kotlin Gradle plugins');
        await expect(kgpButton).toBeVisible();
        await kgpButton.click();
        expect(page.url()).toContain('/api/kotlin-gradle-plugin/');
    });

    test('Click on "Ktor" button should open the related page', async ({ page }) => {
        const ktorButton = await hoverOverApiElement(page, 'Ktor');
        await expect(ktorButton).toBeVisible();
        await ktorButton.click();
        expect(page.url()).toContain('api.ktor.io');
    });
});

async function hoverOverApiElement(page: Page, text: string) {
    const navbar = page.locator('[data-test="header"]').getByText('API', { exact: true }).first().locator('..');

    await navbar.hover();

    const el = navbar.getByText(text);
    await expect(el).toBeVisible();

    return el;
}