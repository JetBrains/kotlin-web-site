import { join } from 'node:path';
import { expect, Page, test } from '@playwright/test';
import { CaseStudiesPage } from '../page/case-studies-page';

test.describe('Case-studies landing page', async () => {
    test('Case-studies: check hero block content', async ({ page }) => {
        const caseStudiesPage = new CaseStudiesPage(page);
        await caseStudiesPage.init();

        await expect(caseStudiesPage.heroTitle.first()).toBeVisible();
        await expect(caseStudiesPage.heroTitle.first()).not.toBeEmpty();

        await expect(caseStudiesPage.heroSubTitle.first()).toBeVisible();
        await expect(caseStudiesPage.heroSubTitle.first()).not.toBeEmpty();
    });

    test('Case-studies: should not show platform filter for all cases', async ({ page }) => {
        const caseStudiesPage = new CaseStudiesPage(page);
        await caseStudiesPage.init();

        await expect(caseStudiesPage.filterBySharedCode).toBeHidden();
        await expect(caseStudiesPage.filterByComposeUI).toBeHidden();
    });

    test('Case-studies: should show platform filter for KMP cases with expected default state', async ({ page }) => {
        const caseStudiesPage = new CaseStudiesPage(page);
        await caseStudiesPage.init();

        await caseStudiesPage.selectType(caseStudiesPage.switchKMP);
        await caseStudiesPage.isSwitchActive(caseStudiesPage.switchKMP);

        await caseStudiesPage.areAllSharedPlatformsSwitchedOff();
        await caseStudiesPage.isComposeUISwitchedOff();
    });

    test('Case-studies: case-studies have description', async ({ page }) => {
        const caseStudiesPage = new CaseStudiesPage(page);
        await caseStudiesPage.init();

        await caseStudiesPage.caseStudiesHaveDescriptions();
    });


    test('Case-studies: Server-side has no KMP filters', async ({ page }) => {
        const caseStudiesPage = new CaseStudiesPage(page);
        await caseStudiesPage.init();

        await caseStudiesPage.selectType(caseStudiesPage.switchServerSide);
        await caseStudiesPage.isSwitchActive(caseStudiesPage.switchServerSide);

        await expect(caseStudiesPage.filterByComposeUI).toBeHidden();
    });

    test('Case-studies: AI has no KMP filters', async ({ page }) => {
        const caseStudiesPage = new CaseStudiesPage(page);
        await caseStudiesPage.init();

        await caseStudiesPage.selectType(caseStudiesPage.switchAi);
        await caseStudiesPage.isSwitchActive(caseStudiesPage.switchAi);

        await expect(caseStudiesPage.filterByComposeUI).toBeHidden();
    });

    test('Case-studies: selected type is presented in url', async ({ page }) => {
        const caseStudiesPage = new CaseStudiesPage(page);
        await caseStudiesPage.init();

        expect(page.url()).not.toContain('type=');

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            caseStudiesPage.selectType(caseStudiesPage.switchKMP)
        ]);

        expect(page.url()).toContain('type=multiplatform');

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            caseStudiesPage.selectType(caseStudiesPage.switchServerSide)
        ]);

        expect(page.url()).toContain('type=backend');

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            caseStudiesPage.selectType(caseStudiesPage.switchAi)
        ]);

        expect(page.url()).toContain('type=ai');
    });


    test('Case-studies: should show the case card in the viewport when opening the page with anchor link', async ({ page }) => {
        const caseStudiesPage = new CaseStudiesPage(page);
        await caseStudiesPage.init();

        const lastCaseCardId = await caseStudiesPage.gridItem.last().getAttribute('id');

        await caseStudiesPage.init(lastCaseCardId);

        const lastCard = caseStudiesPage.gridBlock.locator(`#${lastCaseCardId}`).first();
        await expect(lastCard).toBeInViewport();
    });
});

test.describe('Case-studies grid layout', async () => {
    // The grid measures every card and redistributes them, which needs the images to arrive first.
    test.setTimeout(60000);

    const MAX_COLUMN_DIFFERENCE_RATIO = 0.05;

    // The video cards take their height from a preview image hosted by YouTube. Serving a 16:9
    // stand-in keeps the measured layout the one users get, without depending on an external host.
    const YOUTUBE_PREVIEW = join(__dirname, '../fixtures/youtube-preview.png');

    async function serveCardImages(page: Page, heldUntil?: Promise<void>) {
        await page.route('**://img.youtube.com/**', async (route) => {
            await heldUntil;
            await route.fulfill({ path: YOUTUBE_PREVIEW });
        });
        await page.route('**/images/case-studies/**', async (route) => {
            await heldUntil;
            await route.continue();
        });
    }

    async function expectBalancedColumns(caseStudiesPage: CaseStudiesPage) {
        const heights = await caseStudiesPage.columnContentHeights();
        expect(heights).toHaveLength(2);

        const difference = Math.abs(heights[0] - heights[1]);
        expect(difference).toBeLessThanOrEqual(Math.max(...heights) * MAX_COLUMN_DIFFERENCE_RATIO);
    }

    test('Case-studies: both grid columns end at a similar height', async ({ page }) => {
        await serveCardImages(page);

        const caseStudiesPage = new CaseStudiesPage(page);
        await caseStudiesPage.init();
        await caseStudiesPage.waitForGridLayout();

        await expectBalancedColumns(caseStudiesPage);
    });

    test('Case-studies: grid columns stay balanced when the card images arrive late', async ({ page }) => {
        let releaseImages: () => void;
        await serveCardImages(page, new Promise<void>((resolve) => (releaseImages = resolve)));

        // Nothing answers the image requests yet, so the page stays short of its "load" event while
        // the grid arranges cards that have not received their images. That is the reported state.
        const caseStudiesPage = new CaseStudiesPage(page);
        const navigation = caseStudiesPage.init();
        await caseStudiesPage.waitForStableColumns();

        releaseImages();
        await navigation;
        await caseStudiesPage.waitForGridLayout();

        await expectBalancedColumns(caseStudiesPage);
    });

    test('Case-studies: the page ends with the footer, with no empty space below it', async ({ page }) => {
        const caseStudiesPage = new CaseStudiesPage(page);
        await caseStudiesPage.init();
        await caseStudiesPage.waitForGridLayout();

        const spaceBelowFooter = await page.evaluate(() => {
            const footer = document.querySelector('footer');
            const footerBottom = footer.getBoundingClientRect().bottom + window.scrollY;
            return Math.round(document.documentElement.scrollHeight - footerBottom);
        });

        expect(spaceBelowFooter).toBeLessThanOrEqual(1);
    });

    test('Case-studies: every case study is rendered exactly once', async ({ page }) => {
        const caseStudiesPage = new CaseStudiesPage(page);
        await caseStudiesPage.init();
        await caseStudiesPage.waitForGridLayout();

        const ids = await caseStudiesPage.gridItem.evaluateAll((cards) => cards.map((card) => card.id));

        expect(ids.length).toBeGreaterThan(0);
        expect(new Set(ids).size).toBe(ids.length);
    });
});
