import { test, expect } from '@playwright/test';

test.describe('Community page, overview tab, rest buttons', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/community/');
        await page.waitForSelector('button.ch2-btn.ch2-btn-primary');
        await page.click('button.ch2-btn.ch2-btn-primary');
    });

    test('Kotlin User Groups in navbar opens the user-groups page', async ({ page }) => {
        const kotlinUserGroupsButton = page.getByRole('link', { name: 'Kotlin User Groups' });
        await expect(kotlinUserGroupsButton).toBeVisible();
        await kotlinUserGroupsButton.click();
        // We need a timeout here, because this page needs more time for loading https://kotlinlang.org/community/user-groups/
        await page.waitForTimeout(2000);
        await expect(page.url()).toContain('/community/user-groups/');
    });

    test('Click on Awesome Kotlin button opens the related page', async ({ page, context }) => {
        const awesomeKotlinButton = page.getByRole('link', { name: 'Awesome Kotlin' });
        await expect(awesomeKotlinButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await awesomeKotlinButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://kotlin.link/');
    });

    test('All KUGs button at the join section opens the KUGs page', async ({ page }) => {
        const allKugsButton = page.getByRole('link', { name: 'All KUGs' }).first();
        await expect(allKugsButton).toBeVisible();
        await allKugsButton.click();
        // We need a timeout here, because this page needs more time for loading https://kotlinlang.org/community/user-groups/
        await page.waitForTimeout(2000);
        await expect(page.url()).toContain('/community/user-groups/');
    });

    test('Write to us button contains the related e-mail', async ({ page }) => {
        const writeToUsButton = page.getByRole('link', { name: 'Write to us' });
        await expect(writeToUsButton).toBeVisible();
        const href = await writeToUsButton.getAttribute('href');
        expect(href).toBe('mailto:kug@jetbrains.com');
    });
});