import { expect, test } from '@playwright/test';
import { testSelector } from '../utils';
import { TeachPage } from '../page/teach-page';
import {
    ELEMENT_PADDING_OFFSET,
    MICRO_ANIMATION_TIMEOUT,
    RESOLUTIONS
} from './visual-constants';
import { getElementScreenshotWithPadding } from './utils';

const MAX_DIFF_PIXEL_RATIO = 0.011;

test.describe('Education page appearance and functionality', async () => {
    test.beforeEach(async ({ page }) => {
        const teachPage = new TeachPage(page);
        await teachPage.init();
    });

    // Functional tests
    test('Should load the education page correctly', async ({ page }) => {
        // Check if the page title is correct
        const title = await page.title();
        expect(title).toContain('Kotlin');

        // Check if the main content is visible
        const mainContent = await page.locator(testSelector('teach-index-page'));
        await expect(mainContent).toBeVisible();

        // Log a debug message
        console.log('[DEBUG_LOG] Education page loaded successfully');
    });

    test('Should have working navigation buttons', async ({ page }) => {
        // Check the "Why Teach Kotlin" button
        const whyTeachButton = page.locator('a[href="why-teach-kotlin.html"]').first();
        await expect(whyTeachButton).toBeVisible();
        
        // Check "Join Educators Community" button
        const joinCommunityButton = page.locator('a[href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators"]').first();
        await expect(joinCommunityButton).toBeVisible();
        
        // Check the "All universities" button
        const allUniversitiesButton = page.locator('a[href="courses.html"]').first();
        await expect(allUniversitiesButton).toBeVisible();
    });

    test('Should display university statistics correctly', async ({ page }) => {
        // Check if the universities count is displayed
        const universitiesText = await page.locator('h2.universities-top__title-mobile').textContent();
        expect(universitiesText).toContain('universities');
        
        // Check if the TeachNumbers component is visible
        const teachNumbers = await page.locator('.universities-top__numbers');
        await expect(teachNumbers).toBeVisible();
    });

    test('Should have a working interactive map', async ({ page }) => {
        // Check if the map is visible
        const map = await page.locator('.teach-map__wrapper');
        await expect(map).toBeVisible();
        
        // The map should have markers
        const markers = await page.locator('.teach-map-marker');
        expect(await markers.count()).toBeGreaterThan(0);
    });

    test('Should display university logos', async ({ page }) => {
        // Check if the university logos are visible
        const logos = await page.locator('.teach-logos__logo');
        expect(await logos.count()).toBe(5);
        
        // Check specific universities
        await expect(page.locator('img[alt="Harvard University"]')).toBeVisible();
        await expect(page.locator('img[alt="University of Cambridge"]')).toBeVisible();
        await expect(page.locator('img[alt="Stanford University"]')).toBeVisible();
    });

    test('Should have working resource links', async ({ page }) => {
        // Check if the resources section is visible
        const resourcesSection = await page.locator('#start-teaching-kotlin');
        await expect(resourcesSection).toBeVisible();
        
        // Check if the "Tour of Kotlin" link is visible
        const tourOfKotlinLink = await page.locator('a[href="/docs/kotlin-tour-welcome.html"]');
        await expect(tourOfKotlinLink).toBeVisible();
    });

    test('Should have a working YouTube player', async ({ page }) => {
        // Check if the YouTube player is visible
        const youtubePlayer = await page.locator('.teach-video');
        await expect(youtubePlayer).toBeVisible();
    });

    test('Should have a working subscription form', async ({ page }) => {
        // Check if the subscription form is visible
        const subscriptionForm = await page.locator('.teach-subscription-section');
        await expect(subscriptionForm).toBeVisible();
    });

    // Visual regression tests for different screen sizes
    for (const [resolutionName, resolution] of Object.entries(RESOLUTIONS)) {
        test(`Should render layout of the education page properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const screenshot = await page.screenshot({ fullPage: true });
            expect(screenshot).toMatchSnapshot({
                name: `education-layout_${resolutionName}.png`,
                maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO
            });
        });

        test(`Should render hero section properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const heroSection = page.locator('section.ktl-layout').first();
            const screenshot = await heroSection.screenshot();
            expect(screenshot).toMatchSnapshot(`education-hero_${resolutionName}.png`);
        });

        test(`Should render universities section properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const universitiesSection = page.locator('section.teach-universities');
            const screenshot = await universitiesSection.screenshot();
            expect(screenshot).toMatchSnapshot(`education-universities_${resolutionName}.png`);
        });

        test(`Should render map properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const mapElement = await page.locator('.teach-map__wrapper').elementHandle();
            const screenshot = await getElementScreenshotWithPadding(page, mapElement, ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot(`education-map_${resolutionName}.png`);
        });

        test(`Should render resources section properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const resourcesSection = page.locator('section.teach-resources');
            const screenshot = await resourcesSection.screenshot();
            expect(screenshot).toMatchSnapshot(`education-resources_${resolutionName}.png`);
        });

        test(`Should render subscription form properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const subscriptionForm = page.locator('.teach-subscription-section');
            const screenshot = await subscriptionForm.screenshot();
            expect(screenshot).toMatchSnapshot(`education-subscription_${resolutionName}.png`);
        });

        test(`Should render video section properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const videoSection = page.locator('.teach-video');
            const screenshot = await videoSection.screenshot();
            expect(screenshot).toMatchSnapshot(`education-video_${resolutionName}.png`);
        });

        test(`Should render quotes section properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const quotesSection = page.locator('.teach-quotes');
            const screenshot = await quotesSection.screenshot();
            expect(screenshot).toMatchSnapshot(`education-quotes_${resolutionName}.png`);
        });

        test(`Should render CTA block properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const ctaBlock = page.locator('.teach-cta-block');
            const screenshot = await ctaBlock.screenshot();
            expect(screenshot).toMatchSnapshot(`education-cta_${resolutionName}.png`);
        });
    }

    // Interactive tests with visual verification
    test('Should show tooltip when hovering over map marker', async ({ page }) => {
        await page.setViewportSize(RESOLUTIONS.desktop);
        const marker = page.locator('.teach-map-marker').first();
        await marker.hover();
        await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT);
        
        const tooltip = page.locator('.teach-map-tooltip');
        await expect(tooltip).toBeVisible();
        
        const screenshot = await tooltip.screenshot();
        expect(screenshot).toMatchSnapshot('education-map-tooltip.png');
    });
});