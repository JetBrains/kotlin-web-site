import { expect, test } from '@playwright/test';
import { KotlinBenchmarkPage } from '../page/kotlin-benchmark-page';

const EXPECTED_DATA_COLUMNS = 6;

test.describe('Kotlin Benchmark landing page', () => {
    let benchmark: KotlinBenchmarkPage;

    test.beforeEach(async ({ page }) => {
        benchmark = new KotlinBenchmarkPage(page);
        await benchmark.init();
    });

    test('hero renders the title and intro', async () => {
        await expect(benchmark.heroTitle).toBeVisible();
        await expect(benchmark.heroTitle).toContainText('Kotlin Benchmark');

        await expect(benchmark.heroIntro).toBeVisible();
        await expect(benchmark.heroIntro).toContainText('continuous initiative');
    });

    test('leaderboard renders every row', async () => {
        await expect(benchmark.table).toBeVisible();
    });

    test('rows are sorted by resolution rate descending', async () => {
        const texts = await benchmark.resolutionRateCells().allInnerTexts();
        const rates = texts.map((text) => parseFloat(text));

        const sorted = [...rates].sort((a, b) => b - a);
        expect(rates).toEqual(sorted);
    });

    test('ranks are sequential starting from 1', async () => {
        const ranks = (await benchmark.ranks.allInnerTexts()).map(Number);
        const expected = ranks.map((_, index) => index + 1);
        expect(ranks).toEqual(expected);
    });

    test('each data column header exposes a hint', async () => {
        await expect(benchmark.colHeaders).toHaveCount(EXPECTED_DATA_COLUMNS);

        await benchmark.colHeaders.first().hover();
        await expect(benchmark.page.getByText('Total tasks submitted for evaluation')).toBeVisible();
    });

    test('the top three rank numbers use a distinct highlight colour', async () => {
        const rankColor = (rowIndex: number) =>
            benchmark.rows
                .nth(rowIndex)
                .getByTestId('bench-rank')
                .evaluate((el) => getComputedStyle(el).backgroundColor);

        const highlighted = await rankColor(0);
        const plain = await rankColor(3);

        // The leading rows share one colour that differs from the rest.
        expect(highlighted).not.toBe(plain);
        expect(await rankColor(1)).toBe(highlighted);
        expect(await rankColor(2)).toBe(highlighted);
    });

    test('table header stays pinned to the viewport on page scroll', async ({ page }) => {
        const result = await page.evaluate(async () => {
            // Disable smooth scrolling so the jump is instant within the test.
            document.documentElement.style.scrollBehavior = 'auto';
            const table = document.querySelector('[data-testid="bench-leaderboard-table"]') as HTMLElement;
            const th = table.querySelector('thead th') as HTMLElement;
            // Scroll the page past the top of the leaderboard.
            const tableTop = table.getBoundingClientRect().top + window.scrollY;
            window.scrollTo(0, tableTop + 250);
            await new Promise((resolve) => setTimeout(resolve, 400));
            return { scrollY: window.scrollY, headerTop: th.getBoundingClientRect().top };
        });

        // The page scrolled and the header is pinned at the top of the viewport.
        expect(result.scrollY).toBeGreaterThan(0);
        expect(result.headerTop).toBeGreaterThanOrEqual(-1);
        expect(result.headerTop).toBeLessThanOrEqual(4);
    });

    test('methodology CTA links to the methodology page and GitHub', async () => {
        await expect(benchmark.page.getByTestId('bench-cta-title')).toContainText('How Kotlin Benchmark works');
        await expect(benchmark.methodologyCta).toHaveAttribute('href', /\/kotlin-benchmark\/methodology\/?$/);
        await expect(benchmark.githubCta).toHaveAttribute('href', /github\.com/);
    });
});
