import { ElementHandle, expect, Locator, Page, test } from '@playwright/test';
import { PageAssertionsToHaveScreenshotOptions } from 'playwright/types/test';

export const testSelector = (name: string) => `[data-test="${name}"]`;

const TRANSITION_TIMEOUT = 2000;

export async function checkAnchor(page: Page, anchor: Locator) {
    const href = await anchor.getAttribute('href');
    await anchor.click();
    await page.waitForTimeout(TRANSITION_TIMEOUT);
    await expect(page).toHaveURL(new RegExp(`.*${href}$`));

    const targetId = href.split('#').pop() || '';
    const targetElement = page.locator(`#${targetId}`);
    await expect(targetElement).toBeInViewport();
}

export const isSkipScreenshot = process.env.E2E_WITH_SCREENSHOTS !== 'true';

export async function checkScreenshot(element: Locator | Page, options?: PageAssertionsToHaveScreenshotOptions) {
    test.skip(isSkipScreenshot, 'Skip screenshots check');

    const images = element.locator('img[loading=lazy]');

    if (await images.count() > 0) {
        await images.evaluate((img: HTMLImageElement) => {
            img.loading = 'eager';
            img.decoding = 'sync';
        });
    }

    await expect(element).toHaveScreenshot({
        caret: 'hide',
        animations: 'disabled',
        ...(options || {}),
        stylePath: ['test/snapshots/assets/production.css'].concat(options?.stylePath || [])
    });
}


export async function checkFullPageScreenshot(page: Page, options?: PageAssertionsToHaveScreenshotOptions) {
    test.skip(isSkipScreenshot, 'Skip screenshots check');

    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, 0));

    await checkScreenshot(page, {
        ...options,
        fullPage: true,
        mask: [
            page.locator('header[data-test="header"]'),
            page.locator('footer'),
            page.locator('video[autoplay]'),

            ...(options.mask || [])
        ]
    });
}

export async function getElementScreenshotWithPadding(page: Page, element: ElementHandle, padding: number): Promise<Buffer | undefined> {
    await element.scrollIntoViewIfNeeded();
    const box = await element.boundingBox();

    if (box !== null) {
        return await page.screenshot({
            clip: {
                x: box.x - padding,
                y: box.y - padding,
                width: box.width + padding * 2,
                height: box.height + padding * 2
            }
        });
    }
}

export function isProduction(baseURL: string | undefined) {
    try {
        return Boolean(baseURL) && new URL(baseURL).hostname === 'kotlinlang.org';
    } catch (error) {
        return false;
    }
}

export function skipProduction(text?: string) {
    test.skip(({ baseURL }) => isProduction(baseURL), text || 'Skip tests on production environment');
}

export function skipNonProduction(text?: string) {
    test.skip(({ baseURL }) => !isProduction(baseURL), text || 'Skip tests on non-production environment');
}
