import { BrowserContext, expect, Locator, Page } from '@playwright/test';

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

const TRANSITION_TIMEOUT = 2000;

export async function checkAnchor(anchor: Locator, page: Page) {
    const href = await anchor.getAttribute('href');
    await anchor.click();
    await page.waitForTimeout(TRANSITION_TIMEOUT);
    await expect(page).toHaveURL(new RegExp(`.*${href}$`));

    const targetId = href.split('#').pop() || '';
    const targetElement = page.locator(`#${targetId}`);
    await expect(targetElement).toBeInViewport();
}