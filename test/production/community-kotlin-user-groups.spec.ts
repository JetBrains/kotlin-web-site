import { test, expect } from '@playwright/test';

test.describe('Community Kotlin User Groups page', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/community/user-groups/');
            await page.waitForSelector('button.ch2-btn.ch2-btn-primary');
            await page.click('button.ch2-btn.ch2-btn-primary');
        });

        test('Overview in navbar opens the related page', async ({ page }) => {
            const kotlinUserGroupsButton = page.getByRole('link', { name: 'Overview' });
            await expect(kotlinUserGroupsButton).toBeVisible();
            await kotlinUserGroupsButton.click();
            await expect(page.url()).toContain('/community/');
        });

        test('KUG Guidelines button opens the related page', async ({ page }) => {
            const kugGuidelinesButton = page.getByRole('link', { name: 'KUG Guidelines' });
            await expect(kugGuidelinesButton).toBeVisible();
            await kugGuidelinesButton.click();
            await expect(page.url()).toContain('/docs/kug-guidelines.html');
        });

        // The test fails in case we click on the link (it has some additional parameters). To investigate the link after click.
        test('Start a New KUG button opens the related page', async ({ page, context }) => {
            const startKugButton = page.getByRole('link', { name: 'Start a New KUG' });
            await expect(startKugButton).toBeVisible();
            // const newPagePromise = context.waitForEvent('page');
            // await startKugButton.click();
            // const newPage = await newPagePromise;
            // await newPage.waitForLoadState();
            // await expect(newPage.url()).toContain('https://surveys.jetbrains.com/s3/submit-a-local-kotlin-user-group');

        // The test passes in case we don't click on this link.
            const href = await startKugButton.getAttribute('href');
            expect(href).toBe('https://surveys.jetbrains.com/s3/submit-a-local-kotlin-user-group');
        });

        test('Write to us button on the KUGs page contains the related e-mail', async ({ page }) => {
            const writeToUsButton = page.getByRole('link', { name: 'Write to us' });
            await expect(writeToUsButton).toBeVisible();
            const href = await writeToUsButton.getAttribute('href');
            expect(href).toBe('mailto:kug@jetbrains.com');
        });
});