import { expect, test } from '@playwright/test';
import { KotlinBenchmarkPage } from '../page/benchmark-page';

const EXPECTED_DATA_COLUMNS = 5;

const TASK_VIEWS = [
    { name: 'All tasks', query: '', count: 100, leader: 'Claude Code + Opus 5.5 high' },
    { name: 'Open-source tasks', query: 'open', count: 70, leader: 'Claude Code + Fable 5.1 high' },
    { name: 'Closed-source tasks', query: 'closed', count: 30, leader: 'Antigravity CLI + Gemini 3.8 Flash high' },
] as const;

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
        await expect(benchmark.heroIntro).toContainText('realistic, idiomatic Kotlin');
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

    test('tied resolution rates are ordered by lower cost first', async () => {
        const rates = (await benchmark.resolutionRateCells().allInnerTexts()).map((text) => parseFloat(text));
        const costs = (await benchmark.costCells().allInnerTexts()).map((text) => parseFloat(text));

        // Within each run of equal resolution rates, costs must be non-decreasing.
        for (let i = 1; i < rates.length; i++) {
            if (rates[i] === rates[i - 1]) {
                expect(costs[i]).toBeGreaterThanOrEqual(costs[i - 1]);
            }
        }
    });

    test('values are shown in their column formats', async () => {
        const rates = (await benchmark.resolutionRateCells().allInnerTexts()).map((text) => text.trim());
        const costs = (await benchmark.costCells().allInnerTexts()).map((text) => text.trim());
        const tokens = (await benchmark.tokensCells().allInnerTexts()).map((text) => text.trim());
        const latencies = (await benchmark.latencyCells().allInnerTexts()).map((text) => text.trim());
        const steps = (await benchmark.stepsCells().allInnerTexts()).map((text) => text.trim());

        expect(rates.length).toBeGreaterThan(0);

        // Units live in the column headers; resolution rates always show one decimal.
        for (const rate of rates) expect(rate).toMatch(/^\d+\.\d$/);
        // Cost and tokens keep at least two decimals.
        for (const value of [...costs, ...tokens]) expect(value).toMatch(/^\d+\.\d{2,}$/);
        for (const latency of latencies) expect(latency).toMatch(/^\d+(\.\d+)?$/);
        // Step counts are whole numbers.
        for (const step of steps) expect(step).toMatch(/^\d+$/);
    });

    test('ranks are sequential starting from 1', async () => {
        const ranks = (await benchmark.ranks.allInnerTexts()).map(Number);
        const expected = ranks.map((_, index) => index + 1);
        expect(ranks).toEqual(expected);
    });

    test('each data column header exposes a hint', async () => {
        await expect(benchmark.colHeaders).toHaveCount(EXPECTED_DATA_COLUMNS);

        await benchmark.colHeaders.first().hover();
        await expect(benchmark.page.getByText('Percentage of tasks that were resolved')).toBeVisible();
    });

    test('methodology-1 columns are not shown', async () => {
        for (const key of ['submitted', 'resolved', 'date']) {
            await expect(benchmark.page.locator(`[data-testid="bench-col-header"][data-col="${key}"]`)).toHaveCount(0);
        }
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

    test('methodology-2 editions carry no in-progress notice', async () => {
        await expect(benchmark.page.getByTestId('bench-notice')).toHaveCount(0);
    });

    test('the task switcher sits above the table and labels each view with its task count', async () => {
        await expect(benchmark.taskSwitcher).toBeVisible();

        for (const view of TASK_VIEWS) {
            await expect(benchmark.taskOption(view.name)).toHaveText(`${view.name} (${view.count})`);
        }

        const switcherBox = (await benchmark.taskSwitcher.getByRole('button').first().locator('..').boundingBox())!;
        const scrollBox = (await benchmark.tableScroll.boundingBox())!;
        expect(switcherBox.y + switcherBox.height).toBeLessThanOrEqual(scrollBox.y);

        // Centred on the table card.
        const centre = (box: { x: number; width: number }) => box.x + box.width / 2;
        expect(Math.abs(centre(switcherBox) - centre(scrollBox))).toBeLessThanOrEqual(2);
    });

    for (const view of TASK_VIEWS) {
        test(`"${view.name}" shows its own ranking and keeps it in the URL`, async ({ page }) => {
            await benchmark.taskOption(view.name).click();

            if (view.query) await expect(page).toHaveURL(new RegExp(`[?&]tasks=${view.query}`));
            else await expect(page).not.toHaveURL(/[?&]tasks=/);

            await expect(benchmark.rows.first().getByTestId('bench-setup')).toHaveText(view.leader);

            const rates = (await benchmark.resolutionRateCells().allInnerTexts()).map((text) => parseFloat(text));
            expect(rates).toEqual([...rates].sort((a, b) => b - a));
        });
    }

    test('a task view in the URL is selected on load', async ({ page }) => {
        const deepLinked = new KotlinBenchmarkPage(page);
        await deepLinked.init('?tasks=closed');

        await expect(deepLinked.rows.first().getByTestId('bench-setup')).toHaveText(TASK_VIEWS[2].leader);
    });

    test('the secondary navigation shows the leaderboard as the current page', async () => {
        await expect(benchmark.topMenu).toBeVisible();

        await expect(benchmark.topMenu.getByText('Leaderboard', { exact: true }).first()).toBeVisible();
        await expect(benchmark.topMenu.getByRole('link', { name: 'Leaderboard', exact: true })).toHaveCount(0);
    });

    test('methodology CTA links to the methodology page and GitHub', async () => {
        await expect(benchmark.page.getByTestId('bench-cta-title')).toContainText('How Kotlin Benchmark works');
        await expect(benchmark.methodologyCta).toHaveAttribute('href', /\/benchmark\/methodology\/?$/);
        await expect(benchmark.githubCta).toHaveAttribute('href', /github\.com/);
    });
});
