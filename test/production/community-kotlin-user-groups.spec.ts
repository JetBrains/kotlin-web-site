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

        test('Start a New KUG button opens the related page', async ({ page }) => {
            const startKugButton = page.getByRole('link', { name: 'Start a New KUG' });
            await expect(startKugButton).toBeVisible();
            await startKugButton.click();
            await expect(page.url()).toContain('https://surveys.jetbrains.com/s3/submit-a-local-kotlin-user-group');
        });

        test('Write to us button on the KUGs page contains the related e-mail', async ({ page }) => {
            const writeToUsButton = page.getByRole('link', { name: 'Write to us' });
            await expect(writeToUsButton).toBeVisible();
            const href = await writeToUsButton.getAttribute('href');
            expect(href).toBe('mailto:kug@jetbrains.com');
        });
});