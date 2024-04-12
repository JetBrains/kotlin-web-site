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

const MAX_DIFF_PIXEL_RATIO = 0.011;

test.describe('WebHelp page appearance', async () => {
    test.beforeEach(async ({ page }) => {
        const webHelpPage = new WebHelpPage(page, '/docs/test-page.html');
        await webHelpPage.init();
    });

    test(`Should render table of contents properly on desktop`, async ({ page }) => {
        await page.setViewportSize(RESOLUTIONS.desktop);
        const element = page.locator('nav').locator('ul.toc').first();
        const screenshot = await element.screenshot();
        expect(screenshot).toMatchSnapshot('table-of-contents_desktop.png');
    });

    test(`Should render table of contents with expanded item  properly on desktop`, async ({ page }) => {
        await page.setViewportSize(RESOLUTIONS.desktop);
        const element = page.locator('nav').locator('ul.toc').first();
        const tocItem = element.locator(testSelector('toc-item')).filter({ hasText: 'Basics' }).first();
        await tocItem.click();
        await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT_LONG);
        const screenshot = await element.screenshot();
        expect(screenshot).toMatchSnapshot('table-of-contents-expanded_desktop.png');
    });

    test(`Should render article navigation properly on desktop`, async ({ page }) => {
        await page.setViewportSize(RESOLUTIONS.desktop);
        const element = await page.locator('aside').locator('ul.toc').first().elementHandle();
        const screenshot = await getElementScreenshotWithPadding(page, element, ELEMENT_PADDING_OFFSET);
        expect(screenshot).toMatchSnapshot('article-navigation_desktop.png');
    });

    test(`Should render indicate current section in article navigation`, async ({ page }) => {
        await page.setViewportSize(RESOLUTIONS.desktop);
        await page.locator('a[href="/docs/test-page.html#lists"]').first().click();
        await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT_LONG);
        const element = await page.locator('aside').locator('ul.toc').first().elementHandle();
        const screenshot = await getElementScreenshotWithPadding(page, element, ELEMENT_PADDING_OFFSET);
        expect(screenshot).toMatchSnapshot('article-navigation-current-section_desktop.png');
    });

    test(`Should open page item properly on desktop`, async ({ page }) => {
        await page.setViewportSize(RESOLUTIONS.desktop);
        const element = page.locator('nav').locator('ul.toc').first();
        const tocItem = element.locator(testSelector('toc-item')).filter({ hasText: 'Basics' }).first();
        await tocItem.click();
        const linkTocItem = element.locator('a[href="basic-syntax.html"]').first();
        await linkTocItem.click();
        expect(page.url()).toContain('basic-syntax.html');
    });


    test(`Should copy codeblock content when copy button clicked`, async ({ page }) => {
        const EXPECTED_CODEBLOCK_CONTENT = `plugins {
    kotlin("kapt") version "1.9.23"
}`;
        const codeBlock = page.locator(testSelector('code-block')).first();
        await codeBlock.hover();
        const copyButton = codeBlock.locator(testSelector('copy-button')).first();
        await copyButton.click();
        // since Playwright doesn't have access to the clipboard, we have to test it manually by creating a textarea and pasting the clipboard content into it
        await page.evaluate(() => {
                const textarea = document.createElement('textarea');
                textarea.id = 'clipboardTextarea';
                document.body.appendChild(textarea);
            }
        );
        await page.click('#clipboardTextarea');
        await page.keyboard.press('Meta+V');
        const clipboardContent = await page.$eval('#clipboardTextarea', (textAreaElement: HTMLTextAreaElement) => textAreaElement.value);
        expect(clipboardContent).toEqual(EXPECTED_CODEBLOCK_CONTENT);
    });

    test(`Should zoom zoomable image when clicked`, async ({ page }) => {
        const element = page.locator('figure').filter({ has: page.locator('a[href="images/ksp-class-diagram.svg"]') }).first();
        await element.locator('button').first().click();
        const lightbox = page.locator('div.light-box').first();
        expect(await lightbox.count()).toBe(1);
    });

    test(`Should close zoomable image when close button clicked`, async ({ page }) => {
        const element = page.locator('figure').filter({ has: page.locator('a[href="images/ksp-class-diagram.svg"]') }).first();
        await element.locator('button').first().click();
        const lightbox = page.locator('div.light-box').first();
        expect(await lightbox.count()).toBe(1);
        await lightbox.locator('button').first().click();
        expect(await lightbox.count()).toBe(0);
    });

    for (const [resolutionName, resolution] of Object.entries(RESOLUTIONS)) {
        test(`Should render layout of the article properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const screenshot = await page.screenshot({ fullPage: true });
            expect(screenshot).toMatchSnapshot({
                name: `layout_${resolutionName}.png`,
                maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO
            });
        });

        test(`Should render micro format properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const screenshot = await page.locator(testSelector('micro-format-content')).screenshot();
            expect(screenshot).toMatchSnapshot(`micro-format_${resolutionName}.png`);
        });

        test(`Should render tabs properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const elements = await page.$$(testSelector('tab-list-wrapper'));
            for (let i = 0; i < elements.length; i++) {
                const screenshot = await elements[i].screenshot();
                expect(screenshot).toMatchSnapshot(`tab-list-wrapper-${i}_${resolutionName}.png`);
            }
        });

        test(`Should switch tabs synchronously on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const tabsAnchors = await page.$$(testSelector('tab'));
            await tabsAnchors[1].click();
            await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT);
            const elements = await page.$$(testSelector('tab-list-wrapper'));
            for (let i = 0; i < elements.length; i++) {
                const screenshot = await elements[i].screenshot();
                expect(screenshot).toMatchSnapshot(`tab-list-wrapper-${i}_switched_${resolutionName}.png`);
            }
        });

        test(`Should render collapse section properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const elements = await page.$$(testSelector('collapse-element'));
            const screenshot = await getElementScreenshotWithPadding(page, elements[0], ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot(`collapse-element_${resolutionName}.png`);

        });

        test(`Should render collapse section when expanded properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const elements = await page.$$(testSelector('collapse-element'));
            await elements[0].click();
            await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT);
            const screenshot = await getElementScreenshotWithPadding(page, elements[0], ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot(`collapse-element_expanded_${resolutionName}.png`);
        });

        test(`Should render footer properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const screenshot = await page.locator(testSelector('footer')).screenshot();
            expect(screenshot).toMatchSnapshot(`footer_${resolutionName}.png`);
        });

        test(`Should render just a codeblock properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const codeBlock = page.locator(testSelector('code-block')).filter({ hasText: 'MessageService' }).first();
            const screenshot = await codeBlock.screenshot();
            expect(screenshot).toMatchSnapshot({
                name: `code-block_${resolutionName}.png`,
                maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO
            });
        });

        test(`Should render hovered codeblock properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const codeBlock = page.locator(testSelector('code-block')).filter({ hasText: 'MessageService' }).first();
            await codeBlock.hover();
            const screenshot = await codeBlock.screenshot();
            expect(screenshot).toMatchSnapshot({
                name: `code-block_hovered_${resolutionName}.png`,
                maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO
            });
        });

        test(`Should render expandable codeblock properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const codeBlock = page.locator(testSelector('code-collapse')).filter({ hasText: 'package' }).first();
            const codeBlockElement = await codeBlock.elementHandle();
            const screenshot = await getElementScreenshotWithPadding(page, codeBlockElement, ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot({
                name: `code-block_expandable_${resolutionName}.png`,
                maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO
            });
        });

        test(`Should render expandable codeblock when expanded properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const codeBlock = page.locator(testSelector('code-collapse')).filter({ hasText: 'package' }).first();
            await codeBlock.locator(testSelector('synopsis-ending')).click();
            await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT_LONG);
            const codeBlockElement = await codeBlock.elementHandle();
            const screenshot = await getElementScreenshotWithPadding(page, codeBlockElement, ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot({
                name: `code-block_expandable_expanded_${resolutionName}.png`,
                maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO
            });
        });

        test(`Should render collapsed codeblock properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const codeBlock = page.locator(testSelector('code-collapse')).filter({ hasText: 'package' }).first();
            await codeBlock.locator(testSelector('synopsis-ending')).click();
            await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT_LONG);
            const closeIcon = codeBlock.locator(testSelector('collapse-button')).first();
            await closeIcon.click();
            await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT_LONG);
            const codeBlockElement = await codeBlock.elementHandle();
            const screenshot = await getElementScreenshotWithPadding(page, codeBlockElement, ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot({
                name: `code-block_expandable_${resolutionName}.png`,
                maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO
            });
        });

        test(`Should render playground properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = await page.$('.kotlin-playground__wrapper');
            await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT_LONG);
            const screenshot = await getElementScreenshotWithPadding(page, element, ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot(`playground_${resolutionName}.png`);
        });

        test(`Should render expanded playground properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = await page.$('.kotlin-playground__wrapper');
            await page.locator('.fold-button').click();
            await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT_LONG);
            const screenshot = await getElementScreenshotWithPadding(page, element, ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot(`playground_expanded_${resolutionName}.png`);
        });

        test(`Should render playground after run properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = await page.$('.kotlin-playground__wrapper');
            await page.locator('.run-button').click();
            const RUN_TIMEOUT = 3000;
            await page.waitForTimeout(RUN_TIMEOUT);
            const screenshot = await getElementScreenshotWithPadding(page, element, ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot(`playground_run_${resolutionName}.png`);
        });

        test(`Should render markdown table properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('div.table').filter({ hasText: 'Primitive-type array' }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`table_${resolutionName}.png`);
        });

        test(`Should render XML table properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('div.table').filter({ hasText: 'Last modified on' }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`table_xml_${resolutionName}.png`);
        });

        test(`Should render XML table with codeblocks properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('div.table').filter({ hasText: 'configure' }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`table_xml_codeblocks_${resolutionName}.png`);
        });

        test(`Should render complex table with codeblocks properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('div.table').filter({ hasText: 'Dependencies' }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot({
                name: `table_complex_codeblocks_${resolutionName}.png`,
                maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO
            });
        });

        test(`Should render ordered list properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('ol').filter({ hasText: 'One' }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`ordered-list_${resolutionName}.png`);
        });

        test(`Should render unordered list properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('ul').filter({ hasText: 'First bullet' }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`unordered-list_${resolutionName}.png`);
        });

        test(`Should render text elements properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('ul').filter({ hasText: 'Bold text' }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`text-elements_${resolutionName}.png`);
        });

        test(`Should render video player properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('div.video-player').first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`video-player_${resolutionName}.png`);
        });

        test(`Should render warning properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('blockquote').filter({ hasText: 'Support for K2' }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`blockquote_warning_${resolutionName}.png`);
        });

        test(`Should render note properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('blockquote').filter({ hasText: 'As for native' }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`blockquote_note_${resolutionName}.png`);
        });

        test(`Should render tip properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('blockquote').filter({ hasText: 'As for native' }).last();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`blockquote_tip_${resolutionName}.png`);
        });

        test(`Should render definition list properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = await page.locator('dl.definition-list').first().elementHandle();
            const screenshot = await getElementScreenshotWithPadding(page, element, ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot(`definition-list_${resolutionName}.png`);
        });

        test(`Should render expanded definition list properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = await page.locator('dl.definition-list').first().elementHandle();
            await page.locator('dt').first().click();
            await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT);
            const screenshot = await getElementScreenshotWithPadding(page, element, ELEMENT_PADDING_OFFSET);
            expect(screenshot).toMatchSnapshot({
                name: `definition-list_expanded_${resolutionName}.png`,
                maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO
            });
        });

        test(`Should render markdown image properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('img[title="Create a test"]').first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`image_${resolutionName}.png`);
        });

        test(`Should render xml image properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('img[title="Multiplatform web wizard"]').first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`image_xml_${resolutionName}.png`);
        });

        test(`Should render inline image properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('img[title="YouTrack"]');
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`image_inline_${resolutionName}.png`);
        });

        test(`Should render zoomable image properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('figure').filter({ has: page.locator('a[href="images/ksp-class-diagram.svg"]') }).first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`image_zoomable_${resolutionName}.png`);
        });

        test(`Should render zoomed image properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('figure').filter({ has: page.locator('a[href="images/ksp-class-diagram.svg"]') }).first();
            await element.locator('button').click();
            await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT);
            const lightbox = page.locator('div.light-box');
            const screenshot = await lightbox.screenshot();
            expect(screenshot).toMatchSnapshot(`image_zoomed_${resolutionName}.png`);
        });

        test(`Should render button-style image properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('img[title="Create a project"]').first();
            const screenshot = await element.screenshot();
            expect(screenshot).toMatchSnapshot(`image_button-style_${resolutionName}.png`);
        });
    }
});
