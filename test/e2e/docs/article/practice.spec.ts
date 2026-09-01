import { expect, Page, test } from '@playwright/test';
import { checkScreenshot, skipProduction, testSelector } from '@/test/utils';
import { ELEMENT_PADDING_OFFSET, RESOLUTIONS } from '../../visual-constants';
import { WebHelpPage } from '../page';
import { bodyOf, buttonOf, deflistIn, expandItem, itemsOf, TEST_PAGE_URL } from './utils';

const exercisesOf = (page: Page) => itemsOf(deflistIn(page, 'practice'));

test.describe('Docs: Test Page practice exercises', async () => {
    skipProduction();

    test.beforeEach(async ({ page }) => {
        const webHelpPage = new WebHelpPage(page, TEST_PAGE_URL);
        await webHelpPage.init();
    });

    test(`Should mark the practice heading as a completion point`, async ({ page }) => {
        const heading = page.locator('h2#practice');

        await expect(heading).toBeVisible();
        await expect(heading).toHaveAttribute('data-completion-point', 'true');
    });

    test(`Should render practice exercises collapsed`, async ({ page }) => {
        const practice = deflistIn(page, 'practice');

        await expect(practice).toContainClass('definition-list--type-expandable');
        await expect(practice).toContainClass('definition-list--numbered');

        const exercises = itemsOf(practice);
        await expect(exercises).toHaveCount(3);

        for (const exercise of await exercises.all()) {
            await expect(exercise).not.toContainClass('collapse--expanded');
            await expect(buttonOf(exercise)).toHaveAttribute('aria-expanded', 'false');
            await expect(bodyOf(exercise)).toBeHidden();
        }
    });

    test(`Should expand and collapse an exercise`, async ({ page }) => {
        const exercise = exercisesOf(page).first();
        const content = bodyOf(exercise);
        const button = buttonOf(exercise);

        await expandItem(exercise);
        await expect(content).toBeVisible();
        await expect(button).toHaveAttribute('aria-expanded', 'true');
        await expect(exercise.locator(testSelector('definition-list-description')).first()).toBeVisible();

        await button.click();
        await expect(exercise).not.toContainClass('collapse--expanded');
        await expect(content).toBeHidden();
        await expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    test(`Should keep other exercises collapsed when one is expanded`, async ({ page }) => {
        const exercises = exercisesOf(page);

        await expandItem(exercises.nth(1));

        await expect(exercises.nth(0)).not.toContainClass('collapse--expanded');
        await expect(exercises.nth(2)).not.toContainClass('collapse--expanded');
    });

    test(`Should expand a nested hint without collapsing the exercise`, async ({ page }) => {
        const exercise = exercisesOf(page).nth(1);
        await expandItem(exercise);

        const hint = itemsOf(exercise.locator(testSelector('definition-list')).first()).first();
        await expect(hint).toBeVisible();

        await expandItem(hint);

        await expect(hint.locator(testSelector('definition-list-description')).first()).toBeVisible();
        await expect(exercise).toContainClass('collapse--expanded');
        await expect(bodyOf(exercise)).toBeVisible();
    });

    test(`Should expand the example solution inside an exercise`, async ({ page }) => {
        const exercise = exercisesOf(page).first();
        await expandItem(exercise);

        const solution = exercise.locator(testSelector('code-collapse')).first();
        await expect(solution).toBeVisible();

        await solution.locator(testSelector('synopsis-ending')).click();
        await solution.locator(':scope.code-collapse--fully-opened').waitFor({ state: 'visible' });

        await expect(solution).toContainText('years old');
    });

    test(`Should run the playground inside an expanded exercise`, async ({ page }) => {
        const exercise = exercisesOf(page).last();
        await expandItem(exercise);

        // the playground has to be mounted even though the exercise body starts as hidden="until-found"
        const playground = exercise.locator('.kotlin-playground__wrapper').first();
        await expect(playground).toBeVisible();

        await playground.locator('.run-button').click();

        const output = playground.locator('.code-output');
        await output.waitFor({ state: 'visible' });
        await expect(output).toContainText('[1, 2, 3, 4, 5]');
    });

    test(`Should auto-expand an exercise when opened by deep link`, async ({ page }) => {
        // the id of a runnable block is consumed by the playground, so the solution block is used as the anchor
        const target = page.locator('#test-page-solution-2');
        const exercise = exercisesOf(page).nth(1);

        await expect(exercise).not.toContainClass('collapse--expanded');

        const deepLinkPage = new WebHelpPage(page, `${TEST_PAGE_URL}#test-page-solution-2`);
        await deepLinkPage.init();
        // a hash-only navigation doesn't reload the page, while such a link is normally opened from the outside
        await page.reload();
        await deepLinkPage.init();

        await expect(exercise).toContainClass('collapse--expanded');
        await expect(target).toBeInViewport();
    });

    for (const [resolutionName, resolution] of Object.entries(RESOLUTIONS)) {
        test(`Should render expanded exercise properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);

            const exercise = exercisesOf(page).nth(1);
            await expandItem(exercise);

            await exercise.scrollIntoViewIfNeeded();
            await checkScreenshot(exercise, { clip: ELEMENT_PADDING_OFFSET });
        });
    }
});
