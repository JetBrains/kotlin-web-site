import { test, expect } from '@playwright/test';
import { closeCookiesConsentBanner, isStaging } from '../utils';

test.describe.configure({ mode: 'parallel' });

test.describe('/lp/ pages list', async () => {
    test.beforeEach(async ({ context, baseURL }) => {
        await closeCookiesConsentBanner(context, baseURL);
    });

    test(`Check /lp/multiplatform default redirects`, async ({ page, baseURL }) => {
        test.skip(isStaging(baseURL), 'for host with reverse-proxy only');

        const targetUrl = 'https://www.jetbrains.com/kotlin-multiplatform/';

        await page.goto('/lp/multiplatform');
        expect(page.url()).toEqual(targetUrl);

        await page.goto('/lp/multiplatform/');
        expect(page.url()).toEqual(targetUrl);

        await page.goto('/lp/multiplatform/any');
        expect(page.url()).toEqual(targetUrl);
    });

    test(`Check /lp/multiplatform case-studies redirect`, async ({ page, baseURL }) => {
        test.skip(isStaging(baseURL), 'for host with reverse-proxy only');
        const targetUrl = 'https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html';

        await page.goto('/lp/multiplatform/case-studies/');
        expect(page.url()).toEqual(targetUrl);

        await page.goto('/lp/multiplatform/case-studies/philips');
        expect(page.url()).toEqual(targetUrl);
    });
});
