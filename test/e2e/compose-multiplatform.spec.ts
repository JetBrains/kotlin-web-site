import { expect, test } from '@playwright/test';
import { ComposeMultiplatformPage } from '../page/compose-multiplatform-page';
import { checkScreenshot } from '../utils';

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

        await checkScreenshot(composePage.hero, {
            stylePath: 'test/e2e/hide-sticky-banner.css',
            mask: [composePage.heroCarousel],
        });

        await composePage.heroActionButton.click();
        await expect(composePage.page).toHaveURL(new RegExp(`.*${href}$`));
    });

    test('check platforms block', async () => {
        await expect(composePage.platformsBlock).toBeVisible();
        await expect(composePage.platformsContent).toBeVisible();
        await expect(composePage.platformsItems).toHaveCount(4);

        await checkScreenshot(composePage.platformsBlock, {
            stylePath: 'test/e2e/hide-sticky-banner.css',
        });
    })

    test('check features block', async () => {
        await expect(composePage.featuresBlock).toBeVisible();
        
        await expect(composePage.featureItems).not.toHaveCount(0);
        
        for (const title of await composePage.featureTitles.all()) {
            await expect(title).toBeVisible();
            await expect(title).not.toBeEmpty();
        }

        await checkScreenshot(composePage.featuresBlock, {
            stylePath: 'test/e2e/hide-sticky-banner.css',
        });
    });

    test('check quote section', async () => {
        await expect(composePage.quoteSection).toBeVisible();
        await expect(composePage.quoteCards).not.toHaveCount(0);

        await checkScreenshot(composePage.quoteSection, {
            stylePath: 'test/e2e/hide-sticky-banner.css',
        });
    });

    test('check CTA block', async () => {
        await expect(composePage.ctaBlockTitle).toBeVisible();
        await expect(composePage.ctaBlockTitle).not.toBeEmpty();

        await expect(composePage.ctaBlockButton).toBeVisible();
        const href = await composePage.ctaBlockButton.getAttribute('href');

        await checkScreenshot(composePage.ctaBlock, {
            stylePath: 'test/e2e/hide-sticky-banner.css',
        });

        await composePage.ctaBlockButton.click();
        await expect(composePage.page).toHaveURL(new RegExp(`.*${href}$`));
    });
});
