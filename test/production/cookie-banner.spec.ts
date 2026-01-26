import { expect, test as base } from '@playwright/test';
import { isProduction } from '../utils';

const test = base.extend({
    context: async function makeCleanContext({ browser }, use) {
        const context = await browser.newContext({
            storageState: undefined
        });
        await use(context);
        await context.close();
    }
});

test.skip(({ baseURL }) => !isProduction(baseURL), 'Cookie banner only on production');

test.describe('Cookie banner functionality', () => {
    test('Cookie banner should be visible and closeable', async ({ page, baseURL }) => {
        await page.goto(baseURL || '/');

        const acceptButton = page.getByRole('button', { name: 'Accept All' });
        await expect(acceptButton).toBeVisible({ timeout: 10000 });

        await acceptButton.click();
        await expect(acceptButton).toBeHidden({ timeout: 3000 });

        const cookies = await page.context().cookies();
        expect(cookies.length).toBeGreaterThan(0);
    });
});
