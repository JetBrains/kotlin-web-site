import { expect, test } from '@playwright/test';
import { testSelector } from '../utils';
import { WebHelpPage } from '../page/webhelp-page';
import {  RESOLUTIONS } from '../visual/visual-constants';

test.describe.only('WebHelp page interactivity', async () => {
    test.beforeEach(async ({ page }) => {
        const webHelpPage = new WebHelpPage(page, '/docs/test-page.html');
        await webHelpPage.init();
    });

    test(`Should open page item properly on desktop`, async ({ page }) => {
        await page.setViewportSize(RESOLUTIONS[0]);
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
});
