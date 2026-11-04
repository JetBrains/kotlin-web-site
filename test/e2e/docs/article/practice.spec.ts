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

        await expect(practice).toContainClass('definition-list--appearance-clear');
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

    test(`Should open a hint without collapsing the exercise`, async ({ page }) => {
        const exercise = exercisesOf(page).nth(1);
        await expandItem(exercise);

        // the hint is rendered as an assist chip under the exercise card, not as a nested definition list
        const hintChip = exercise.locator('.kotlin-playground__assist-chip[id$="-hints-chip"]');
        await expect(hintChip).toBeVisible();

        await hintChip.click();
        await expect(hintChip).toHaveAttribute('aria-expanded', 'true');

        const panel = exercise.locator('.kotlin-playground__assist-panel');
        await expect(panel).toBeVisible();
        await expect(panel).toContainText('Use the equality operator');

        // the exercise stays expanded while the hint is open
        await expect(exercise).toContainClass('collapse--expanded');
        await expect(bodyOf(exercise)).toBeVisible();
    });

    test(`Should open the example solution inside an exercise`, async ({ page }) => {
        const exercise = exercisesOf(page).first();
        await expandItem(exercise);

        const solutionChip = exercise.locator('.kotlin-playground__assist-chip[id$="-solution-chip"]');
        await expect(solutionChip).toBeVisible();

        await solutionChip.click();
        await expect(solutionChip).toHaveAttribute('aria-expanded', 'true');

        // the solution panel restores the code block with its stable id from the markdown source
        const solution = exercise.locator('#test-page-solution-1');
        await expect(solution).toBeVisible();
        await expect(solution).toContainText('years old');
    });

    test(`Should run the playground inside an expanded exercise`, async ({ page }) => {
        const exercise = exercisesOf(page).last();
        await expandItem(exercise);

        // the playground has to be mounted even though the exercise body starts as hidden="until-found"
        const playground = exercise.locator('.kotlin-playground__wrapper').first();
        await expect(playground).toBeVisible();

        await playground.locator('.kotlin-playground__controls-run').click();

        // the starter code is unsolved, so the run reports the failed source check from the checks file
        const result = playground.locator('.kotlin-playground__result');
        await result.waitFor({ state: 'visible' });
        await expect(result).toContainText('Validation failed');
        await expect(result).toContainText('Print the even numbers with filter');
    });

    test(`Should show only the program output on a passed exercise`, async ({ page }) => {
        const exercise = exercisesOf(page).first();
        await expandItem(exercise);

        const playground = exercise.locator('.kotlin-playground__wrapper').first();

        // replace the starter with the reference solution through the CodeMirror instance,
        // the same way the widget's own integration tests enter the learner's code
        const editor = playground.locator('.CodeMirror').first();
        const solution = [
            'fun main() {',
            '    val name = "Mary"',
            '    val age = 20',
            '    println("$name is $age years old")',
            '}',
        ].join('\n');
        await editor.evaluate((node, code) => {
            (node as HTMLElement & { CodeMirror?: { setValue: (value: string) => void } })
                .CodeMirror?.setValue(code);
        }, solution);

        await playground.locator('.kotlin-playground__controls-run').click();

        const result = playground.locator('.kotlin-playground__result');
        await result.waitFor({ state: 'visible' });

        // the passed card carries the heading and the program output only:
        // the success notes of the old widget are gone, so no note paragraph renders
        await expect(result).toContainText('Validation passed');
        await expect(result.locator('.kotlin-playground__result-text')).toHaveCount(0);
        await expect(result.locator('.kotlin-playground__result-output-text'))
            .toContainText('Mary is 20 years old');
    });

    test(`Should auto-expand an exercise when opened by deep link`, async ({ page }) => {
        // the solution block id is consumed by the lazy assist panel and doesn't exist until the panel
        // is opened, and the assist chips get random per-load ids, so the exercise's own id is the only
        // stable anchor. Once the build passes an explicit id to the solution chip, deep-link by it instead
        const target = page.locator('#test-page-practice-2');
        const exercise = exercisesOf(page).nth(1);

        await expect(exercise).not.toContainClass('collapse--expanded');

        const deepLinkPage = new WebHelpPage(page, `${TEST_PAGE_URL}#test-page-practice-2`);
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
