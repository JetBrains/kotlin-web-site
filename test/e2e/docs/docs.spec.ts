import { expect, test } from '@playwright/test';
import { parse } from 'path';
import { checkScreenshot, testSelector } from '../../utils';
import { RESOLUTIONS } from '../visual-constants';
import { WebHelpPage } from './page';

const DOCS_URLS = [`/docs/home.html`, '/docs/multiplatform/get-started.html'];

for (let index = 0, docsLength = DOCS_URLS.length; index < docsLength; index++) {
    const docsUrl = DOCS_URLS[index];

    test.describe(`Docs: ${parse(docsUrl).dir}/`, () => {
        test.beforeEach(async ({ page }) => {
            const webHelpPage = new WebHelpPage(page, docsUrl);
            await webHelpPage.init();
        });

        for (const [resolutionName, resolution] of Object.entries(RESOLUTIONS)) {
            test(`Should render header properly on ${resolutionName}`, async ({ page }) => {
                await page.setViewportSize(resolution);
                const element = page.locator('.kt-header');
                await expect(element).toBeVisible();
                await checkScreenshot(element, { mask: [page.locator('.kt-header__product-version')] });
            });

            test(`Should render footer properly on ${resolutionName}`, async ({ page }) => {
                await page.setViewportSize(resolution);
                const element = page.locator(testSelector('footer'));
                await expect(element).toBeVisible();
                await checkScreenshot(element);
            });

            test(`Should render docs switcher properly on ${resolutionName}`, async ({ page }) => {
                await page.setViewportSize(resolution);

                const switcher = page.locator('[data-e2e="toc-subnav"]');

                if (resolutionName !== 'desktop') {
                    await expect(switcher).not.toBeVisible();
                    return;
                }

                await expect(switcher).toHaveCount(1);
                await expect(switcher).toBeVisible();

                const items = switcher.locator('[data-rs-internal=switcher__option]');
                await expect(items).toHaveCount(2);

                await expect(items.nth(index).locator(':scope[class*=_selected_]')).toBeVisible();

                const inactiveItemIndex = (index + 1) % docsLength;

                const inactiveItem = items.nth(inactiveItemIndex);
                await expect(inactiveItem.locator(':scope[class*=_selected_]')).not.toBeVisible();

                await checkScreenshot(switcher);

                await inactiveItem.click();
                await expect(page).toHaveURL(DOCS_URLS[inactiveItemIndex]);
            });
        }
    });
}