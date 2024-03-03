import { expect, test } from '@playwright/test';
import { testSelector } from '../utils';
import { WebHelpPage } from '../page/webhelp-page';

test.describe('WebHelp page interactivity', async () => {
    test.beforeEach(async ({ page }) => {
        const webHelpPage = new WebHelpPage(page, '/docs/test-page.html');
        await webHelpPage.init();
    });


    test(`Should copy codeblock content when copy button clicked`, async ({ page }) => {
        const EXPECTED_CODEBLOCK_CONTENT = `plugins {
kotlin("kapt") version "1.9.22"
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
});
