import { BrowserContext } from '@playwright/test';

export const testSelector = (name) => `[data-test="${name}"]`;

export function isStaging(baseURL: string): boolean {
    const { hostname } = new URL(baseURL);
    return hostname !== 'kotlinlang.org';
}

export const closeCookiesConsentBanner = async (context: BrowserContext, baseURL: string) => {
    await context.addCookies([
        {
            name: 'jb_cookies_consent_closed',
            value: 'true',
            url: baseURL,
        },
        {
            name: 'adConsent',
            value: 'false',
            url: baseURL,
        },
    ]);
};
