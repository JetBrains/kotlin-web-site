import { expect, test } from '@playwright/test';
import { testSelector } from '../utils';

test.describe('Main page buttons', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Hero section Get started button', async ({ page, baseURL }) => {
        const getStartedButton = page.getByTestId('hero-block').getByRole('link', { name: 'Get started' });
        await expect(getStartedButton).toBeVisible();
        await getStartedButton.click();
        expect(page.url()).toContain(`${baseURL}/docs/getting-started.html`);
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toContainText('Get started with Kotlin');
    });

    test('Develop by JetBrains link should navigate to JetBrains homepage', async ({ page, context }) => {
        const jetBrainsLink = page.getByTestId('hero-block').getByRole('link', { name: 'JetBrains' });
        await expect(jetBrainsLink).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await jetBrainsLink.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        expect(newPage.url()).toContain('https://www.jetbrains.com/');
    });

    test('Kotlin blog button', async ({ page }) => {
        const blogButton = page.getByRole('link', { name: 'Kotlin blog' }).and(page.locator(testSelector('button')));
        await expect(blogButton).toBeVisible();
        await blogButton.click();
        expect(page.url()).toContain('https://blog.jetbrains.com/kotlin/');
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toContainText('Kotlin');
    });

    test('Why Kotlin Get started button', async ({ page, baseURL }) => {
        const whyKotlinButton = page.getByTestId('why-kotlin-block').getByRole('link', { name: 'Get started' });
        await expect(whyKotlinButton).toBeVisible();
        await whyKotlinButton.click();
        expect(page.url()).toContain(`${baseURL}/docs/getting-started.html`);
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toContainText('Get started with Kotlin');
    });

    test('Learn about Kotlin Multiplatform button', async ({ page, baseURL }) => {
        const multiplatformButton = page.getByTestId('highlighted-cases-section').getByRole('link', { name: 'Learn about Kotlin Multiplatform' });
        await expect(multiplatformButton).toBeVisible();
        await multiplatformButton.click();
        expect(page.url()).toContain(`${baseURL}/multiplatform/`);
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toContainText('Kotlin Multiplatform');
    });

    test('Learn about JetBrains AI button', async ({ page }) => {
        const jetbrainsAIButton = page.getByTestId('highlighted-cases-section').getByRole('link', { name: 'Learn about JetBrains AI' });
        await expect(jetbrainsAIButton).toBeVisible();
        await jetbrainsAIButton.click();
        expect(page.url()).toContain('https://www.jetbrains.com/ai/');
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toContainText('JetBrains AI');
    });

    test('Build AI apps with Kotlin button', async ({ page, baseURL }) => {
        const buildAIAppsButton = page.getByTestId('highlighted-cases-section').getByRole('link', { name: 'Build AI apps with Kotlin' });
        await expect(buildAIAppsButton).toBeVisible();
        await buildAIAppsButton.click();
        expect(page.url()).toContain(`${baseURL}/docs/kotlin-ai-apps-development-overview.html`);
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toContainText('Kotlin for AI-powered app development');
    });

    test('Get started in AI section', async ({ page }) => {
        const getStartedKoogButton = page.getByTestId('highlighted-cases-section').getByTestId('kotlin-plus-ai-block').getByRole('link', { name: 'Get started' });
        await expect(getStartedKoogButton).toBeVisible();
        await getStartedKoogButton.click();
        expect(page.url()).toContain('/docs.koog.ai/');
        await expect(page.getByText('Koog on GitHub').first()).toBeVisible();
    });

    test('Join the community button', async ({ page, baseURL }) => {
        const joinCommunityButton = page.getByTestId('highlighted-cases-section').getByRole('link', { name: 'Join the community' });
        await expect(joinCommunityButton).toBeVisible();
        await joinCommunityButton.click();
        await page.waitForTimeout(2000);
        expect(page.url()).toContain(`${baseURL}/community/`);
        await expect(page.getByText('Get involved in the community')).toBeVisible();
    });

    test('Learn more button in Kotlin Foundation section', async ({ page }) => {
        const learnMoreButton = page.getByTestId('highlighted-cases-section').getByRole('link', { name: 'Learn more' });
        await expect(learnMoreButton).toBeVisible();
        await learnMoreButton.click();
        expect(page.url()).toContain('https://kotlinfoundation.org/');
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toContainText('Protect, promote and advance the development of the Kotlin programming language');
    });

    test('Last Get started button', async ({ page, baseURL }) => {
        const getStartedButton = page.getByTestId('highlighted-cases-section').getByRole('link', { name: 'Get started' }).last();
        await expect(getStartedButton).toBeVisible();
        await getStartedButton.click();
        expect(page.url()).toContain(`${baseURL}/docs/getting-started.html`);
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toContainText('Get started with Kotlin');
    });
});
