import { ElementHandle, Page, test } from '@playwright/test';
import { checkScreenshot, isSkipScreenshot } from '../utils';
import { PageAssertionsToHaveScreenshotOptions } from 'playwright/types/test';

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

export function pageWrapperMask(page: Page) {
    return [
        page.locator('header[data-test="header"]'),
        page.locator('footer'),
        page.locator('video[autoplay]')
    ];
}

export async function checkFullPageScreenshot(page: Page, options?: PageAssertionsToHaveScreenshotOptions) {
    test.skip(isSkipScreenshot, 'Skipping screenshot testing');

    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, 0));

    await checkScreenshot(page, {
        ...options,
        fullPage: true,
        mask: [
            ...pageWrapperMask(page),
            ...(options.mask || [])
        ]
    });
}
