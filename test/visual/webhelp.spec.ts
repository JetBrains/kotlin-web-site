import { expect, test } from '@playwright/test';
import { testSelector } from '../utils';
import { WebHelpPage } from '../page/webhelp-page';

test.describe('WebHelp page', async () => {
    test(`Should render full article properly on /doc/test-page.html`, async ({ page }) => {
        const webHelpPage = new WebHelpPage(page, '/docs/test-page.html');
        await webHelpPage.init();

        const screenshot = await page.screenshot({ fullPage: true });
        expect(screenshot).toMatchSnapshot(`webhelp-test-full-page.png`);
    });

    test(`Should render micro format properly on the /doc/test-page.html`, async ({ page }) => {
        const webHelpPage = new WebHelpPage(page, '/docs/test-page.html');
        await webHelpPage.init();

        expect(await page.locator(testSelector('micro-format-content')).screenshot()).toMatchSnapshot(
            `webhelp-test-micro-format-content.png`
        );
    });
});
