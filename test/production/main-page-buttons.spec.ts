import { expect, test } from '@playwright/test';
import { testSelector } from '../utils';

test.describe('Main page buttons', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Hero section Get started button', async ({ page, baseURL }) => {
        const getStartedButton = page.getByTestId('hero-get-started-button');
        await expect(getStartedButton).toBeVisible();
        await getStartedButton.click();
        expect(page.url()).toContain(`${baseURL}/docs/getting-started.html`);
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toContainText('Get started with Kotlin');
    });

    test('Develop by JetBrains link should navigate to JetBrains homepage', async ({ page, context }) => {
        const jetBrainsLink = page.getByTestId('hero-jetbrains-link');
        await expect(jetBrainsLink).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await jetBrainsLink.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        expect(newPage.url()).toContain('https://www.jetbrains.com/');
    });

    test('Hero Multiplatform nav link', async ({ page, baseURL }) => {
        const link = page.getByTestId('hero-block-main-page').locator('a[href="/multiplatform/"]');
        await expect(link).toBeVisible();
        await link.click();
        await page.waitForURL('**/multiplatform/');
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toContainText('Kotlin Multiplatform');
    });

    test('Hero Backend nav link', async ({ page, baseURL }) => {
        const link = page.getByTestId('hero-block-main-page').locator('a[href="/backend/"]');
        await expect(link).toBeVisible();
        await link.click();
        await page.waitForURL('**/backend/');
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toContainText('Modern backend development with Kotlin');
    });

    test('Hero AI nav link', async ({ page, baseURL }) => {
        const link = page.getByTestId('hero-block-main-page').locator('a[href="/docs/kotlin-ai-apps-development-overview.html"]');
        await expect(link).toBeVisible();
        await link.click();
        expect(page.url()).toContain(`${baseURL}/docs/kotlin-ai-apps-development-overview.html`);
    });

    test('Hero Android nav link', async ({ page, baseURL }) => {
        const link = page.getByTestId('hero-block-main-page').locator('a[href="/docs/android-overview.html"]');
        await expect(link).toBeVisible();
        await link.click();
        expect(page.url()).toContain(`${baseURL}/docs/android-overview.html`);
    });

    test('Hero Kotlin tour nav link', async ({ page, baseURL }) => {
        const link = page.getByTestId('hero-block-main-page').locator('a[href="/docs/kotlin-tour-welcome.html"]');
        await expect(link).toBeVisible();
        await link.click();
        expect(page.url()).toContain(`${baseURL}/docs/kotlin-tour-welcome.html`);
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

    test('Explore the Kotlin Benchmark button in Kotlin+AI banner', async ({ page, baseURL }) => {
        const benchmarkButton = page
            .getByTestId('kotlin-ai-banner-block')
            .getByRole('link', { name: 'Explore the Kotlin Benchmark' });
        await expect(benchmarkButton).toBeVisible();
        await benchmarkButton.click();
        expect(page.url()).toContain(`${baseURL}/benchmark/`);
        await expect(page.getByTestId('benchmark-landing')).toBeVisible();
    });

    test('Build AI apps with Kotlin button in Kotlin+AI banner', async ({ page, baseURL }) => {
        const buildAIAppsButton = page
            .getByTestId('kotlin-ai-banner-block')
            .getByRole('link', { name: 'Build AI apps with Kotlin' });
        await expect(buildAIAppsButton).toBeVisible();
        await buildAIAppsButton.click();
        expect(page.url()).toContain(`${baseURL}/docs/kotlin-ai-apps-development-overview.html`);
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toContainText('Kotlin for AI-powered app development');
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
