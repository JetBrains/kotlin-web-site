import { BrowserContext } from '@playwright/test';

export const testSelector = (name) => `[data-test="${name}"]`;

export function isStaging(baseURL: string): boolean {
    const { hostname } = new URL(baseURL);
    return hostname !== 'kotlinlang.org';
}

export const closeCookiesConsentBanner = async (context: BrowserContext, baseURL: string) => {
    const page = await context.newPage();
    await page.goto(baseURL);
    await page.waitForSelector('button.ch2-btn.ch2-btn-primary');
    await page.click('button.ch2-btn.ch2-btn-primary');
    await page.close();
};
