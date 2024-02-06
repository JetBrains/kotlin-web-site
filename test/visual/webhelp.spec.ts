import { expect, test } from '@playwright/test';
import { testSelector } from '../utils';
import { WebHelpPage } from '../page/webhelp-page';

test.describe('WebHelp page', async () => {
    test(`Should render components properly on the /doc/test-page.html`, async ({ page }) => {
        const webHelpPage = new WebHelpPage(page, '/docs/test-page.html');
        await webHelpPage.init();

        expect(await page.locator(testSelector('micro-format-content')).screenshot()).toMatchSnapshot(
            `webhelp-test-micro-format-content.png`
        );
    });
});
