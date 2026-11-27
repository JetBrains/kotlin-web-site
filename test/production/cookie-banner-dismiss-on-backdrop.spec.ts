import { expect, test as base } from '@playwright/test';
import { createCookieBannerContext, skipNonProduction } from '../utils';

// The CookieHub banner and the "dismiss on background click" behaviour are
// provided in production via Google Tag Manager, so these tests are skipped
// everywhere else.
skipNonProduction('CookieHub cookie banner is only present on production');

const test = base.extend({
    page: async ({ browser }, use) => {
        // Fresh context with no stored consent so the banner is shown.
        const context = await createCookieBannerContext(browser);
        const page = await context.newPage();

        await use(page);

        await page.close();
        await context.close();
    }
});

test.describe('Cookie banner: clicking the background only dismisses the banner', () => {
    test('clicking the background dismisses the banner, which reappears on the next page', async ({ page }) => {
        await page.goto('/');

        const acceptButton = page.getByRole('button', { name: 'Accept All' });
        await expect(acceptButton).toBeVisible({ timeout: 10000 });

        // The dimmed background is the .ch2-container element. Click its
        // top-left corner, away from the dialog box, so the click lands on the
        // background and not on a button.
        const box = await page.locator('#ch2-dialog').boundingBox();
        await page.mouse.click(box.x - 10, box.y - 10);

        await expect(acceptButton).toBeHidden({ timeout: 5000 });

        await page.goto('/docs/getting-started.html');
        await expect(page.getByRole('button', { name: 'Accept All' })).toBeVisible({ timeout: 10000 });
    });

    test('clicking inside the dialog does not dismiss the banner', async ({ page }) => {
        await page.goto('/');

        const acceptButton = page.getByRole('button', { name: 'Accept All' });
        await expect(acceptButton).toBeVisible({ timeout: 10000 });

        // A click on the dialog content (not the background) must be ignored.
        await page.locator('#ch2-dialog-title').click();
        await expect(acceptButton).toBeVisible();
    });
});
