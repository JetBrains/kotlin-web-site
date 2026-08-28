import { test, expect } from '@playwright/test';
import { testSelector } from '../utils';

const REMOVED_EVENTS_URLS = [
    '/community/events/',
    '/community/events.html',
    '/community/talks.html',
    '/docs/events.html',
];

test.describe('Community events page redirects', () => {
    for (const url of REMOVED_EVENTS_URLS) {
        test(`${url} redirects to the community overview`, async ({ page, baseURL }) => {
            const overviewUrl = `${baseURL}/community/`;

            await page.goto(url);
            await page.waitForURL(overviewUrl);

            expect(page.url()).toEqual(overviewUrl);
            await expect(page.locator(testSelector('community-banner'))).toBeVisible();
        });
    }
});
