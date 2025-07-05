import { expect, test } from '@playwright/test';
import { TeachPage } from '../../page/teach/education';
import { ELEMENT_PADDING_OFFSET, RESOLUTIONS } from '../visual-constants';
import { closeExternalBanners, getElementScreenshotWithPadding } from '../utils';
import { testSelector } from '../../utils';

test.describe('Education page appearance and functionality', async () => {
    test.beforeEach(async ({ context, page, baseURL }) => {
        const teachPage = new TeachPage(page);
        await teachPage.init();
        await closeExternalBanners(context, page, baseURL);
    });

    // Functional tests
    test('Should load the education page correctly', async ({ page }) => {
        expect(await page.title()).toBe('Kotlin for Education');

        const mainContent = page.locator(testSelector('teach-index-page'));
        await expect(mainContent).toBeVisible();

        const title = mainContent.locator('h1');
        await expect(title).toBeVisible();
        expect(await title.textContent()).toBe('Teach Computer Science with Kotlin');
    });

    test('Should have working navigation buttons', async ({ page }) => {
        await expect(page.locator('.teach-sticky-menu a[href="/education/"]').first()).toBeVisible();
        await expect(page.locator('.teach-sticky-menu nav span').getByText('Overview', { exact: true }).first()).toBeVisible();
        await expect(page.locator('.teach-sticky-menu nav a[href="/education/why-teach-kotlin.html"]').first()).toBeVisible();
        await expect(page.locator('.teach-sticky-menu nav a[href="/education/courses.html"]').first()).toBeVisible();
        await expect(page.locator('.teach-sticky-menu a[href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators"]').first()).toBeVisible();
    });

    test('Should display university statistics correctly', async ({ page }) => {
        // Check if the university count is displayed
        const universitiesText = await page.locator('.universities-top__title h2').textContent();
        expect(universitiesText).toBe('Kotlin Courses Around the World');

        // Check if the TeachNumbers component is visible
        const teachNumbers = page.locator('.universities-top__numbers');
        await expect(teachNumbers).toBeVisible();

        // Check if the TeachNumbers component is visible
        const subtitles = teachNumbers.locator('.teach-number__subtitle');
        expect(await subtitles.count()).toBe(2);
        expect(await subtitles.nth(0).textContent()).toBe('countries');
        expect(await subtitles.nth(1).textContent()).toBe('universities');
    });

    test('Should display university logos', async ({ page }) => {
        // Check if the university logos are visible
        const logos = page.locator('.teach-logos__logo');
        expect(await logos.count()).toBe(5);

        // Check specific universities
        await expect(page.locator('img[alt="Harvard University"]')).toBeVisible();
        await expect(page.locator('img[alt="University of Cambridge"]')).toBeVisible();
        await expect(page.locator('img[alt="Stanford University"]')).toBeVisible();
    });

    test('Should have a working interactive map', async ({ page }) => {
        // Check if the map is visible
        const map = page.locator('.teach-map__wrapper');
        await expect(map).toBeVisible();

        // The map should have markers
        const markers = page.locator('.teach-map-marker');
        expect(await markers.count()).toBeGreaterThan(0);
    });

    test('Should display map and navigation buttons', async ({ page }) => {
        const map = page.locator('.teach-universities__bottom');
        await expect(map).toBeVisible();

        // Check if the mailto button is visible and working
        const mailtoButton = page.locator('a[href="mailto:education@kotlinlang.org"]').first();
        await expect(mailtoButton).toBeVisible();

        // Check if the "All Universities" button is visible
        const allUniversitiesButton = page.locator('a[href="courses.html"]').first();
        await expect(allUniversitiesButton).toBeVisible();
    });

    test('Should have working resource links', async ({ page }) => {
        // Check if the resources section is visible
        const resourcesSection = page.locator('#start-teaching-kotlin');
        await expect(resourcesSection).toBeVisible();

        // Check if the "Tour of Kotlin" link is visible
        const tourOfKotlinLink = page.locator('a[href="/docs/kotlin-tour-welcome.html"]');
        await expect(tourOfKotlinLink).toBeVisible();
    });

    test('Should have a working YouTube player', async ({ page }) => {
        // Check if the YouTube player is visible
        const youtubePlayer = page.locator('.teach-video');
        await expect(youtubePlayer).toBeVisible();
    });

    test('Should have a working subscription form', async ({ page }) => {
        // Check if the subscription form is visible
        const subscriptionForm = page.locator('.teach-subscription-section');
        await expect(subscriptionForm).toBeVisible();
    });
/*
    // Visual regression tests for different screen sizes
    for (const [resolutionName] of Object.entries(RESOLUTIONS)) {
        test(`Should render layout of the education page properly on ${resolutionName}`, async ({ page }) => {
            const screenshot = await page.screenshot({ fullPage: true });
            // expect(screenshot).toMatchSnapshot({
            //     name: `education-layout_${resolutionName}.png`
            // });
        });

        test(`Should render hero section properly on ${resolutionName}`, async ({ page }) => {
            const heroSection = page.locator('section.ktl-layout').first();
            const screenshot = await heroSection.screenshot();
            // expect(screenshot).toMatchSnapshot(`education-hero_${resolutionName}.png`);
        });

        test(`Should render universities section properly on ${resolutionName}`, async ({ page }) => {
            const universitiesSection = page.locator('section.teach-universities');
            const screenshot = await universitiesSection.screenshot();
            // expect(screenshot).toMatchSnapshot(`education-universities_${resolutionName}.png`);
        });

        test(`Should render map properly on ${resolutionName}`, async ({ page }) => {
            const mapElement = await page.locator('.teach-map__wrapper').elementHandle();
            const screenshot = await getElementScreenshotWithPadding(page, mapElement, ELEMENT_PADDING_OFFSET);
            // expect(screenshot).toMatchSnapshot(`education-map_${resolutionName}.png`);
        });

        test(`Should render resources section properly on ${resolutionName}`, async ({ page }) => {
            const resourcesSection = page.locator('section.teach-resources');
            const screenshot = await resourcesSection.screenshot();
            // expect(screenshot).toMatchSnapshot(`education-resources_${resolutionName}.png`);
        });

        test(`Should render subscription form properly on ${resolutionName}`, async ({ page }) => {
            const subscriptionForm = page.locator('.teach-subscription-section');
            const screenshot = await subscriptionForm.screenshot();
            // expect(screenshot).toMatchSnapshot(`education-subscription_${resolutionName}.png`);
        });

        test(`Should render video section properly on ${resolutionName}`, async ({ page }) => {
            const videoSection = page.locator('.teach-video');
            const screenshot = await videoSection.screenshot();
            // expect(screenshot).toMatchSnapshot(`education-video_${resolutionName}.png`);
        });

        test(`Should render quotes section properly on ${resolutionName}`, async ({ page }) => {
            const quotesSection = page.locator('.teach-quotes');
            const screenshot = await quotesSection.screenshot();
            // expect(screenshot).toMatchSnapshot(`education-quotes_${resolutionName}.png`);
        });

        test(`Should render CTA block properly on ${resolutionName}`, async ({ page }) => {
            const ctaBlock = page.locator('.teach-cta-block');
            const screenshot = await ctaBlock.screenshot();
            // expect(screenshot).toMatchSnapshot(`education-cta_${resolutionName}.png`);
        });
    }
*/
    // Interactive tests with visual verification
    test('Should show tooltip when hovering over map marker', async ({ page }) => {
        const marker = page.locator('.teach-map-marker').first();
        await expect(marker).toBeVisible();
        await expect(marker).not.toHaveClass('teach-map-marker__active');
        await marker.click();
        await expect(marker).toHaveClass('teach-map-marker__active');
        const tooltip = marker.locator('.teach-map-tooltip').first();
        await expect(tooltip).toBeVisible();

        const screenshot = await tooltip.screenshot();
        // expect(screenshot).toMatchSnapshot('education-map-tooltip.png');
    });
});