import { expect, Locator, test } from '@playwright/test';
import { MultiplatformPage } from '../../page/multiplatform-page';
import { checkAnchor, checkScreenshot, isSkipScreenshot } from '../../utils';

test.describe('Multiplatform landing page', async () => {
    let multiplatformPage: MultiplatformPage;

    test.beforeEach(async ({ page }) => {
        multiplatformPage = new MultiplatformPage(page);
        await multiplatformPage.init();
    });

    test('screenshot testing', async () => {
        test.skip(isSkipScreenshot, 'Skipping screenshot testing');

        const { main, page } = multiplatformPage;

        await page.evaluate(() => window.scrollTo(0, 0));

        await expect(page).toHaveScreenshot({
            caret: 'hide',
            animations: 'disabled',
            fullPage: true,
            mask: [
                main.locator('video[autoplay]'),
                page.locator('[data-test="header"]')
            ]
        });
    });

    test('check hero block content', async () => {
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

        expect(multiplatformPage.page.url()).toContain(href);
    });

    test('check "Choose what to share" block', async () => {
        const page = multiplatformPage.page;

        await expect(multiplatformPage.shareWhatBlock).toBeVisible();
        await expect(multiplatformPage.shareWhatTitle).not.toBeEmpty();

        const anchors = multiplatformPage.shareWhatChips;
        await expect(anchors).toHaveCount(3);

        for (const anchor of await anchors.all()) {
            // Check that the "both-logic-ui-tab" chip is selected by default
            if (await anchor.getAttribute('id') === 'choose-share-what-both-logic-ui-tab') {
                await anchor.scrollIntoViewIfNeeded();
                await checkChooseWhatToShare(multiplatformPage, anchor);
                continue;
            }

            // Check that other chips are not selected by default
            await expect(anchor).not.toHaveAttribute('aria-selected', 'true');
            await expect(anchor).not.toHaveAttribute('data-test', /(^|\s)chip-selected(\s|$)/);

            const paneId = await anchor.getAttribute('aria-controls');
            const pane = page.locator(`#${paneId}`);

            // Check that the corresponding pane is not visible by default
            await expect(pane).not.toBeVisible();
        }

        // Check that clicking on a chip selects it and opens the corresponding pane
        //   reversed for test it works for all tabs includes the first one
        for (const anchor of (await anchors.all()).reverse()) {
            await anchor.scrollIntoViewIfNeeded();
            await checkAnchor(page, anchor);
            await checkChooseWhatToShare(multiplatformPage, anchor);
        }
    });

    test('check CTA block', async () => {
        await expect(multiplatformPage.ctaBlockTitle).toBeVisible();
        await expect(multiplatformPage.ctaBlockTitle).not.toBeEmpty();

        await expect(multiplatformPage.ctaBlockAction).toBeVisible();
        await expect(multiplatformPage.ctaBlockAction).not.toBeEmpty();

        const href = await multiplatformPage.ctaBlockAction.getAttribute('href');
        await multiplatformPage.ctaBlockAction.click();

        expect(multiplatformPage.page.url()).toContain(href);
    });
});

async function checkChooseWhatToShare({ page, main, shareWhatBlock }: MultiplatformPage, anchor: Locator) {
    // Check that the tab is selected
    await expect(anchor).toHaveAttribute('aria-selected', 'true');
    await expect(anchor).toHaveAttribute('data-test', /(^|\s)chip-selected(\s|$)/);

    const paneId = await anchor.getAttribute('aria-controls');
    const pane = main.locator(`#${paneId}`);

    await expect(pane).toBeInViewport();

    // Check that the selected chip content is visible and not empty
    const title = pane.getByTestId('share-what-chip-content-title');
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();
    await expect(title).toBeInViewport();

    const content = pane.getByTestId('share-what-chip-content-text');
    await expect(content).toBeVisible();
    await expect(content).not.toBeEmpty();

    const link = pane.getByTestId('share-what-chip-content-action');
    await expect(link).toBeVisible();
    await expect(link).not.toBeEmpty();

    await checkScreenshot(shareWhatBlock);

    // Check that links work as links
    const href = await link.getAttribute('href');
    await link.click();

    expect(page.url()).toContain(href);
    await page.goBack();
}
