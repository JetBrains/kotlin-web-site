import { expect, test } from '@playwright/test';
import { testSelector } from '../utils';
import { WebHelpPage } from '../page/webhelp-page';
import {
    ELEMENT_PADDING_OFFSET,
    MICRO_ANIMATION_TIMEOUT,
    MICRO_ANIMATION_TIMEOUT_LONG,
    RESOLUTIONS
} from './visual-constants';
import { getElementScreenshotWithPadding } from './utils';

test.describe('WebHelp page appearance', async () => {
    // test.beforeEach(async ({ page }) => {
    //     const webHelpPage = new WebHelpPage(page, '/docs/books.html');
    //     await webHelpPage.init();
    // });

    test(`Should execute test`, async ({ page }) => {
        expect(1).toBe(1);
    });

    test(`Should render old page`, async ({ page }) => {
        await page.goto('/docs/books.html');
        expect(await page.title()).toBe('Kotlin books | Kotlin Documentation');
    });

    test(`Should render table of contents properly on desktop`, async ({ page }) => {
        await page.goto('/docs/test-page.html');
        await page.setViewportSize(RESOLUTIONS[0]);
        const element = page.locator('nav').locator('ul.toc').first();
        const screenshot = await element.screenshot();
        expect(screenshot).toMatchSnapshot('table-of-contents_desktop.png');
    });
});
