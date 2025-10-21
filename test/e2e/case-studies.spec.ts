import { expect, test } from '@playwright/test';
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


    test('Case-studies: filter has expected default state', async ({ page }) => {
        const caseStudiesPage = new CaseStudiesPage(page);
        await caseStudiesPage.init();

        await caseStudiesPage.isSwitchActive(caseStudiesPage.switchAll);
        await caseStudiesPage.isAllSharedPlatformsActive();

        await caseStudiesPage.isComposeUIActive();
    });

    test('Case-studies: case-stidies have description', async ({ page }) => {
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

        expect(page.url()).toContain('type=server-side');
    });
});