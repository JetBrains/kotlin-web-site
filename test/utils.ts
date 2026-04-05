import { expect, Locator, Page, test } from '@playwright/test';
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

type ClipType = number | PageAssertionsToHaveScreenshotOptions['clip'];

type CheckScreenshotOptions = Omit<PageAssertionsToHaveScreenshotOptions, 'clip'> & {
    clip?: ClipType;
};

export async function checkScreenshot(element: Locator | Page, options?: CheckScreenshotOptions) {
    if (isSkipScreenshot) return;

    await test.step('Check screenshot', async () => {
        const images = element.locator('img[loading=lazy]');

        if ((await images.count()) > 0) {
            await images.evaluateAll((imgs: HTMLImageElement[]) => {
                for (const img of imgs) {
                    img.loading = 'eager';
                    img.decoding = 'sync';
                }
            });
        }

        let clip: PageAssertionsToHaveScreenshotOptions['clip'] | undefined;

        if (typeof options?.clip === 'number') {
            clip = await getClippingRect(element, options?.clip);
            if ('page' in element) element = element.page();
        } else {
            clip = options?.clip;
        }

        await expect(element).toHaveScreenshot({
            caret: 'hide',
            animations: 'disabled',
            ...(options || {}),
            clip,
            stylePath: ['test/production/production.css'].concat(options?.stylePath || [])
        });
    });
}

async function getClippingRect(
    element: Locator | Page,
    padding: number
): Promise<PageAssertionsToHaveScreenshotOptions['clip'] | undefined> {
    if ('boundingBox' in element) {
        const box = await element.boundingBox();

        if (box !== null)
            return {
                x: box.x - padding,
                y: box.y - padding,
                width: box.width + padding * 2,
                height: box.height + padding * 2
            };
    }
}

export async function checkFullPageScreenshot(page: Page, options?: CheckScreenshotOptions) {
    if (isSkipScreenshot) return;

    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, 0));

    await checkScreenshot(page, {
        ...options,
        fullPage: true,
        mask: [page.locator('video[autoplay]'), ...(options?.mask || [])]
    });
}

export function isProduction(baseURL: string | undefined) {
    try {
        return Boolean(baseURL) && new URL(baseURL).hostname === 'kotlinlang.org';
    } catch (error) {
        return false;
    }
}

export function skipProduction(message?: string) {
    test.skip(({ baseURL }) => isProduction(baseURL), message || 'Skip tests on production environment');
}

export function skipNonProduction(message?: string) {
    test.skip(({ baseURL }) => !isProduction(baseURL), message || 'Skip tests on non-production environment');
}
