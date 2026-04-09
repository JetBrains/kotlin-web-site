import { expect, test } from '@playwright/test';
import os from 'os';
import { checkFullPageScreenshot, checkScreenshot, skipProduction, testSelector } from '../../utils';
import { WebHelpPage } from './page';
import { ELEMENT_PADDING_OFFSET, RESOLUTIONS } from '../visual-constants';

test.describe('Docs: Test Page appearance', async () => {
    skipProduction();

    test.beforeEach(async ({ page }) => {
        const webHelpPage = new WebHelpPage(page, '/docs/test-page.html');
        await webHelpPage.init();
    });

    test(`Should render article navigation properly on desktop`, async ({ page }) => {
        await page.setViewportSize(RESOLUTIONS.desktop);
        const element = page.locator(testSelector('virtual-toc'));

        await expect(element).toHaveCount(1);
        await expect(element).toBeVisible();

        await checkScreenshot(element, { clip: ELEMENT_PADDING_OFFSET });
    });

    test(`Should render indicate current section in article navigation`, async ({ page }) => {
        await page.setViewportSize(RESOLUTIONS.desktop);
        const toc = page.locator(testSelector('virtual-toc'));

        const tocItem = toc.locator('.toc-node').filter({ hasText: 'Lists' }).first();
        await tocItem.locator('a[href="/docs/test-page.html#lists"]').click();
        await expect(tocItem).toHaveAttribute('data-test', 'toc-node--selected');

        await toc.scrollIntoViewIfNeeded();
        await checkScreenshot(toc, { clip: ELEMENT_PADDING_OFFSET });
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
        });
        await page.click('#clipboardTextarea');
        if (os.platform() === 'darwin') {
            await page.keyboard.press('Meta+V');
        } else {
            await page.keyboard.press('Control+V');
        }
        const clipboardContent = await page.$eval(
            '#clipboardTextarea',
            (textAreaElement: HTMLTextAreaElement) => textAreaElement.value
        );
        expect(clipboardContent).toEqual(EXPECTED_CODEBLOCK_CONTENT);
    });

    test(`Should zoom zoomable image in and out`, async ({ page }) => {
        const element = page
            .locator('figure')
            .filter({ has: page.locator('a[href="images/ksp-class-diagram.svg"]') })
            .first();

        await element.locator('button').first().click();

        const lightbox = page.locator('div.light-box').first();
        await expect(lightbox).toHaveCount(1);

        const image = lightbox.locator('img').first();
        await expect(image).toBeVisible();

        await lightbox.locator('button').first().click();
        await expect(lightbox).toHaveCount(0);
    });

    test('External link should opens in the same tab', async ({ page }) => {
        const externalLink = page.getByText('external link').first();

        await expect(externalLink).not.toHaveAttribute('target', /_blank/i);
    });

    for (const [resolutionName, resolution] of Object.entries(RESOLUTIONS)) {
        test(`Should render layout of the article properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            await checkFullPageScreenshot(page, { stylePath: ['test/e2e/docs/writerside-layout.css'] });
        });

        test(`Should render micro format properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);

            const element = page.locator(testSelector('micro-format-content'));
            await expect(element).toBeVisible();

            for (const title of ['First step', 'Second step', 'Third step', 'Fourth step']) {
                const step = element.locator(`[title="${title}"]`);
                await expect(step).toBeVisible();
            }

            await checkScreenshot(element);
        });

        test(`Should render tabs properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);

            const elements = await page.locator(testSelector('tab-list-wrapper')).all();

            for (const element of elements) {
                await expect(element).toBeVisible();
                await expect(element.locator(testSelector('tab-content'))).toHaveCount(2);
                await checkScreenshot(element);
            }
        });

        test(`Should switch tabs synchronously on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const tabsAnchors = await page.$$(testSelector('tab'));
            await tabsAnchors[1].click();

            const elements = await page.locator(testSelector('tab-list-wrapper')).all();
            for (const element of elements) {
                await expect(element).toBeVisible();
                await checkScreenshot(element);
            }
        });

        test(`Should render collapse section properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);

            const element = page.locator(testSelector('collapse-element')).first();
            await expect(element).toBeVisible();

            await element.scrollIntoViewIfNeeded();
            await checkScreenshot(element, { clip: ELEMENT_PADDING_OFFSET });
        });

        test(`Should render collapse section when expanded properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);

            const element = page.locator(testSelector('collapse-element')).first();
            await element.click();

            await expect(element).toContainClass('collapse--expanded');
            await element.locator(':scope[data-is-animating="false"][data-test-is-animating="false"]').waitFor({
                state: 'visible',
            });

            await checkScreenshot(element, { clip: ELEMENT_PADDING_OFFSET });
        });

        test(`Should render just a codeblock properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const codeBlock = page.locator(testSelector('code-block')).filter({ hasText: 'MessageService' }).first();
            await expect(codeBlock).toBeVisible();
            await checkScreenshot(codeBlock);
        });

        test(`Should render hovered codeblock properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const codeBlock = page.locator(testSelector('code-block')).filter({ hasText: 'MessageService' }).first();
            await codeBlock.hover();
            await checkScreenshot(codeBlock);
        });

        test(`Should render expandable codeblock properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const codeBlock = page.locator(testSelector('code-collapse')).filter({ hasText: 'package' }).first();
            await codeBlock.scrollIntoViewIfNeeded();
            await checkScreenshot(codeBlock, { clip: ELEMENT_PADDING_OFFSET });
        });

        test(`Should render expandable codeblock when expanded properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);

            const codeBlock = page.locator(testSelector('code-collapse')).filter({ hasText: 'package' }).first();
            await codeBlock.locator(testSelector('synopsis-ending')).click();
            await codeBlock.locator(':scope.code-collapse--fully-opened').waitFor({ state: 'visible' });

            await codeBlock.scrollIntoViewIfNeeded();
            await checkScreenshot(codeBlock, { clip: ELEMENT_PADDING_OFFSET });
        });

        test(`Should render collapsed codeblock properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);

            const codeBlock = page.locator(testSelector('code-collapse')).filter({ hasText: 'package' }).first();
            await codeBlock.locator(testSelector('synopsis-ending')).click();
            await codeBlock.locator(':scope.code-collapse--fully-opened').waitFor({ state: 'visible' });

            await codeBlock.locator(testSelector('collapse-button')).first().click();
            await codeBlock.locator(':scope.code-collapse--fully-closed').waitFor({ state: 'visible' });

            await codeBlock.scrollIntoViewIfNeeded();
            await checkScreenshot(codeBlock, { clip: ELEMENT_PADDING_OFFSET });
        });

        test(`Should render playground properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);

            const element = page.locator('.kotlin-playground__wrapper').first();
            await expect(element).toBeVisible();

            await element.scrollIntoViewIfNeeded();
            await checkScreenshot(element, { clip: ELEMENT_PADDING_OFFSET });
        });

        test(`Should render expanded playground properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('.kotlin-playground__wrapper').first();
            await page.locator('.fold-button').click();
            await checkScreenshot(element, { clip: ELEMENT_PADDING_OFFSET });
        });

        test(`Should render playground after run properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('.kotlin-playground__wrapper').first();
            await page.locator('.run-button').click();

            await element.locator('.code-output').waitFor({ state: 'visible' });

            await expect(element).toBeVisible();
            await checkScreenshot(element, { clip: ELEMENT_PADDING_OFFSET });
        });

        test(`Should render markdown table properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('div.table').filter({ hasText: 'Primitive-type array' }).first();
            await expect(element).toBeVisible();
            await checkScreenshot(element);
        });

        test(`Should render XML table properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('div.table').filter({ hasText: 'Last modified on' }).first();
            await expect(element).toBeVisible();
            await checkScreenshot(element);
        });

        test(`Should render XML table with codeblocks properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('div.table').filter({ hasText: 'configure' }).first();
            await expect(element).toBeVisible();
            await checkScreenshot(element);
        });

        test(`Should render complex table with codeblocks properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('div.table').filter({ hasText: 'Dependencies' }).first();
            await expect(element).toBeVisible();
            await checkScreenshot(element);
        });

        test(`Should render ordered list properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('ol').filter({ hasText: 'One' }).first();
            await expect(element).toBeVisible();
            await checkScreenshot(element);
        });

        test(`Should render unordered list properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('ul').filter({ hasText: 'First bullet' }).first();
            await expect(element).toBeVisible();
            await checkScreenshot(element);
        });

        test(`Should render text elements properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('ul').filter({ hasText: 'Bold text' }).first();
            await expect(element).toBeVisible();
            await checkScreenshot(element);
        });

        test(`Should render video player properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('div.video-player').first();
            await expect(element).toBeVisible();
            await checkScreenshot(element);
        });

        test(`Should render warning properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('blockquote').filter({ hasText: 'Support for K2' }).first();
            await expect(element).toBeVisible();
            await checkScreenshot(element);
        });

        test(`Should render note properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('blockquote').filter({ hasText: 'As for native' }).first();
            await expect(element).toBeVisible();
            await checkScreenshot(element);
        });

        test(`Should render tip properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('blockquote').filter({ hasText: 'As for native' }).last();
            await expect(element).toBeVisible();
            await checkScreenshot(element);
        });

        test(`Should render definition list properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('dl.definition-list').first();
            await expect(element).toBeVisible();
            await element.scrollIntoViewIfNeeded();
            await element.hover();
            await checkScreenshot(element, { clip: ELEMENT_PADDING_OFFSET });
        });

        test(`Should render expanded definition list properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator(testSelector('definition-list')).first();
            await page.locator(testSelector('definition-list-title')).first().click();
            await element
                .locator('.collapse--expanded[data-is-animating="false"][data-test-is-animating="false"]')
                .waitFor({ state: 'visible' });
            await element.scrollIntoViewIfNeeded();
            await element.hover();
            await checkScreenshot(element, { clip: ELEMENT_PADDING_OFFSET });
        });

        test(`Should render markdown image properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('img[title="Create a test"]').first();
            await expect(element).toBeVisible();
            await checkScreenshot(element);
        });

        test(`Should render xml image properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('img[title="Multiplatform web wizard"]').first();
            await expect(element).toBeVisible();
            await checkScreenshot(element);
        });

        test(`Should render inline image properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('img[title="YouTrack"]');
            await expect(element).toBeVisible();
            await checkScreenshot(element);
        });

        test(`Should render zoomable image properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page
                .locator('figure')
                .filter({ has: page.locator('a[href="images/ksp-class-diagram.svg"]') })
                .first();
            await expect(element).toBeVisible();
            await checkScreenshot(element);
        });

        test(`Should render zoomed image properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);

            const element = page
                .locator('figure')
                .filter({ has: page.locator('a[href="images/ksp-class-diagram.svg"]') })
                .first();
            await element.locator('button').click();

            const lightbox = page.locator('div.light-box');
            await expect(element).toBeVisible();

            await checkScreenshot(lightbox, { stylePath: ['test/e2e/docs/writerside-layout.css'] });
        });

        test(`Should render button-style image properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);
            const element = page.locator('img[title="Create a project"]').first();
            await expect(element).toBeVisible();
            await checkScreenshot(element);
        });
    }
});
