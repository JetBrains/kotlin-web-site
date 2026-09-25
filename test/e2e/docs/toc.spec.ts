import { expect, Locator, Page, test } from '@playwright/test';
import { checkScreenshot, skipProduction, testSelector } from '../../utils';
import { WebHelpPage } from './page';
import { RESOLUTIONS } from '../visual-constants';

const WELCOME_URL = '/docs/kotlin-tour-welcome.html';

// Progress is stored client-side by the WebHelp frontend as a JSON array of TOC page ids.
const PROGRESS_KEY = 'wrs.progress-completed';

// Lesson ids of the "Beginner" group, in the order declared in docs/kr.tree.
const BEGINNER_LESSONS = [
    'kotlin-tour-hello-world',
    'kotlin-tour-basic-types',
    'kotlin-tour-collections',
    'kotlin-tour-control-flow',
    'kotlin-tour-functions',
    'kotlin-tour-classes',
    'kotlin-tour-null-safety'
] as const;

const INTERMEDIATE_LESSONS_COUNT = 9;

async function seedProgress(page: Page, completedIds: readonly string[]) {
    await page.addInitScript(
        ([key, value]) => window.localStorage.setItem(key, value),
        [PROGRESS_KEY, JSON.stringify(completedIds)] as const
    );
}

function readProgress(page: Page): Promise<string[]> {
    return page.evaluate(key => JSON.parse(window.localStorage.getItem(key) || '[]'), PROGRESS_KEY);
}

async function openTourPage(page: Page, url: string) {
    const webHelpPage = new WebHelpPage(page, url);
    await webHelpPage.init();

    // The TOC is fetched from HelpTOC.json after hydration, the counter is the last thing to appear.
    await page.locator(testSelector('progress-counter')).first().waitFor({ state: 'visible' });
}

/**
 * Group rows have no `topic`, so they are rendered as a plain `div` with an exact `toc-item`
 * data-test, while lesson rows go through the internal link component and get an
 * `internal-link toc-item` one. Matching on the exact attribute keeps the two apart.
 */
function tocGroup(page: Page, title: string): Locator {
    return page.locator(testSelector('toc')).locator(testSelector('toc-item')).filter({ hasText: title });
}

function tocLesson(page: Page, lessonId: string): Locator {
    return page.locator(testSelector('toc')).locator(`li[data-toc-scroll="${lessonId}"]`);
}

// The checkmark carries no data-test attribute, its aria-label is the only semantic hook.
function completionMark(lesson: Locator): Locator {
    return lesson.locator('[aria-label="Completed"]');
}

test.describe('Docs: Kotlin tour progress in the table of contents', async () => {
    skipProduction();

    test('Should list tour lessons in the table of contents', async ({ page }) => {
        await openTourPage(page, `/docs/${BEGINNER_LESSONS[0]}.html`);

        for (const lessonId of BEGINNER_LESSONS) {
            const lesson = tocLesson(page, lessonId);

            await expect(lesson).toBeVisible();
            await expect(lesson.locator('a')).toHaveAttribute('href', `${lessonId}.html`);
        }

        await expect(tocLesson(page, BEGINNER_LESSONS[0]).locator('a')).toHaveAttribute(
            'data-test',
            'internal-link toc-item--selected'
        );
    });

    test('Should show a zero progress counter for a tour that was not started', async ({ page }) => {
        await openTourPage(page, WELCOME_URL);

        await expect(tocGroup(page, 'Beginner').locator(testSelector('progress-counter'))).toHaveText(
            `0/${BEGINNER_LESSONS.length}`
        );
        await expect(tocGroup(page, 'Intermediate').locator(testSelector('progress-counter'))).toHaveText(
            `0/${INTERMEDIATE_LESSONS_COUNT}`
        );

        await expect(page.locator(testSelector('toc')).locator('[aria-label="Completed"]')).toHaveCount(0);
    });

    test('Should mark completed lessons with a checkmark and count them', async ({ page }) => {
        const completed = BEGINNER_LESSONS.slice(0, 2);
        await seedProgress(page, completed);
        await openTourPage(page, `/docs/${BEGINNER_LESSONS[0]}.html`);

        await expect(tocGroup(page, 'Beginner').locator(testSelector('progress-counter'))).toHaveText(
            `${completed.length}/${BEGINNER_LESSONS.length}`
        );

        for (const lessonId of BEGINNER_LESSONS) {
            const mark = completionMark(tocLesson(page, lessonId));

            await expect(mark).toHaveCount(completed.includes(lessonId) ? 1 : 0);
        }
    });

    test('Should complete a lesson when the reader reaches its completion point', async ({ page }) => {
        const lessonId = BEGINNER_LESSONS[1];
        await openTourPage(page, `/docs/${lessonId}.html`);

        await expect(completionMark(tocLesson(page, lessonId))).toHaveCount(0);

        await page.locator('[data-completion-point]').first().scrollIntoViewIfNeeded();

        await expect.poll(() => readProgress(page)).toContain(lessonId);
        await expect(completionMark(tocLesson(page, lessonId))).toBeVisible();
        await expect(tocGroup(page, 'Beginner').locator(testSelector('progress-counter'))).toHaveText(
            `1/${BEGINNER_LESSONS.length}`
        );
    });

    test('Should render the table of contents properly on desktop', async ({ page }) => {
        await page.setViewportSize(RESOLUTIONS.desktop);
        await openTourPage(page, WELCOME_URL);

        await checkScreenshot(page.locator(testSelector('toc')));
    });

    test('Should render the table of contents with tour progress properly on desktop', async ({ page }) => {
        await page.setViewportSize(RESOLUTIONS.desktop);
        await seedProgress(page, BEGINNER_LESSONS.slice(0, 2));
        await openTourPage(page, `/docs/${BEGINNER_LESSONS[0]}.html`);

        await checkScreenshot(page.locator(testSelector('toc')));
    });
});

test.describe('Docs: Kotlin tour progress-aware buttons', async () => {
    skipProduction();

    const beginnerButton = (page: Page) => page.locator('#kotlin-tour-start-beginner');

    test('Should offer to start a tour that was not started', async ({ page }) => {
        await openTourPage(page, WELCOME_URL);

        await expect(beginnerButton(page)).toHaveText('Start');
        await expect(beginnerButton(page)).toHaveAttribute('href', `${BEGINNER_LESSONS[0]}.html`);
    });

    test('Should offer to continue from the first uncompleted lesson', async ({ page }) => {
        await seedProgress(page, [BEGINNER_LESSONS[0]]);
        await openTourPage(page, WELCOME_URL);

        await expect(beginnerButton(page)).toHaveText('Continue');
        await expect(beginnerButton(page)).toHaveAttribute('href', `${BEGINNER_LESSONS[1]}.html`);
    });

    test('Should offer to start over and reset the progress of a completed tour', async ({ page }) => {
        await seedProgress(page, BEGINNER_LESSONS);
        await openTourPage(page, WELCOME_URL);

        await expect(beginnerButton(page)).toHaveText('Start over');

        // Internal links are routed client-side, so the URL changes without a page load.
        await beginnerButton(page).click();
        await expect(page).toHaveURL(new RegExp(`/docs/${BEGINNER_LESSONS[0]}\\.html$`));

        await expect.poll(() => readProgress(page)).toEqual([]);
    });
});
