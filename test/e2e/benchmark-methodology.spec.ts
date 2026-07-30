import { expect, test } from '@playwright/test';
import { KotlinBenchmarkMethodologyPage } from '../page/benchmark-methodology-page';
import { KotlinBenchmarkPage } from '../page/benchmark-page';

const EXPECTED_FUTURE_CARDS = 3;

test.describe('Kotlin Benchmark methodology page', () => {
    let methodology: KotlinBenchmarkMethodologyPage;

    test.beforeEach(async ({ page }) => {
        methodology = new KotlinBenchmarkMethodologyPage(page);
        await methodology.init();
    });

    test('renders the page title', async () => {
        await expect(methodology.title).toBeVisible();
        await expect(methodology.title).toContainText('Kotlin Benchmark');
    });

    test('shows all four content sections', async () => {
        for (const name of ['What we built', 'The Dataset', 'Methodology', 'Future outlook']) {
            await expect(methodology.sectionHeading(name)).toBeVisible();
        }
    });

    test('the dataset table lists every repository with its task count', async () => {
        await expect(methodology.datasetTable).toBeVisible();
        await expect(methodology.datasetRows).toBeVisible();

        // Repository names link out to GitHub.
        const ktlint = methodology.datasetRows.first().getByRole('link', { name: 'pinterest/ktlint' });
        await expect(ktlint).toHaveAttribute('href', 'https://github.com/ktlint/ktlint');
    });

    test('the "What we built" section links to Multi-SWE-bench', async () => {
        await expect(methodology.multiSweBenchLink).toHaveAttribute('href', 'https://github.com/multi-swe-bench');
        await expect(methodology.multiSweBenchLink).toHaveAttribute('target', '_blank');
    });

    test('the future outlook renders three cards', async () => {
        await expect(methodology.futureCards).toHaveCount(EXPECTED_FUTURE_CARDS);
        await expect(methodology.root.getByRole('heading', { name: 'Set of metrics' })).toBeVisible();
    });

    test('the subnavigation links back to the parent benchmark page', async () => {
        const parentLink = methodology.topMenu.getByRole('link', { name: 'Kotlin Benchmark', exact: true });
        await expect(parentLink).toBeVisible();
        await expect(parentLink).toHaveAttribute('href', /\/benchmark\/$/);

        // The current page is shown as the active (non-link) subnavigation item.
        const activeItem = methodology.topMenu.getByText('Methodology', { exact: true });
        await expect(activeItem.first()).toBeVisible();
    });

    test('the parent page "Our Methodology" CTA opens this page', async ({ page }) => {
        const benchmark = new KotlinBenchmarkPage(page);
        await benchmark.init();

        await benchmark.methodologyCta.click();

        await expect(page).toHaveURL(/\/benchmark\/methodology\/?$/);
        await expect(methodology.title).toBeVisible();
    });

    test('a call to action at the end links to the benchmark page', async ({ page }) => {
        await expect(methodology.benchmarkCta).toBeVisible();
        await expect(methodology.benchmarkCta).toHaveAttribute('href', /\/benchmark\/?$/);

        await methodology.benchmarkCta.click();
        await expect(page).toHaveURL(/\/benchmark\/?$/);
    });
});
