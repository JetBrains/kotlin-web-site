import { expect, Locator, Page, test } from '@playwright/test';
import { checkScreenshot, skipProduction, testSelector } from '@/test/utils';
import { ELEMENT_PADDING_OFFSET, RESOLUTIONS } from '../../visual-constants';
import { WebHelpPage } from '../page';
import { bodyOf, deflistIn, expandItem, itemsOf, TEST_PAGE_URL } from './utils';

const exercisesOf = (page: Page) => itemsOf(deflistIn(page, 'practice-with-tests'));

// the first playground of an exercise is the starter, the example solutions are plain code in the built frontend
const playgroundsOf = (exercise: Locator) => exercise.locator('.kotlin-playground__wrapper');

// the correct program is typed into the starter, because the example solutions don't get a run button
const typeIntoStarter = async (exercise: Locator, code: string) => {
    await playgroundsOf(exercise).first().locator('.CodeMirror').evaluate(
        (editor: HTMLElement & { CodeMirror: { setValue: (text: string) => void } }, text: string) =>
            editor.CodeMirror.setValue(text),
        code,
    );
};

const codeOf = async (exercise: Locator) =>
    playgroundsOf(exercise).first().locator('.CodeMirror').evaluate(
        (editor: HTMLElement & { CodeMirror: { getValue: () => string } }) => editor.CodeMirror.getValue(),
    );

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
        await expect(exercises).toHaveCount(5);

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

    test(`Should keep the test code out of the editable starter of every exercise`, async ({ page }) => {
        const exercises = exercisesOf(page);

        for (const exercise of await exercises.all()) {
            await expandItem(exercise);

            const code = await codeOf(exercise);
            expect(code).not.toContain('@Test');
            expect(code).not.toContain('class TestPage');
            expect(code).not.toContain('ExerciseUtils');
        }
    });

    test(`Should show a run button for every starter and keep the example solutions collapsed`, async ({ page }) => {
        const exercises = exercisesOf(page);

        for (const exercise of await exercises.all()) {
            await expandItem(exercise);

            await expect(playgroundsOf(exercise).first().locator('.run-button')).toHaveCount(1);
            for (const solution of await exercise.locator(testSelector('code-collapse')).all()) {
                await expect(solution).toContainClass('code-collapse--fully-closed');
            }
        }
    });

    test(`Should show a hint when the starter is run without a solution`, async ({ page }) => {
        const exercise = exercisesOf(page).first();
        await expandItem(exercise);

        const output = await runPlayground(playgroundsOf(exercise).first());

        await expect(output).toContainText('Add a println() call inside main().');
    });

    test(`Should not show an output block when the program prints nothing`, async ({ page }) => {
        const exercise = exercisesOf(page).first();
        await expandItem(exercise);

        const output = await runPlayground(playgroundsOf(exercise).first());

        await expect(output).toContainText('Add a println() call inside main().');
        await expect(output.locator('.test-output')).toHaveCount(0);
    });

    test(`Should show the learner's output under a failed check`, async ({ page }) => {
        const exercise = exercisesOf(page).first();
        await expandItem(exercise);
        await typeIntoStarter(exercise, 'fun main() {\n    println("Hello")\n}');

        const output = await runPlayground(playgroundsOf(exercise).first());

        await expect(output.locator('.console-icon.fail')).toHaveCount(1);
        await expect(output.locator('.test-fail')).toContainText('Print exactly "Hello, Mary!".');
        await expect(output.locator('.test-output')).toContainText('Hello');
    });

    test(`Should pass the JUnit check when the correct program is run`, async ({ page }) => {
        const exercise = exercisesOf(page).first();
        await expandItem(exercise);
        await typeIntoStarter(exercise, 'fun main() {\n    println("Hello, Mary!")\n}');

        const output = await runPlayground(playgroundsOf(exercise).first());

        await expect(output.locator('.console-icon.passed')).toHaveCount(1);
        await expect(output.locator('.test-passed')).toHaveCount(1);
        await expect(output).toContainText('Total test time');
        await expect(output.locator('.test-output')).toContainText('Checked: the program prints exactly "Hello, Mary!".');
    });

    test(`Should show the learner's value in the output of a passed editable-region exercise`, async ({ page }) => {
        const exercise = exercisesOf(page).nth(1);
        await expandItem(exercise);
        // the starter shows only the editable region, so the learner types just the line inside it
        await typeIntoStarter(exercise, 'println(status)');

        const output = await runPlayground(playgroundsOf(exercise).first());

        await expect(output.locator('.test-passed')).toHaveCount(1);
        await expect(output.locator('.test-output')).toContainText('Ready');
        await expect(output.locator('.test-output')).toContainText('The program prints the value of status on its own line.');
    });

    test(`Should show a hint for a value from the editable region`, async ({ page }) => {
        const exercise = exercisesOf(page).nth(1);
        await expandItem(exercise);

        const starter = playgroundsOf(exercise).first();
        await expect(starter).toContainText('val status = "Ready"');

        const output = await runPlayground(starter);

        await expect(output).toContainText('Print the status variable with println(status).');
    });

    test(`Should not show the editable region markers in the starter`, async ({ page }) => {
        const exercise = exercisesOf(page).nth(1);
        await expandItem(exercise);

        const code = await codeOf(exercise);
        expect(code).toContain('// Write your code here');
        expect(code).not.toContain('sampleStart');
        expect(code).not.toContain('sampleEnd');
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

    test(`Should pass the expectation check when the correct function is run`, async ({ page }) => {
        const exercise = exercisesOf(page).nth(2);
        await expandItem(exercise);
        await typeIntoStarter(exercise, 'fun greetingFor(name: String): String = "<b>Hello, $name</b>"\n\nfun main() {\n    println(greetingFor("Tom & Jerry"))\n}');

        const output = await runPlayground(playgroundsOf(exercise).first());

        await expect(output).toContainText('greetingFor() wraps the name in the bold tag');
        // the solution prints the markup as text, so the learner's stdout must not become a real element
        await expect(output).toContainText('<b>Hello, Tom & Jerry</b>');
        await expect(output.locator('b')).toHaveCount(0);
    });

    test(`Should run both correct programs of one exercise`, async ({ page }) => {
        const exercise = exercisesOf(page).nth(3);
        await expandItem(exercise);

        await typeIntoStarter(exercise, 'fun main() {\n    println("Hello, " + "Mary!")\n}');
        const first = await runPlayground(playgroundsOf(exercise).first());
        await expect(first).toContainText('Checked: the program prints exactly "Hello, Mary!".');

        await typeIntoStarter(exercise, 'fun main() {\n    val name = "Mary"\n    println("Hello, $name!")\n}');
        const second = await runPlayground(playgroundsOf(exercise).first());
        await expect(second).toContainText('Checked: the program prints exactly "Hello, Mary!".');
    });

    test(`Should show the learner's output in the last of several tests in one exercise`, async ({ page }) => {
        const exercise = exercisesOf(page).nth(4);
        await expandItem(exercise);
        await typeIntoStarter(exercise, 'fun main() {\n    println("Hello, Mary!")\n    println("Ready")\n}');

        const output = await runPlayground(playgroundsOf(exercise).first());

        await expect(output.locator('.console-block')).toHaveCount(2);
        await expect(output.locator('.test-passed')).toHaveCount(2);
        // the last test checks both lines, so its block shows what the learner's program printed
        await expect(output.locator('.console-block').last().locator('.test-output')).toContainText('Hello, Mary!');
        await expect(output.locator('.console-block').last().locator('.test-output')).toContainText('Ready');
    });

    test(`Should auto-expand a JUnit exercise when opened by deep link`, async ({ page }) => {
        // the id of a runnable block is consumed by the playground, so the solution block is used as the anchor
        const target = page.locator('#test-page-junit-solution-2');
        const exercise = exercisesOf(page).nth(1);

        await expect(exercise).not.toContainClass('collapse--expanded');

        const deepLinkPage = new WebHelpPage(page, `${TEST_PAGE_URL}#test-page-junit-solution-2`);
        await deepLinkPage.init();
        // a hash-only navigation doesn't reload the page, while such a link is normally opened from the outside
        await page.reload();
        await deepLinkPage.init();

        await expect(exercise).toContainClass('collapse--expanded');
        await expect(target).toBeInViewport();
    });

    for (const [resolutionName, resolution] of Object.entries(RESOLUTIONS)) {
        test(`Should render expanded JUnit exercise properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);

            const exercise = exercisesOf(page).nth(1);
            await expandItem(exercise);

            await exercise.scrollIntoViewIfNeeded();
            await checkScreenshot(exercise, { clip: ELEMENT_PADDING_OFFSET });
        });

        test(`Should render the output of a failed JUnit check properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);

            const exercise = exercisesOf(page).first();
            await expandItem(exercise);
            await typeIntoStarter(exercise, 'fun main() {\n    println("Hello")\n}');

            const output = await runPlayground(playgroundsOf(exercise).first());

            await checkScreenshot(output, { clip: ELEMENT_PADDING_OFFSET });
        });

        test(`Should render the output of a passed JUnit check properly on ${resolutionName}`, async ({ page }) => {
            await page.setViewportSize(resolution);

            const exercise = exercisesOf(page).first();
            await expandItem(exercise);
            await typeIntoStarter(exercise, 'fun main() {\n    println("Hello, Mary!")\n}');

            const output = await runPlayground(playgroundsOf(exercise).first());

            await checkScreenshot(output, { clip: ELEMENT_PADDING_OFFSET });
        });
    }
});
