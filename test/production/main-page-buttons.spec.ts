import { test, expect } from '@playwright/test';

test.describe('Main page buttons', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('button.ch2-btn.ch2-btn-primary');
        await page.click('button.ch2-btn.ch2-btn-primary');
    });

    test('Hero section Get started button', async ({ page }) => {
        const getStartedButton = page.getByRole('link', { name: 'Get started' }).first();
        await expect(getStartedButton).toBeVisible();
        await getStartedButton.click();
        await expect(page.url()).toContain('/docs/getting-started.html');
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toContainText('Get started with Kotlin');
    });

    test('Kotlin blog button', async ({ page }) => {
        const blogButton = page.getByRole('link', { name: 'Kotlin blog' });
        await expect(blogButton).toBeVisible();
        await blogButton.click();
        await expect(page.url()).toContain('https://blog.jetbrains.com/kotlin/');
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toContainText('Kotlin')
    });

    test('Why Kotlin Get started button', async ({ page }) => {
        const whyKotlinButton = page.locator('a[class*=\'why-kotlin\']');
        await expect(whyKotlinButton).toBeVisible();
        await whyKotlinButton.click();
        await expect(page.url()).toContain('/docs/getting-started.html');
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toContainText('Get started with Kotlin');
    });

    test('Learn about Kotlin Multiplatform button', async ({ page }) => {
        const multiplatformButton = page.getByRole('link', { name: 'Learn about Kotlin Multiplatform' });
        await expect(multiplatformButton).toBeVisible();
        await multiplatformButton.click();
        await expect(page.url()).toContain('https://www.jetbrains.com/kotlin-multiplatform/');
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toContainText('Kotlin Multiplatform');
    });

    test('Learn about JetBrains AI button', async ({ page, context }) => {
        const jetbrainsAIButton = page.getByRole('link', { name: 'Learn about JetBrains AI' })
        await expect(jetbrainsAIButton).toBeVisible();
        await jetbrainsAIButton.click();
        await expect(page.url()).toContain('https://www.jetbrains.com/ai/');
        const pageTitle = page.locator('h1').first()
        await expect(pageTitle).toContainText('JetBrains AI');
    });

    test('Build AI apps with Kotlin button', async ({ page }) => {
        const buildAIAppsButton = page.getByRole('link', { name: 'Build AI apps with Kotlin' })
        await expect(buildAIAppsButton).toBeVisible();
        await buildAIAppsButton.click();
        await expect(page.url()).toContain('/docs/kotlin-ai-apps-development-overview.html');
        const pageTitle = page.locator('h1').first()
        await expect(pageTitle).toContainText('Kotlin for AI-powered app development');
    });

    test('Get started in AI section', async ({ page }) => {
        const getStartedKoogButton = page.locator('a[class*=\'kotlin-plus-ai\'] span[data-test=\'button__content\']');
        await expect(getStartedKoogButton).toBeVisible();
        await getStartedKoogButton.click();
        await expect(page.url()).toContain('/docs.koog.ai/')
        await expect(page.getByText('Koog is a Kotlin-based framework')).toBeVisible();
    });

    test('Join the community button', async ({ page }) => {
        const joinCommunityButton = page.getByRole('link', { name: 'Join the community' });
        await expect(joinCommunityButton).toBeVisible();
        await joinCommunityButton.click();
        await page.waitForTimeout(2000);
        await expect(page.url()).toContain('/community/');
        await expect(page.getByText('Get involved in the community')).toBeVisible();
    });

    test('Learn more button in Kotlin Foundation section', async ({ page }) => {
        const learnMoreButton = page.getByRole('link', { name: 'Learn more' });
        await expect(learnMoreButton).toBeVisible();
        await learnMoreButton.click();
        await expect(page.url()).toContain('https://kotlinfoundation.org/');
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toContainText('Protect, promote and advance the development of the Kotlin programming language');
    });

    test('Last Get started button', async ({ page }) => {
        const getStartedButton = page.getByRole('link', { name: 'Get started' }).last();
        await expect(getStartedButton).toBeVisible();
        await getStartedButton.click();
        await expect(page.url()).toContain('/docs/getting-started.html');
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toContainText('Get started with Kotlin');
    });
});
