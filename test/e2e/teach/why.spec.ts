import { expect, test } from '@playwright/test';
import { WhyTeachPage } from '../../page/teach/why-page';
import { RESOLUTIONS } from '../visual-constants';
import { closeExternalBanners } from '../utils';

test.describe('Why Teach Kotlin page appearance and functionality', async () => {
    test.beforeEach(async ({ page, context, baseURL }) => {
        const whyTeachPage = new WhyTeachPage(page);
        await whyTeachPage.init();
        await closeExternalBanners(context, page, baseURL);
    });

    // Functional tests
    test('Should load the Why Teach Kotlin page correctly', async ({ page }) => {
        // Check if the page title is correct
        const title = await page.title();
        expect(title).toContain('Kotlin');

        // Check if the main content is visible
        const mainContent = page.locator('.teach-wrapper');
        await expect(mainContent).toBeVisible();

        // Check if the page heading is correct
        const heading = page.locator('h1');
        expect(await heading.textContent()).toBe('Why Teach Kotlin');
    });

    test('Should have working navigation menu', async ({ page }) => {
        // Check if the navigation menu is visible
        const navMenu = page.locator('.why-teach-nav');
        await expect(navMenu).toBeVisible();

        // Check if all navigation items are present
        const navItems = page.locator('.why-teach-nav__item');
        expect(await navItems.count()).toBe(7);

        // Check specific navigation items
        await expect(page.locator('a[href="#academically-recognized"]')).toBeVisible();
        await expect(page.locator('a[href="#language-of-the-industry"]')).toBeVisible();
        await expect(page.locator('a[href="#multiplatform"]')).toBeVisible();
        await expect(page.locator('a[href="#interoperable"]')).toBeVisible();
        await expect(page.locator('a[href="#supports-multiple-paradigms"]')).toBeVisible();
        await expect(page.locator('a[href="#modern-concise-and-safe"]')).toBeVisible();
        await expect(page.locator('a[href="#tooling"]')).toBeVisible();
    });

    test('Should navigate to sections when clicking on navigation items', async ({ page }) => {
        // Click on a navigation item
        await page.locator('a[href="#multiplatform"]').click();

        // Check if the section is visible in the viewport
        const multiplatformSection = page.locator('#multiplatform');
        await expect(multiplatformSection).toBeVisible();

        // Check if the URL hash has been updated
        expect(page.url()).toContain('#multiplatform');
    });

    test('Should display quotes slider in each section', async ({ page }) => {
        // Check if quotes sliders are present in all sections
        const quotesSliders = page.locator('[class*="ktl-quotes-slider-module_quotes-slider"]');
        expect(await quotesSliders.count()).toBeGreaterThan(0);

        // Check if the first quotes slider is visible
        await expect(quotesSliders.first()).toBeVisible();
    });

    test('Should have working external links', async ({ page }) => {
        // Check if external links are present
        const externalLinks = page.locator('a[target="_blank"]');
        expect(await externalLinks.count()).toBeGreaterThan(0);

        // Check specific external links
        await expect(page.locator('a[href="https://www.jetbrains.com/community/education/#students"]')).toBeVisible();
        await expect(page.locator('a[href="https://play.kotlinlang.org/"]')).toBeVisible();
    });

    // Visual regression tests for different screen sizes
    for (const [resolutionName, resolution] of Object.entries(RESOLUTIONS)) {
        test(`Should render layout of the Why Teach Kotlin page properly on ${resolutionName}`, async ({ page }) => {
            const screenshot = await page.screenshot({ fullPage: true });
            // expect(screenshot).toMatchSnapshot({
            //     name: `why-teach-layout_${resolutionName}.png`
            // });
        });

        test(`Should render hero section properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const heroSection = page.locator('h1').first().locator('..').locator('..');
            const screenshot = await heroSection.screenshot();
            // expect(screenshot).toMatchSnapshot(`why-teach-hero_${resolutionName}.png`);
        });

        test(`Should render academically recognized section properly on ${resolutionName}`, async ({ page }) => {
            const section = page.locator('#academically-recognized');
            const screenshot = await section.screenshot();
            // expect(screenshot).toMatchSnapshot(`why-teach-academically-recognized_${resolutionName}.png`);
        });

        test(`Should render language of the industry section properly on ${resolutionName}`, async ({ page }) => {
            const section = page.locator('#language-of-the-industry');
            const screenshot = await section.screenshot();
            // expect(screenshot).toMatchSnapshot(`why-teach-language-of-industry_${resolutionName}.png`);
        });

        test(`Should render multiplatform section properly on ${resolutionName}`, async ({ page }) => {
            const section = page.locator('#multiplatform');
            const screenshot = await section.screenshot();
            // expect(screenshot).toMatchSnapshot(`why-teach-multiplatform_${resolutionName}.png`);
        });

        test(`Should render interoperable section properly on ${resolutionName}`, async ({ page }) => {
            const section = page.locator('#interoperable');
            const screenshot = await section.screenshot();
            // expect(screenshot).toMatchSnapshot(`why-teach-interoperable_${resolutionName}.png`);
        });

        test(`Should render supports multiple paradigms section properly on ${resolutionName}`, async ({ page }) => {
            const section = page.locator('#supports-multiple-paradigms');
            const screenshot = await section.screenshot();
            // expect(screenshot).toMatchSnapshot(`why-teach-multiple-paradigms_${resolutionName}.png`);
        });

        test(`Should render modern, concise, and safe section properly on ${resolutionName}`, async ({ page }) => {
            const section = page.locator('#modern-concise-and-safe');
            const screenshot = await section.screenshot();
            // expect(screenshot).toMatchSnapshot(`why-teach-modern-concise-safe_${resolutionName}.png`);
        });

        test(`Should render tooling section properly on ${resolutionName}`, async ({ page }) => {
            const section = page.locator('#tooling');
            const screenshot = await section.screenshot();
            // expect(screenshot).toMatchSnapshot(`why-teach-tooling_${resolutionName}.png`);
        });

        test(`Should render navigation menu properly on ${resolutionName}`, async ({ page }) => {
            const navMenu = page.locator('.why-teach-nav');
            const screenshot = await navMenu.screenshot();
            // expect(screenshot).toMatchSnapshot(`why-teach-nav-menu_${resolutionName}.png`);
        });

        test(`Should render CTA block properly on ${resolutionName}`, async ({ page }) => {
            const ctaBlock = page.locator('.teach-cta-block');
            const screenshot = await ctaBlock.screenshot();
            // expect(screenshot).toMatchSnapshot(`why-teach-cta_${resolutionName}.png`);
        });
    }

    // Interactive tests with visual verification
    test('Should navigate to section and highlight it in the navigation menu', async ({ page }) => {
        // Click on a navigation item
        await page.locator('a[href="#multiplatform"]').click();

        // Take a screenshot of the navigation menu to verify the active item
        const navMenu = page.locator('.why-teach-nav');
        const screenshot = await navMenu.screenshot();
        // expect(screenshot).toMatchSnapshot('why-teach-nav-menu-active.png');
    });

    test('Should show quotes slider navigation when hovering', async ({ page }) => {

        // Hover over the first quotes slider
        const quotesSlider = page.locator('[class*="ktl-quotes-slider-module_quotes-slider"]').first();
        await quotesSlider.hover();

        // Take a screenshot to verify the navigation is visible
        const screenshot = await quotesSlider.screenshot();
        // expect(screenshot).toMatchSnapshot('why-teach-quotes-slider-hover.png');
    });
});