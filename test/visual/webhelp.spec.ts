import { expect, test } from '@playwright/test';
import { testSelector } from '../utils';
import { WebHelpPage } from '../page/webhelp-page';
import {
    ELEMENT_PADDING_OFFSET,
    MICRO_ANIMATION_TIMEOUT,
    MICRO_ANIMATION_TIMEOUT_LONG,
    RESOLUTIONS
} from './visual-constants';
import { getElementScreenshotWithPadding } from './utils';

test.describe('WebHelp page appearance', async () => {
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
            const codeBlock = page.locator(testSelector('code-block')).filter({ hasText: 'MessageService' }).first();
            const screenshot = await codeBlock.screenshot();
            expect(screenshot).toMatchSnapshot(`code-block_${resolution.name}.png`);
        });

        test(`Should render hovered codeblock properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const codeBlock = page.locator(testSelector('code-block')).filter({ hasText: 'MessageService' }).first();
            await codeBlock.hover();
            const screenshot = await codeBlock.screenshot();
            expect(screenshot).toMatchSnapshot(`code-block_hovered_${resolution.name}.png`);
        });

        test(`Should render expandable codeblock properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const codeBlock = page.locator(testSelector('code-collapse')).filter({ hasText: 'package' }).first();
            const codeBlockElement = await codeBlock.elementHandle();
            const screenshot = await getElementScreenshotWithPadding(page, codeBlockElement, ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot(`code-block_expandable_${resolution.name}.png`);
        });

        test(`Should render expandable codeblock when expanded properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const codeBlock = page.locator(testSelector('code-collapse')).filter({ hasText: 'package' }).first();
            await codeBlock.locator(testSelector('synopsis-ending')).click();
            await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT_LONG);
            const codeBlockElement = await codeBlock.elementHandle();
            const screenshot = await getElementScreenshotWithPadding(page, codeBlockElement, ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot(`code-block_expandable_expanded_${resolution.name}.png`);
        });

        test(`Should render collapsed codeblock properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const codeBlock = page.locator(testSelector('code-collapse')).filter({ hasText: 'package' }).first();
            await codeBlock.locator(testSelector('synopsis-ending')).click();
            await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT_LONG);
            const closeIcon = codeBlock.locator(testSelector('collapse-button')).first();
            await closeIcon.click();
            await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT_LONG);
            const codeBlockElement = await codeBlock.elementHandle();
            const screenshot = await getElementScreenshotWithPadding(page, codeBlockElement, ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot(`code-block_expandable_${resolution.name}.png`);
        });

        test(`Should render playground properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = await page.$('.kotlin-playground__wrapper');
            await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT_LONG);
            const screenshot = await getElementScreenshotWithPadding(page, element, ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot(`playground_${resolution.name}.png`);
        });

        test(`Should render expanded playground properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = await page.$('.kotlin-playground__wrapper');
            await page.locator('.fold-button').click();
            await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT_LONG);
            const screenshot = await getElementScreenshotWithPadding(page, element, ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot(`playground_expanded_${resolution.name}.png`);
        });

        test(`Should render playground after run properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = await page.$('.kotlin-playground__wrapper');
            await page.locator('.run-button').click();
            const RUN_TIMEOUT = 3000;
            await page.waitForTimeout(RUN_TIMEOUT);
            const screenshot = await getElementScreenshotWithPadding(page, element, ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot(`playground_run_${resolution.name}.png`);
        });

        test(`Should render markdown table properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('div.table').filter({ hasText: 'Primitive-type array' }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`table_${resolution.name}.png`);
        });

        test(`Should render XML table properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('div.table').filter({ hasText: 'Last modified on' }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`table_xml_${resolution.name}.png`);
        });

        test(`Should render XML table with codeblocks properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('div.table').filter({ hasText: 'configure' }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`table_xml_codeblocks_${resolution.name}.png`);
        });

        test(`Should render complex table with codeblocks properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('div.table').filter({ hasText: 'Dependencies' }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`table_complex_codeblocks_${resolution.name}.png`);
        });

        test(`Should render ordered list properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('ol').filter({ hasText: 'One' }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`ordered-list_${resolution.name}.png`);
        });

        test(`Should render unordered list properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('ul').filter({ hasText: 'First bullet' }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`unordered-list_${resolution.name}.png`);
        });

        test(`Should render text elements properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('ul').filter({ hasText: 'Bold text' }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`text-elements_${resolution.name}.png`);
        });

        test(`Should render video player properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('div.video-player').first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`video-player_${resolution.name}.png`);
        });

        test(`Should render warning properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('blockquote').filter({ hasText: 'Support for K2' }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`blockquote_warning_${resolution.name}.png`);
        });

        test(`Should render note properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('blockquote').filter({ hasText: 'As for native' }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`blockquote_note_${resolution.name}.png`);
        });

        test(`Should render tip properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('blockquote').filter({ hasText: 'As for native' }).last();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`blockquote_tip_${resolution.name}.png`);
        });

        test(`Should render definition list properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = await page.locator('dl.definition-list').first().elementHandle();
            const screenshot = await getElementScreenshotWithPadding(page, element, ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot(`definition-list_${resolution.name}.png`);
        });

        test(`Should render expanded definition list properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = await page.locator('dl.definition-list').first().elementHandle();
            await page.locator('dt').first().click();
            await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT);
            const screenshot = await getElementScreenshotWithPadding(page, element, ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot(`definition-list_expanded_${resolution.name}.png`);
        });

        test(`Should render markdown image properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('img[title="Create a test"]').first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`image_${resolution.name}.png`);
        });

        test(`Should render xml image properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('img[title="Multiplatform web wizard"]').first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`image_xml_${resolution.name}.png`);
        });

        test(`Should render inline image properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('img[title="YouTrack"]');
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`image_inline_${resolution.name}.png`);
        });

        test(`Should render zoomable image properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('figure').filter({ has: page.locator('a[href="images/ksp-class-diagram.svg"]') }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`image_zoomable_${resolution.name}.png`);
        });

        test(`Should render zoomed image properly on ${resolution.name}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('figure').filter({ has: page.locator('a[href="images/ksp-class-diagram.svg"]') }).first();
            await element.locator('button').click();
            await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT);
            const lightbox = page.locator('div.light-box');
            const screenshot = await lightbox.screenshot();
            expect(screenshot).toMatchSnapshot(`image_zoomed_${resolution.name}.png`);
        });
    }
});
