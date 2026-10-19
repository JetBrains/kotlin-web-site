import { expect, Locator, Page, test } from '@playwright/test';
import { checkScreenshot, skipProduction, testSelector } from '@/test/utils';
import { ELEMENT_PADDING_OFFSET, RESOLUTIONS } from '../../visual-constants';
import { WebHelpPage } from '../page';
import { bodyOf, deflistIn, expandItem, itemsOf, TEST_PAGE_URL } from './utils';

const exercisesOf = (page: Page) => itemsOf(deflistIn(page, 'practice-with-tests'));

// the first playground of an exercise is the starter, the following ones are the example solutions
const playgroundsOf = (exercise: Locator) => exercise.locator('.kotlin-playground__wrapper');

const expandSolution = async (exercise: Locator, index: number) => {
    const solution = exercise.locator(testSelector('code-collapse')).nth(index);
    await solution.locator(testSelector('synopsis-ending')).click();
    await solution.locator(':scope.code-collapse--fully-opened').waitFor({ state: 'visible' });
};

const runPlayground = async (playground: Locator) => {
    await playground.locator('.run-button').click();

    const output = playground.locator('.code-output');
    await output.waitFor({ state: 'visible' });

    return output;
};

test.describe('Docs: Test Page practice exercises with JUnit tests', async () => {
    skipProduction();

    test.beforeEach(async ({ page }) => {
        const webHelpPage = new WebHelpPage(page, TEST_PAGE_URL);
        await webHelpPage.init();
    });

    test(`Should render JUnit exercises collapsed in a clear definition list without numbering`, async ({ page }) => {
        const practice = deflistIn(page, 'practice-with-tests');

        await expect(practice).toContainClass('definition-list--appearance-clear');
        await expect(practice).not.toContainClass('definition-list--numbered');

        const exercises = exercisesOf(page);
        await expect(exercises).toHaveCount(4);

        for (const exercise of await exercises.all()) {
            await expect(exercise).not.toContainClass('collapse--expanded');
            await expect(bodyOf(exercise)).toBeHidden();
        }
    });

    test(`Should show the starter without the hidden test files`, async ({ page }) => {
        const exercise = exercisesOf(page).first();
        await expandItem(exercise);

        const starter = playgroundsOf(exercise).first();
        await expect(starter).toBeVisible();
        await expect(starter).toContainText('Write your code here');
        await expect(starter).not.toContainText('ExerciseUtils');
    });

    test(`Should show a hint when the starter is run without a solution`, async ({ page }) => {
        const exercise = exercisesOf(page).first();
        await expandItem(exercise);

        const output = await runPlayground(playgroundsOf(exercise).first());

        await expect(output).toContainText('Add a println() call inside main().');
    });

    test(`Should pass the JUnit check when the example solution is run`, async ({ page }) => {
        const exercise = exercisesOf(page).first();
        await expandItem(exercise);
        await expandSolution(exercise, 0);

        const output = await runPlayground(playgroundsOf(exercise).nth(1));

        await expect(output).toContainText('Checked: the program prints exactly "Hello, Mary!".');
    });

    test(`Should show a hint for a value from the editable region`, async ({ page }) => {
        const exercise = exercisesOf(page).nth(1);
        await expandItem(exercise);

        const starter = playgroundsOf(exercise).first();
        await expect(starter).toContainText('val status = "Ready"');

        const output = await runPlayground(starter);

        await expect(output).toContainText('Print the status variable with println(status).');
    });

    test(`Should expand a nested hint without collapsing the JUnit exercise`, async ({ page }) => {
        const exercise = exercisesOf(page).nth(1);
        await expandItem(exercise);

        const hint = itemsOf(exercise.locator(testSelector('definition-list')).first()).first();
        await expect(hint).toBeVisible();

        await expandItem(hint);

        await expect(hint.locator(testSelector('definition-list-description')).first()).toBeVisible();
        await expect(exercise).toContainClass('collapse--expanded');
        await expect(bodyOf(exercise)).toBeVisible();
    });

    test(`Should escape values in the failure report of an expectation check`, async ({ page }) => {
        const exercise = exercisesOf(page).nth(2);
        await expandItem(exercise);

        const output = await runPlayground(playgroundsOf(exercise).first());

        // the starter still has TODO(), so the report names the exception and keeps the literal characters
        await expect(output).toContainText('Replace TODO() in greetingFor() with the greeting.');
        await expect(output).toContainText('greetingFor("Tom & Jerry") threw NotImplementedError');
        await expect(output).toContainText('<b>Hello, Tom & Jerry</b>');
        // the escaped expected value must not be rendered as a real element
        await expect(output.locator('b')).toHaveCount(0);
    });

    test(`Should pass the expectation check when the example solution is run`, async ({ page }) => {
        const exercise = exercisesOf(page).nth(2);
        await expandItem(exercise);
        await expandSolution(exercise, 0);

        const output = await runPlayground(playgroundsOf(exercise).nth(1));

        await expect(output).toContainText('greetingFor() wraps the name in the bold tag');
        // the solution prints the markup as text, so the learner's stdout must not become a real element
        await expect(output).toContainText('<b>Hello, Tom & Jerry</b>');
        await expect(output.locator('b')).toHaveCount(0);
    });

    test(`Should run both example solutions of one exercise`, async ({ page }) => {
        const exercise = exercisesOf(page).nth(3);
        await expandItem(exercise);
        await expandSolution(exercise, 0);
        await expandSolution(exercise, 1);

        const first = await runPlayground(playgroundsOf(exercise).nth(1));
        await expect(first).toContainText('Checked: the program prints exactly "Hello, Mary!".');

        const second = await runPlayground(playgroundsOf(exercise).nth(2));
        await expect(second).toContainText('Checked: the program prints exactly "Hello, Mary!".');
    });

    for (const [resolutionName, resolution] of Object.entries(RESOLUTIONS)) {
        test(`Should render expanded JUnit exercise properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);

            const exercise = exercisesOf(page).nth(1);
            await expandItem(exercise);

            await exercise.scrollIntoViewIfNeeded();
            await checkScreenshot(exercise, { clip: ELEMENT_PADDING_OFFSET });
        });
    }
});
