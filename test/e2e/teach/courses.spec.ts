import { expect, test } from '@playwright/test';
import { CoursesPage } from '../../page/teach/courses-page';
import { closeExternalBanners } from '../utils';
import { testSelector } from '../../utils';
import { checkTeachCta, checkTeachMap, checkTeachNav } from './utils';

test.describe('Courses page appearance and functionality', async () => {
    test.beforeEach(async ({ page, context, baseURL }) => {
        const coursesPage = new CoursesPage(page);
        await coursesPage.init();
        await closeExternalBanners(context, page, baseURL);
    });

    test('Should load the courses page correctly', async ({ page }) => {
        // Check if the page title is correct
        expect(await page.title()).toBe('List of Courses');

        // Check if the main content is visible
        const mainContent = page.locator(testSelector('teach-courses'));
        await expect(mainContent).toBeVisible();

        // Check if the page heading is correct
        const title = mainContent.locator('h1');
        await expect(title).toBeVisible();

        expect(await title.textContent()).toBe('Universities That Teach Kotlin');
    });

    test('Should have working navigation buttons', async ({ page }) => {
        await checkTeachNav(page, 'List of Courses');
    });

    test('Should have working tab navigation', async ({ page }) => {
        // Check if the tab list is visible
        const tabList = page.locator(testSelector('tab-list'));
        await expect(tabList).toBeVisible();

        // Check if both tabs are present
        const tableViewTab = tabList.getByRole('tab', { name: 'Table view', exact: true });
        await expect(tableViewTab).toBeVisible();

        const mapViewTab = tabList.getByRole('tab', { name: 'Map view', exact: true });
        await expect(mapViewTab).toBeVisible();

        await expect(tableViewTab).toHaveAttribute('data-test', 'tab tab-selected');
        await expect(mapViewTab).toHaveAttribute('data-test', 'tab');

        // CoursesList should be visible in the table view
        await expect(page.locator('.ktl-courses-list')).toBeVisible();

        // Switch to the map view
        await mapViewTab.click();

        // Map view should now be active
        await expect(tableViewTab).toHaveAttribute('data-test', 'tab');
        await expect(mapViewTab).toHaveAttribute('data-test', 'tab tab-selected');

        // TeachMap should be visible in the map view
        await expect(page.locator('.teach-map .gm-style')).toBeVisible();

        // Switch back to the table view
        await tableViewTab.click();

        // Table view should be active again
        await expect(tableViewTab).toHaveAttribute('data-test', 'tab tab-selected');
        await expect(mapViewTab).toHaveAttribute('data-test', 'tab');

        // CoursesList should be visible again
        await expect(page.locator('.ktl-courses-list')).toBeVisible();
    });

    test('Should display university list in table view', async ({ page }) => {
        // Make sure we're in a table view
        const tableViewTab = page.getByRole('tab', { name: 'Table view' });
        await tableViewTab.click();

        // Check if the course list is visible
        const coursesList = page.locator('.ktl-courses-list');
        await expect(coursesList).toBeVisible();

        // Check and verify the headers of the course list
        const headers = coursesList.locator('.ktl-courses-list-header .ktl-courses-list-cell');
        expect(await headers.count()).toBe(3);
        expect(await headers.nth(0).textContent()).toBe('University title');
        expect(await headers.nth(1).textContent()).toBe('Location');
        expect(await headers.nth(2).textContent()).toBe('Teaching Kotlin');

        // Check if there are universities in the list
        const universities = coursesList.locator('.ktl-courses-list__item');
        expect(await universities.count()).toBeGreaterThan(0);
        expect(await universities.first().locator('.ktl-courses-list-cell').count())
            .toBe(3);
    });

    test('Should display map with markers in map view', async ({ page }) => {
        // Switch to the map view
        const mapViewTab = page.getByRole('tab', { name: 'Map view' });
        await mapViewTab.click();

        // Check if the map is visible
        const map = page.locator('.teach-map');
        await checkTeachMap(page, map);
    });

    test('Should have action buttons for educators', checkTeachCta);
});