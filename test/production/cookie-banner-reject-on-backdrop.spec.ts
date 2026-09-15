import { expect, test as base } from '@playwright/test';
import { skipNonProduction } from '../utils';

// The CookieHub banner and the "reject all on background click" behaviour are
// provided in production via Google Tag Manager, so these tests are skipped
// everywhere else.
skipNonProduction('CookieHub cookie banner is only present on production');

const test = base.extend({
    page: async ({ browser }, use) => {
        // Fresh context with no stored consent so the banner is shown.
        const context = await browser.newContext({ storageState: undefined });
        const page = await context.newPage();

        await use(page);

        await page.close();
        await context.close();
    }
});

test.describe('Cookie banner: clicking the background rejects all', () => {
    test('clicking the background dismisses the banner and keeps it gone', async ({ page, baseURL }) => {
        await page.goto(`${baseURL}/`);

        const acceptButton = page.getByRole('button', { name: 'Accept All' });
        await expect(acceptButton).toBeVisible({ timeout: 10000 });

        // The dimmed background is the .ch2-container element. Click its
        // top-left corner, away from the dialog box, so the click lands on the
        // background and not on a button.
        await page.locator('.ch2-container').click({ position: { x: 10, y: 10 } });
        await expect(acceptButton).toBeHidden({ timeout: 5000 });

        // It was a reject-all (not an accept-all): a non-essential category
        // must not be consented.
        const analyticsConsented = await page.evaluate(
            () =>
                (window as unknown as { cookiehub: { hasConsented(category: string): boolean } }).cookiehub.hasConsented(
                    'analytics'
                )
        );
        expect(analyticsConsented).toBe(false);

        // The choice is persisted: the banner does not reappear on the next page.
        await page.goto(`${baseURL}/docs/getting-started.html`);
        await expect(page.getByRole('button', { name: 'Accept All' })).toBeHidden({ timeout: 5000 });
    });

    test('clicking inside the dialog does not dismiss the banner', async ({ page, baseURL }) => {
        await page.goto(`${baseURL}/`);

        const acceptButton = page.getByRole('button', { name: 'Accept All' });
        await expect(acceptButton).toBeVisible({ timeout: 10000 });

        // A click on the dialog content (not the background) must be ignored.
        await page.locator('#ch2-dialog-title').click();
        await expect(acceptButton).toBeVisible();
    });
});
