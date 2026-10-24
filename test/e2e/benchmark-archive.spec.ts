import { expect, test } from '@playwright/test';
import { KotlinBenchmarkArchivePage } from '../page/benchmark-archive-page';
import { KotlinBenchmarkPage } from '../page/benchmark-page';

// The newest archived edition, shown by default, and an older one; see data/benchmark/archive/.
const ARCHIVED_DATE = '2026-10-04';
const ARCHIVED_DATE_TEXT = '04.10.2026';
const OLDER_ARCHIVED_DATE = '2026-05-07';

// Publication date of the current leaderboard; see data/benchmark/leaderboard.yml.
const CURRENT_DATE_TEXT = '14.10.2026';

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

    test('the date appears once: as the selector, or as text when there is nothing to choose', async () => {
        const meta = archive.meta;
        if ((await archive.editions.count()) > 1) {
            await expect(archive.select).toContainText(ARCHIVED_DATE_TEXT);
            await expect(meta.getByTestId('bench-archive-edition-date')).toHaveCount(0);
        } else {
            await expect(archive.select).toHaveCount(0);
            await expect(meta.getByTestId('bench-archive-edition-date')).toHaveText(`Published ${ARCHIVED_DATE_TEXT}`);
        }
    });

    test('the header is centred like the current leaderboard', async () => {
        await expect(archive.title).toHaveCSS('text-align', 'center');
        await expect(archive.meta).toHaveCSS('justify-content', 'center');
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

    test('the archived edition predates the cost column', async () => {
        const edition = archive.visibleEdition();
        await expect(edition.locator('[data-testid="bench-col-header"][data-col="cost"]')).toHaveCount(0);
        await expect(edition.locator('[data-testid="bench-col-header"][data-col="date"]')).toHaveCount(1);
    });

    test('the methodology version links to its page', async () => {
        await expect(archive.meta.getByTestId('bench-archive-methodology')).toHaveText('Methodology 1.0');
        const link = archive.meta.getByTestId('bench-archive-methodology').getByRole('link');
        await expect(link).toHaveAttribute('href', /\/benchmark\/methodology\/1\/$/);
    });

    test('archived editions carry no in-progress notice', async () => {
        await expect(archive.notice).toHaveCount(0);
        await expect(archive.editions).not.toHaveCount(0);
    });

    test('the secondary navigation links to the current leaderboard', async () => {
        const topMenu = archive.page.getByTestId('top-menu');
        await expect(topMenu.getByRole('link', { name: 'Leaderboard', exact: true })).toHaveAttribute(
            'href',
            /\/benchmark\/$/
        );
        await expect(archive.meta.getByTestId('bench-archive-back')).toHaveCount(0);
    });

    test('ends with the leaderboard: each edition already links its methodology', async () => {
        await expect(archive.page.getByTestId('bench-cta')).toHaveCount(0);
    });

    test('a date in the URL selects that edition', async ({ page }) => {
        const deepLinked = new KotlinBenchmarkArchivePage(page);
        await deepLinked.init(`?date=${OLDER_ARCHIVED_DATE}`);

        await expect(deepLinked.visibleEdition()).toHaveAttribute('data-date', OLDER_ARCHIVED_DATE);
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
        await expect(benchmark.updatedDate).toContainText(CURRENT_DATE_TEXT);

        await expect(benchmark.archiveCta).toBeVisible();
        await expect(benchmark.archiveCta).toHaveAttribute('href', /\/benchmark\/archive\/?$/);
    });

    test('the publication date and archive link sit above the leaderboard', async ({ page }) => {
        const benchmark = new KotlinBenchmarkPage(page);
        await benchmark.init();

        const metaBottom = (await page.getByTestId('bench-archive-link').boundingBox())!;
        const tableTop = (await benchmark.table.boundingBox())!;
        expect(metaBottom.y + metaBottom.height).toBeLessThanOrEqual(tableTop.y);
    });
});
