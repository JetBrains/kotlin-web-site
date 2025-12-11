import { expect, test } from '@playwright/test';
import { MultiplatformPage } from '../page/multiplatform-page';
import { checkAnchor } from '../utils';

let multiplatformPage: MultiplatformPage;

test.describe('Multiplatform landing page', async () => {
    test.beforeEach(async ({ page }) => {
        multiplatformPage = new MultiplatformPage(page);
        await multiplatformPage.init();
    });

    test('Multiplatform: check hero block content', async ({ page }) => {
        await expect(multiplatformPage.heroTitle).toBeVisible();
        await expect(multiplatformPage.heroTitle).not.toBeEmpty();

        await expect(multiplatformPage.heroSubTitle).toBeVisible();
        await expect(multiplatformPage.heroSubTitle).not.toBeEmpty();

        const anchors = multiplatformPage.heroPlatforms;
        await expect(anchors).toHaveCount(5);

        const heroActionButton = multiplatformPage.heroActionButon;
        await expect(heroActionButton).toBeVisible();
        const href = await heroActionButton.getAttribute('href');
        await heroActionButton.click();

        expect(page.url()).toContain(href);
    });

    test('Multiplatform: check "Choose what to share" block', async ({ page }) => {
        await expect(multiplatformPage.shareWhatBlock).toBeVisible();
        await expect(multiplatformPage.shareWhatTitle).not.toBeEmpty();

        const anchors = multiplatformPage.shareWhatChipAnchor;
        const anchorCount = await anchors.count();

        for (let i = 0; i < anchorCount; i++) {
            await multiplatformPage.shareWhatBlock.scrollIntoViewIfNeeded();
            const anchor = multiplatformPage.shareWhatChipAnchor.nth(i);
            await anchor.scrollIntoViewIfNeeded();
            await checkAnchor(page, anchor);

            const title = multiplatformPage.shareWhatChipContentTitle.nth(i);
            await expect(title).toBeVisible();
            await expect(title).not.toBeEmpty();

            const content = multiplatformPage.shareWhatChipContent.nth(i);
            await expect(content).toBeVisible();
            await expect(content).not.toBeEmpty();

            const link = multiplatformPage.shareWhatChipContentAction.nth(i);
            await expect(link).toBeVisible();
            await expect(link).not.toBeEmpty();

            const href = await link.getAttribute('href');
            await link.click();

            expect(page.url()).toContain(href);
            await page.goBack();

            const relink = multiplatformPage.shareWhatChipContentAction.nth(i);
            await expect(relink).toBeVisible();
            await expect(relink).not.toBeEmpty();
        }
    });

    test('Multiplatform: check CTA block', async ({ page }) => {
        await expect(multiplatformPage.ctaBlockTitle).toBeVisible();
        await expect(multiplatformPage.ctaBlockTitle).not.toBeEmpty();

        await expect(multiplatformPage.ctaBlockAction).toBeVisible();
        await expect(multiplatformPage.ctaBlockAction).not.toBeEmpty();

        const href = await multiplatformPage.ctaBlockAction.getAttribute('href');
        await multiplatformPage.ctaBlockAction.click();

        expect(page.url()).toContain(href);
    });
});