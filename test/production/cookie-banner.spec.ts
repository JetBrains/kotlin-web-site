import { expect, test as base } from '@playwright/test';
import { skipNonProduction } from '../utils';

skipNonProduction('Cookie banner only on production');

const test = base.extend({
    page: async ({ browser }, use) => {
        const context = await browser.newContext({
            storageState: undefined
        });
        const page = await context.newPage();

        await use(page);

        await page.close();
        await context.close();
    }
});

test.describe('Cookie banner functionality', () => {
    const PAGE_TYPES_EXAMPLE = [
        '/',
        '/docs/getting-started.html',
        '/docs/multiplatform/get-started.html',
        '/api/core/kotlin-stdlib/',
        '/api/kotlinx.coroutines/kotlinx-coroutines-core/',
        '/lp/multiplatform/case-studies/autodesk/'
    ];

    for (const path of PAGE_TYPES_EXAMPLE) {
        test(`Cookie banner should be visible and closeable: ${path}`, async ({ page, baseURL }) => {
            await page.goto(`${baseURL}${path}`);

            const acceptButton = page.getByRole('button', { name: 'Accept All' });
            await expect(acceptButton).toBeVisible({ timeout: 10000 });

            await acceptButton.click();
            await expect(acceptButton).toBeHidden({ timeout: 3000 });

            const cookies = await page.context().cookies();
            expect(cookies.length).toBeGreaterThan(0);
        });
    }
});
