import { expect, test } from '@playwright/test';
import { parse } from 'path';
import { checkScreenshot, testSelector } from '../../utils';
import { RESOLUTIONS } from '../visual-constants';
import { WebHelpPage } from './page';

const DOCS_URLS = [`/docs/home.html`, '/docs/multiplatform/get-started.html'];

for (let index = 0, docsLength = DOCS_URLS.length; index < docsLength; index++) {
    const docsUrl = DOCS_URLS[index];

    for (const [resolutionName, resolution] of Object.entries(RESOLUTIONS)) {
        test.describe(`Docs: ${parse(docsUrl).dir}/ on ${resolutionName}`, () => {
            test.beforeEach(async ({ page }) => {
                await page.setViewportSize(resolution);

                const webHelpPage = new WebHelpPage(page, docsUrl);
                await webHelpPage.init();
            });

            test(`Should render table of contents properly`, async ({ page }) => {
                test.skip(resolutionName !== 'desktop');

                const element = page.locator(testSelector('toc'));

                await expect(element).toHaveCount(1);
                await expect(element).toBeVisible();

                await checkScreenshot(element);
            });

            test(`Should open page item properly`, async ({ page }) => {
                test.skip(resolutionName !== 'desktop');

                const element = page.locator(testSelector('toc')).first();

                const tocItem = element.locator(testSelector('internal-link toc-item')).first();
                const link = new URL(await tocItem.getAttribute('href'), page.url());

                await tocItem.click();
                expect(page.url()).toBe(link.href);
            });

            test(`Should render table of contents with expanded item properly`, async ({ page }) => {
                test.skip(resolutionName !== 'desktop');

                const toc = page.locator(testSelector('toc'));

                await expect(toc).toHaveCount(1);
                await expect(toc).toBeVisible();

                const item = toc.locator(`:scope > li:has(${testSelector('toc-item')})`).first();
                await expect(item).toBeVisible();

                const itemExpander = item.locator(testSelector('toc-expander')).first();
                await expect(item).toBeVisible();

                const itemNext = item.locator(`:scope + li`).first();
                const itemNextText = await itemNext.textContent();

                await itemExpander.click();

                expect(await itemNext.textContent()).not.toBe(itemNextText);

                await checkScreenshot(item);
            });

            test(`Should render header properly`, async ({ page }) => {
                const element = page.locator('.kt-header');
                await expect(element).toBeVisible();
                await checkScreenshot(element, { mask: [page.locator('.kt-header__product-version')] });
            });

            test(`Should render footer properly`, async ({ page }) => {
                const element = page.locator(testSelector('footer'));
                await expect(element).toBeVisible();
                await checkScreenshot(element);
            });

            test(`Should render docs switcher properly`, async ({ page }) => {
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

            test(`Should open quick search and show results`, async ({ page }) => {
                await page.locator(testSelector('search-button')).click();
                await expect(page.locator(testSelector('search-quick'))).toBeVisible();

                const input = page.locator(testSelector('input__inner'));
                await expect(input).toBeVisible();
                await input.fill('grammar');

                const results = page.locator(testSelector('search-results'));
                await expect(results).toBeVisible();

                const items = page.locator(testSelector('list-item'));
                expect(await items.count()).toBeGreaterThan(1);

                await checkScreenshot(page.locator(testSelector('search-quick')), {
                    mask: [page.locator(testSelector('result-content')), page.locator(testSelector('search-results'))],
                });
            });

            test(`Should close quick search on Escape`, async ({ page }) => {
                await page.locator(testSelector('search-button')).click();
                await expect(page.locator(testSelector('search-quick'))).toBeVisible();

                await page.keyboard.press('Escape');
                await expect(page.locator(testSelector('search-quick'))).not.toBeVisible();
            });

            test(`Should open full search from quick search`, async ({ page }) => {
                await page.locator(testSelector('search-button')).click();
                await expect(page.locator(testSelector('search-quick'))).toBeVisible();

                const input = page.locator(testSelector('input__inner'));
                await input.fill('grammar');
                await expect(page.locator(testSelector('search-results'))).toBeVisible();

                const fullSearchButton = page.locator(testSelector('full-search-button'));

                if (resolutionName === 'mobile') {
                    await expect(fullSearchButton).not.toBeVisible();
                    return;
                }

                await fullSearchButton.click();
                await expect(page.locator(testSelector('search-full'))).toBeVisible();

                await expect(page).toHaveURL(/\?q=grammar&s=full/);

                const fullResults = page.locator(testSelector('search-full')).locator(testSelector('search-results'));
                await expect(fullResults).toBeVisible();

                await checkScreenshot(page.locator(testSelector('search-full')), {
                    mask: [page.locator(testSelector('result-content')), page.locator(testSelector('search-results'))],
                });
            });

            test(`Should close full search`, async ({ page }) => {
                await page.locator(testSelector('search-button')).click();
                await expect(page.locator(testSelector('search-quick'))).toBeVisible();

                const input = page.locator(testSelector('input__inner'));
                await input.fill('grammar');
                await expect(page.locator(testSelector('search-results'))).toBeVisible();

                const fullSearchButton = page.locator(testSelector('full-search-button'));

                if (resolutionName === 'mobile') {
                    await expect(fullSearchButton).not.toBeVisible();
                    return;
                }

                await fullSearchButton.click();
                await expect(page.locator(testSelector('search-full'))).toBeVisible();

                await page.locator(testSelector('close-search')).click();
                await expect(page.locator(testSelector('search-full'))).not.toBeVisible();
            });
        });
    }
}
