import { expect, test } from '@playwright/test';
import { testSelector } from '../utils';
import { WebHelpPage } from '../page/webhelp-page';
import { ELEMENT_PADDING_OFFSET, MICRO_ANIMATION_TIMEOUT, RESOLUTIONS } from './visual-constants';
import { getElementScreenshotWithPadding } from './utils';

test.describe.only('WebHelp page', async () => {
    test.beforeEach(async ({ page }) => {
        const webHelpPage = new WebHelpPage(page, '/docs/test-page.html');
        await webHelpPage.init();
    });

    for (const resolution of RESOLUTIONS) {
        test(`Should render layout of the article properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const screenshot = await page.screenshot({ fullPage: true });
            expect(screenshot).toMatchSnapshot(`layout_${resolution.name}.png`);
        });


        test(`Should render micro format properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const screenshot = await page.locator(testSelector('micro-format-content')).screenshot();
            expect(screenshot).toMatchSnapshot(`micro-format_${resolution.name}.png`);
        });

        test(`Should render tabs properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const elements = await page.$$(testSelector('tab-list-wrapper'));
            for (let i = 0; i < elements.length; i++) {
                const screenshot = await elements[i].screenshot();
                expect(screenshot).toMatchSnapshot(`tab-list-wrapper-${i}_${resolution.name}.png`);
            }
        });

        test(`Should switch tabs synchronously on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const tabsAnchors = await page.$$(testSelector('tab'));
            await tabsAnchors[1].click();
            await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT);
            const elements = await page.$$(testSelector('tab-list-wrapper'));
            for (let i = 0; i < elements.length; i++) {
                const screenshot = await elements[i].screenshot();
                expect(screenshot).toMatchSnapshot(`tab-list-wrapper-${i}_switched_${resolution.name}.png`);
            }
        });

        test(`Should render collapse section properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const elements = await page.$$(testSelector('collapse-element'));
            const screenshot = await getElementScreenshotWithPadding(page, elements[0], ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot(`collapse-element_${resolution.name}.png`);

        });

        test(`Should render collapse section when expanded properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const elements = await page.$$(testSelector('collapse-element'));
            await elements[0].click();
            await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT);
            const screenshot = await getElementScreenshotWithPadding(page, elements[0], ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot(`collapse-element_expanded_${resolution.name}.png`);
        });

        test(`Should render footer properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const screenshot = await page.locator(testSelector('footer')).screenshot();
            expect(screenshot).toMatchSnapshot(`footer_${resolution.name}.png`);
        });

        test(`Should render just a codeblock properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const codeBlock = page.locator(testSelector('code-block')).filter({hasText: 'MessageService' }).first();
            const screenshot = await codeBlock.screenshot();
            expect(screenshot).toMatchSnapshot(`code-block_${resolution.name}.png`);
        });

        test(`Should render hovered codeblock properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const codeBlock = page.locator(testSelector('code-block')).filter({hasText: 'MessageService' }).first();
            await codeBlock.hover();
            const screenshot = await codeBlock.screenshot();
            expect(screenshot).toMatchSnapshot(`code-block_hovered_${resolution.name}.png`);
        });
    }
});
