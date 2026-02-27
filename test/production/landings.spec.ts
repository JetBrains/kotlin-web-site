import { expect, test } from '@playwright/test';
import { skipNonProduction } from '../utils';

test.describe('/lp/ pages list', async () => {
    skipNonProduction('for host with reverse-proxy only');

    test(`Check /lp/multiplatform default redirects`, async ({ page, baseURL }) => {
        const targetUrl = `${baseURL}/multiplatform/`;

        await page.goto('/lp/multiplatform');
        expect(page.url()).toEqual(targetUrl);

        await page.goto('/lp/multiplatform/');
        expect(page.url()).toEqual(targetUrl);

        await page.goto('/lp/multiplatform/any');
        expect(page.url()).toEqual(targetUrl);
    });

    test(`Check /lp/multiplatform case-studies redirect`, async ({ page, baseURL }) => {
        const targetUrl = `${baseURL}/case-studies/?type=multiplatform`;

        await page.goto('/lp/multiplatform/case-studies/');
        expect(page.url()).toEqual(targetUrl);

        await page.goto('/lp/multiplatform/case-studies/philips');
        expect(page.url()).toEqual(targetUrl);
    });
});
