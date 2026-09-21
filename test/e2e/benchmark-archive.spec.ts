import { expect, test } from '@playwright/test';
import { KotlinBenchmarkArchivePage } from '../page/benchmark-archive-page';
import { KotlinBenchmarkPage } from '../page/benchmark-page';

// The only published edition today; see data/benchmark/archive/.
const ARCHIVED_DATE = '2026-05-07';
const ARCHIVED_DATE_TEXT = '07.05.2026';

test.describe('Kotlin Benchmark archive page', () => {
    let archive: KotlinBenchmarkArchivePage;

    test.beforeEach(async ({ page }) => {
        archive = new KotlinBenchmarkArchivePage(page);
        await archive.init();
    });

    test('renders the archive title', async () => {
        await expect(archive.title).toBeVisible();
        await expect(archive.title).toContainText('The Kotlin Benchmark Archive');
    });

    test('a single edition puts its date in the subtitle and hides the selector', async () => {
        const editionCount = await archive.editions.count();
        test.skip(editionCount !== 1, 'only meaningful while exactly one edition is published');

        await expect(archive.subtitle).toHaveText(ARCHIVED_DATE_TEXT);
        await expect(archive.select).toHaveCount(0);
        await expect(archive.editionTitles).toHaveCount(0);
    });

    test('exactly one edition is on screen', async () => {
        await expect(archive.visibleEdition()).toHaveCount(1);
    });

    test('the archived leaderboard renders ranked rows', async () => {
        // Hidden editions stay in the DOM, so assertions are scoped to the visible one.
        const edition = archive.visibleEdition();
        await expect(edition.getByTestId('bench-leaderboard-table')).toBeVisible();
        expect(await edition.getByTestId('bench-row').count()).toBeGreaterThan(0);

        const ranks = (await edition.getByTestId('bench-rank').allInnerTexts()).map(Number);
        expect(ranks).toEqual(ranks.map((_, index) => index + 1));
    });

    test('archived editions carry no in-progress notice', async () => {
        await expect(archive.notice).toHaveCount(0);
        await expect(archive.editions).not.toHaveCount(0);
    });

    test('links back to the current leaderboard', async () => {
        await expect(archive.backLink).toHaveAttribute('href', /\/benchmark\/?$/);
    });

    test('keeps the methodology and GitHub CTA', async () => {
        await expect(archive.methodologyCta).toHaveAttribute('href', /\/benchmark\/methodology\/?$/);
        await expect(archive.githubCta).toHaveAttribute('href', /github\.com/);
    });

    test('a date in the URL selects that edition', async ({ page }) => {
        const deepLinked = new KotlinBenchmarkArchivePage(page);
        await deepLinked.init(`?date=${ARCHIVED_DATE}`);

        await expect(deepLinked.visibleEdition()).toHaveAttribute('data-date', ARCHIVED_DATE);
    });

    test('an unknown date in the URL falls back to the newest edition', async ({ page }) => {
        const fallback = new KotlinBenchmarkArchivePage(page);
        await fallback.init('?date=1999-01-01');

        await expect(fallback.visibleEdition()).toHaveCount(1);
        await expect(fallback.visibleEdition()).toHaveAttribute('data-date', ARCHIVED_DATE);
    });
});

test.describe('Kotlin Benchmark landing page — archive entry point', () => {
    test('shows the publication date and a link to the archive', async ({ page }) => {
        const benchmark = new KotlinBenchmarkPage(page);
        await benchmark.init();

        await expect(benchmark.updatedDate).toBeVisible();
        await expect(benchmark.updatedDate).toContainText(ARCHIVED_DATE_TEXT);

        await expect(benchmark.archiveCta).toBeVisible();
        await expect(benchmark.archiveCta).toHaveAttribute('href', /\/benchmark\/archive\/?$/);
    });
});
