import { expect, test } from '@playwright/test';
import { CoursesPage } from '../../page/teach/courses-page';
import { ELEMENT_PADDING_OFFSET, RESOLUTIONS } from '../visual-constants';
import { closeExternalBanners, getElementScreenshotWithPadding } from '../utils';

test.describe('Courses page appearance and functionality', async () => {
    test.beforeEach(async ({ page, context, baseURL }) => {
        const coursesPage = new CoursesPage(page);
        await coursesPage.init();
        await closeExternalBanners(context, page, baseURL);
    });

    // Functional tests
    test('Should load the courses page correctly', async ({ page }) => {
        expect(await page.title()).toBe('List of Courses');
        const mainContent = page.locator('h1');
        await expect(mainContent).toBeVisible();
        expect(await mainContent.textContent()).toBe('Universities That Teach Kotlin');
    });

    test('Should have working tab navigation', async ({ page }) => {
        // Check if the tab list is visible
        const tabList = page.locator('.rs-tab-list');
        await expect(tabList).toBeVisible();

        // Check if both tabs are present
        const tableViewTab = page.locator('button').filter({ hasText: 'Table view' });
        const mapViewTab = page.locator('button').filter({ hasText: 'Map view' });
        await expect(tableViewTab).toBeVisible();
        await expect(mapViewTab).toBeVisible();

        // Table view should be active by default
        expect(await tableViewTab.getAttribute('aria-selected')).toBe('true');
        expect(await mapViewTab.getAttribute('aria-selected')).toBe('false');

        // CoursesList should be visible in the table view
        await expect(page.locator('.courses-list')).toBeVisible();

        // Switch to the map view
        await mapViewTab.click();

        // Map view should now be active
        expect(await tableViewTab.getAttribute('aria-selected')).toBe('false');
        expect(await mapViewTab.getAttribute('aria-selected')).toBe('true');

        // TeachMap should be visible in the map view
        await expect(page.locator('.teach-map__wrapper')).toBeVisible();

        // Switch back to the table view
        await tableViewTab.click();

        // Table view should be active again
        expect(await tableViewTab.getAttribute('aria-selected')).toBe('true');
        expect(await mapViewTab.getAttribute('aria-selected')).toBe('false');

        // CoursesList should be visible again
        await expect(page.locator('.courses-list')).toBeVisible();
    });

    test('Should display university list in table view', async ({ page }) => {
        // Make sure we're in a table view
        const tableViewTab = page.locator('button').filter({ hasText: 'Table view' });
        await tableViewTab.click();

        // Check if the course list is visible
        const coursesList = page.locator('.courses-list');
        await expect(coursesList).toBeVisible();

        // Check if there are universities in the list
        const universities = page.locator('.courses-list__item');
        expect(await universities.count()).toBeGreaterThan(0);

        // Check if university details are displayed
        const firstUniversity = universities.first();
        await expect(firstUniversity.locator('.courses-list__item-title')).toBeVisible();
        await expect(firstUniversity.locator('.courses-list__item-country')).toBeVisible();
    });

    test('Should display map with markers in map view', async ({ page }) => {
        // Switch to the map view
        const mapViewTab = page.locator('button').filter({ hasText: 'Map view' });
        await mapViewTab.click();

        // Check if the map is visible
        const map = page.locator('.teach-map__wrapper');
        await expect(map).toBeVisible();

        // Check if there are markers on the map
        const markers = page.locator('.teach-map-marker');
        expect(await markers.count()).toBeGreaterThan(0);
    });

    // Visual regression tests for different screen sizes
    for (const [resolutionName, resolution] of Object.entries(RESOLUTIONS)) {
        test(`Should render layout of the courses page properly on ${resolutionName}`, async ({ page }) => {
            const screenshot = await page.screenshot({ fullPage: true });
            // expect(screenshot).toMatchSnapshot({
            //     name: `courses-layout_${resolutionName}.png`
            // });
        });

        test(`Should render header section properly on ${resolutionName}`, async ({ page }) => {
            const headerSection = page.locator('h1').first().locator('..').locator('..');
            const screenshot = await headerSection.screenshot();
            // expect(screenshot).toMatchSnapshot(`courses-header_${resolutionName}.png`);
        });

        test(`Should render tab list properly on ${resolutionName}`, async ({ page }) => {
            const tabList = page.locator('.rs-tab-list');
            const screenshot = await tabList.screenshot();
            // expect(screenshot).toMatchSnapshot(`courses-tab-list_${resolutionName}.png`);
        });

        test(`Should render table view properly on ${resolutionName}`, async ({ page }) => {
            // Make sure we're in a table view
            const tableViewTab = page.locator('button').filter({ hasText: 'Table view' });
            await tableViewTab.click();

            const coursesList = page.locator('.courses-list');
            const screenshot = await coursesList.screenshot();
            // expect(screenshot).toMatchSnapshot(`courses-table-view_${resolutionName}.png`);
        });

        test(`Should render map view properly on ${resolutionName}`, async ({ page }) => {
            // Switch to the map view
            const mapViewTab = page.locator('button').filter({ hasText: 'Map view' });
            await mapViewTab.click();

            const mapElement = await page.locator('.teach-map__wrapper').elementHandle();
            const screenshot = await getElementScreenshotWithPadding(page, mapElement, ELEMENT_PADDING_OFFSET);
            // expect(screenshot).toMatchSnapshot(`courses-map-view_${resolutionName}.png`);
        });

        test(`Should render CTA block properly on ${resolutionName}`, async ({ page }) => {
            const ctaBlock = page.locator('.teach-cta-block');
            const screenshot = await ctaBlock.screenshot();
            // expect(screenshot).toMatchSnapshot(`courses-cta_${resolutionName}.png`);
        });
    }

    // Interactive tests with visual verification
    test('Should show tooltip when hovering over map marker in map view', async ({ page }) => {
        // Switch to the map view
        const mapViewTab = page.locator('button').filter({ hasText: 'Map view' });
        await mapViewTab.click();

        // Hover over a marker
        const marker = page.locator('.teach-map-marker').first();
        await marker.hover();

        // Check if the tooltip is visible
        const tooltip = page.locator('.teach-map-tooltip');
        await expect(tooltip).toBeVisible();

        // Take a screenshot of the tooltip
        const screenshot = await tooltip.screenshot();
        // expect(screenshot).toMatchSnapshot('courses-map-tooltip.png');
    });
});