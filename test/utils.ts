import { expect, Locator, Page } from '@playwright/test';
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

export async function checkScreenshot(element: Locator, options?: PageAssertionsToHaveScreenshotOptions) {
    if (isSkipScreenshot) return;

    await expect(element).toHaveScreenshot({
        caret: 'hide',
        animations: 'disabled',
        ...(options || {})
    });
}

export function isProduction(baseURL: string | undefined) {
    try {
        return Boolean(baseURL) && new URL(baseURL).hostname === 'kotlinlang.org';
    } catch (error) {
        return false;
    }
}
