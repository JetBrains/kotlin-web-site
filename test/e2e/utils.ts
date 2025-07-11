import { BrowserContext, ElementHandle, Page } from '@playwright/test';
import { closeCookiesConsentBanner } from '../utils';

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

export async function closeExternalBanners(context: BrowserContext, page: Page, baseUrl: string) {
    if (baseUrl.startsWith('https://kotlinlang.org/')) {
        await closeCookiesConsentBanner(context, baseUrl);
    } else {
        const overlay = page.frameLocator('#webpack-dev-server-client-overlay');
        const dismissButton = overlay.locator('[aria-label="Dismiss"]');
        const isVisible = await dismissButton.isVisible().catch(() => false);
        if (isVisible) await dismissButton.click();
    }
}
