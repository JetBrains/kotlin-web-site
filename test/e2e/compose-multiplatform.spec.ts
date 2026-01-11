import { expect, test } from '@playwright/test';
import { ComposeMultiplatformPage } from '../page/compose-multiplatform-page';

test.describe('Compose Multiplatform landing page', async () => {
    let composePage: ComposeMultiplatformPage;

    test.beforeEach(async ({ page }) => {
        composePage = new ComposeMultiplatformPage(page);
        await composePage.init();
    });

    test('check hero block content', async () => {
        await expect(composePage.heroTitle).toBeVisible();
        await expect(composePage.heroTitle).not.toBeEmpty();

        await expect(composePage.heroSubTitle).toBeVisible();
        await expect(composePage.heroSubTitle).not.toBeEmpty();

        await expect(composePage.heroActionButton).toBeVisible();
        const href = await composePage.heroActionButton.getAttribute('href');

        await composePage.heroActionButton.click();
        await expect(composePage.page).toHaveURL(new RegExp(`.*${href}$`));
    });

    test('check features block', async () => {
        await expect(composePage.featuresBlock).toBeVisible();
        
        await expect(composePage.featureItems).not.toHaveCount(0);
        
        for (const title of await composePage.featureTitles.all()) {
            await expect(title).toBeVisible();
            await expect(title).not.toBeEmpty();
        }
    });

    test('check quote section', async () => {
        await expect(composePage.quoteSection).toBeVisible();
        await expect(composePage.quoteCards).not.toHaveCount(0);
    });

    test('check CTA block', async () => {
        await expect(composePage.ctaBlockTitle).toBeVisible();
        await expect(composePage.ctaBlockTitle).not.toBeEmpty();

        await expect(composePage.ctaBlockButton).toBeVisible();
        const href = await composePage.ctaBlockButton.getAttribute('href');

        await composePage.ctaBlockButton.click();
        await expect(composePage.page).toHaveURL(new RegExp(`.*${href}$`));
    });
});
