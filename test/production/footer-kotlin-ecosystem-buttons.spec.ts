import { test, expect } from '@playwright/test';

test.describe('Footer kotlin ecosystem buttons', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('button.ch2-btn.ch2-btn-primary');
        await page.click('button.ch2-btn.ch2-btn-primary');
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
    });

    test('Contributing to Kotlin button should navigate to Contributing page', async ({ page }) => {
        const contributingButton = page.getByRole('link', { name: 'Contributing to Kotlin' });
        await expect(contributingButton).toBeVisible();
        await contributingButton.click();
        await expect(page.url()).toContain('/docs/contribute.html');
    });

    test('Releases button should navigate to Releases page', async ({ page }) => {
        const releasesButton = page.getByRole('link', { name: 'Releases' });
        await expect(releasesButton).toBeVisible();
        await releasesButton.click();
        await expect(page.url()).toContain('/releases.html');
    });

    // Without click on the button, but it checks that the button contains the right link. Playwright can't check the PDF.
    test('Press Kit button should navigate to Press Kit page', async ({ page }) => {
        const pressKitButton = page.getByRole('link', { name: 'Press Kit' });
        await expect(pressKitButton).toBeVisible();
        const href = await pressKitButton.getAttribute('href');
        expect(href).toBe('https://kotlinlang.org/assets/kotlin-media-kit.pdf');
        });

    test('Security button should navigate to Security page', async ({ page }) => {
        const securityButton = page.getByRole('link', { name: 'Security' });
        await expect(securityButton).toBeVisible();
        await securityButton.click();
        await expect(page.url()).toContain('/security.html');
    });

    test('Blog button should navigate to Kotlin Blog page', async ({ page, context }) => {
        const blogButton = page.getByRole('link', { name: 'Blog' }).last();
        await expect(blogButton).toBeVisible();
        const pagePromise = context.waitForEvent('page');
        await blogButton.click();
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://blog.jetbrains.com/kotlin');
    });

    test('Issue Tracker button should navigate to the YouTrack page', async ({ page, context }) => {
        const issueTrackerButton = page.getByRole('link', { name: 'Issue Tracker' });
        await expect(issueTrackerButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await issueTrackerButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://youtrack.jetbrains.com/issues/');
    });

    test('Brand Assets button should navigate to Brand Assets page', async ({ page, context }) => {
        const brandAssetsButton = page.getByRole('link', { name: 'Brand Assets' });
        await expect(brandAssetsButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await brandAssetsButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://kotlinlang.org/docs/kotlin-brand-assets.html');
    });

    test('Careers button should navigate to Careers page', async ({ page, context }) => {
        const careersButton = page.getByRole('link', { name: 'Careers' });
        await expect(careersButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await careersButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('jetbrains.com/careers');
    });

    test('Kotlin Merch button should navigate to Kotlin Merch page', async ({ page, context }) => {
        const kotlinMerchButton = page.getByRole('link', { name: 'Kotlin Merch' });
        await expect(kotlinMerchButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await kotlinMerchButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://www.jetbrainsmerchandise.com/brand/kotlin.html');
    });

    test('Opt-Out button should navigate to Opt-Out page', async ({ page }) => {
        const optOutButton = page.getByRole('link', { name: 'Opt-Out' });
        await expect(optOutButton).toBeVisible();
        await optOutButton.click();
        const cookieSettingsPopup = page.locator('#ch2-settings-dialog');
        await expect(cookieSettingsPopup).toBeVisible();
        await expect(cookieSettingsPopup).toContainText('Cookie Settings');
    });

    // Click on the JetBrains logo button in footer.
    test('JetBrains logo button should navigate to JetBrains homepage', async ({ page, context }) => {
        const jetBrainsLink = page.getByRole('link', { name: 'JetBrains' }).nth(3);
        await expect(jetBrainsLink).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await jetBrainsLink.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://www.jetbrains.com/');
    });

    // Click on the last JetBrains link on the page. It's here: "Supported and developed by JetBrains."
    test('JetBrains link should navigate to JetBrains homepage', async ({ page, context }) => {
        const jetBrainsLink = page.getByRole('link', { name: 'JetBrains' }).last();
        await expect(jetBrainsLink).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await jetBrainsLink.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://www.jetbrains.com/');
    });

    test('Kotlin Foundation link should navigate to Kotlin Foundation homepage', async ({ page }) => {
        const kotlinFoundationLink = page.getByRole('link', { name: 'Kotlin Foundation' });
        await expect(kotlinFoundationLink).toBeVisible();
        await kotlinFoundationLink.click();
        await page.waitForLoadState();
        await expect(page.url()).toContain('https://kotlinfoundation.org/');
    });

    test('Apache 2 license link should navigate to related page on GitHub', async ({ page, context }) => {
        const apacheLicenseLink = page.getByRole('link', { name: 'Apache 2 license' });
        await expect(apacheLicenseLink).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await apacheLicenseLink.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://github.com/JetBrains/kotlin-web-site/blob/master/LICENSE');
    });
});
