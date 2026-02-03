import { test, expect } from '@playwright/test';
import { isStaging } from '../utils';

test.describe('/lp/ pages list', async () => {
    test(`Check /lp/multiplatform default redirects`, async ({ page, baseURL }) => {
        test.skip(isStaging(baseURL), 'for host with reverse-proxy only');

        const targetUrl = 'https://kotlinlang.org/multiplatform/';

        await page.goto('/lp/multiplatform');
        expect(page.url()).toEqual(targetUrl);

        await page.goto('/lp/multiplatform/');
        expect(page.url()).toEqual(targetUrl);

        await page.goto('/lp/multiplatform/any');
        expect(page.url()).toEqual(targetUrl);
    });

    test(`Check /lp/multiplatform case-studies redirect`, async ({ page, baseURL }) => {
        test.skip(isStaging(baseURL), 'for host with reverse-proxy only');
        const targetUrl = 'https://kotlinlang.org/case-studies/?type=multiplatform';

        await page.goto('/lp/multiplatform/case-studies/');
        expect(page.url()).toEqual(targetUrl);

        await page.goto('/lp/multiplatform/case-studies/philips');
        expect(page.url()).toEqual(targetUrl);
    });
});
