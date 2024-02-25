import { expect, test } from '@playwright/test';
import { testSelector } from '../utils';
import { WebHelpPage } from '../page/webhelp-page';

const MICRO_ANIMATION_TIMEOUT = 350;

test.describe('WebHelp page', async () => {
    test(`Should render layout of the article properly on /doc/test-page.html`, async ({ page }) => {
        const webHelpPage = new WebHelpPage(page, '/docs/test-page.html');
        await webHelpPage.init();

        const screenshot = await page.screenshot({ fullPage: true });
        expect(screenshot).toMatchSnapshot(`layout.png`);
    });

    test(`Should render micro format properly on the /doc/test-page.html`, async ({ page }) => {
        const webHelpPage = new WebHelpPage(page, '/docs/test-page.html');
        await webHelpPage.init();

        expect(await page.locator(testSelector('micro-format-content')).screenshot()).toMatchSnapshot(
            `micro-format.png`
        );
    });

    test(`Should render tabs properly on the /doc/test-page.html`, async ({ page }) => {
        const webHelpPage = new WebHelpPage(page, '/docs/test-page.html');
        await webHelpPage.init();

        const elements = await page.$$(testSelector('tab-list-wrapper'));

        for (let i = 0; i < elements.length; i++) {
            expect(await elements[i].screenshot()).toMatchSnapshot(`tab-list-wrapper-${i}.png`);
        }
    });

    test(`Should switch tabs synchronously on the /doc/test-page.html`, async ({ page }) => {
        const webHelpPage = new WebHelpPage(page, '/docs/test-page.html');
        await webHelpPage.init();

        const tabsAnchors = await page.$$(testSelector('tab'));
        await tabsAnchors[1].click();

        await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT);

        const elements = await page.$$(testSelector('tab-list-wrapper'));

        for (let i = 0; i < elements.length; i++) {
            expect(await elements[i].screenshot()).toMatchSnapshot(`tab-list-wrapper-${i}_switched.png`);
        }
    });

    test(`Should render collapse section properly on the /doc/test-page.html`, async ({ page }) => {
        const ELEMENT_PADDING_OFFSET = 30;
        const webHelpPage = new WebHelpPage(page, '/docs/test-page.html');
        await webHelpPage.init();

        const elements = await page.$$(testSelector('collapse-element'));

        if (elements.length !== 0) {
            await elements[0].scrollIntoViewIfNeeded();
            const box = await elements[0].boundingBox();

            if (box !== null) {
                const screenshot = await page.screenshot({
                    clip: {
                        x: box.x - ELEMENT_PADDING_OFFSET,
                        y: box.y - ELEMENT_PADDING_OFFSET,
                        width: box.width + ELEMENT_PADDING_OFFSET * 2,
                        height: box.height + ELEMENT_PADDING_OFFSET * 2
                    }
                });
                expect(screenshot).toMatchSnapshot(`collapse-element.png`);
            }
        }
    });

    test(`Should render expanded collapse section properly on the /doc/test-page.html`, async ({ page }) => {
        const webHelpPage = new WebHelpPage(page, '/docs/test-page.html');
        await webHelpPage.init();

        const elements = await page.$$(testSelector('collapse-element'));

        await elements[0].click();
        await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT);

        expect(await elements[0].screenshot()).toMatchSnapshot(`collapse-element_expanded.png`);
    });

    test(`Should render footer properly on the /doc/test-page.html`, async ({ page }) => {
        const webHelpPage = new WebHelpPage(page, '/docs/test-page.html');
        await webHelpPage.init();

        expect(await page.locator(testSelector('footer')).screenshot()).toMatchSnapshot(`footer.png`);
    });
});
