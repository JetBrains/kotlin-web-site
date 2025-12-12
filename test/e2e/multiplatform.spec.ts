import { expect, Locator, Page, test } from '@playwright/test';
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

        const anchors = multiplatformPage.shareWhatChips;
        await expect(anchors).toHaveCount(3);

        for (const anchor of await anchors.all()) {
            // Check that the "both-logic-ui-tab" chip is selected by default
            if (await anchor.getAttribute('id') === 'choose-share-what-both-logic-ui-tab') {
                await anchor.scrollIntoViewIfNeeded();
                await checkChooseWhatToShare(page, anchor);
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
            await checkChooseWhatToShare(page, anchor);
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

async function checkChooseWhatToShare(page: Page, anchor: Locator) {
    // Check that the tab is selected
    await expect(anchor).toHaveAttribute('aria-selected', 'true');
    await expect(anchor).toHaveAttribute('data-test', /(^|\s)chip-selected(\s|$)/);

    const paneId = await anchor.getAttribute('aria-controls');
    const pane = page.locator(`#${paneId}`);

    await expect(pane).toBeInViewport();

    // Check that the selected chip content is visible and not empty
    const title = pane.getByTestId('share-what-chip-content-title');
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();

    const content = pane.getByTestId('share-what-chip-content-text');
    await expect(content).toBeVisible();
    await expect(content).not.toBeEmpty();

    const link = pane.getByTestId('share-what-chip-content-action');
    await expect(link).toBeVisible();
    await expect(link).not.toBeEmpty();

    // Check that links work as links
    const href = await link.getAttribute('href');
    await link.click();

    expect(page.url()).toContain(href);
    await page.goBack();

    // Check that the browser scrolls to the anchor after clicking on the back button
    await expect(link).toBeInViewport();
}
