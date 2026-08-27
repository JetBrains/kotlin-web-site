import { expect, test } from '@playwright/test';
import { StateOfKotlin2026Page } from '../page/state-of-kotlin-2026-page';
import { KotlinBenchmarkPage } from '../page/benchmark-page';

/** Every network in the hero share row, with the host its link must point at. */
const SHARE_TARGETS = [
    { name: 'Share on X', host: 'x.com' },
    { name: 'Share on Facebook', host: 'www.facebook.com' },
    { name: 'Share on LinkedIn', host: 'www.linkedin.com' },
    { name: 'Share on Reddit', host: 'www.reddit.com' },
    { name: 'Share by email', host: null }
];

/** How many setups the report's leaderboard excerpt lists. */
const LEADERBOARD_ROW_COUNT = 5;

/** The AI block's panel headings, in the order the design stacks them. */
const AI_PANEL_TITLES = [
    'AI-assisted Kotlin development',
    'Verified by developers',
    'Measured in the open: the Kotlin Benchmark',
    'The Kotlin Benchmark Leaderboard',
    'Build AI in Kotlin',
    'Agents in Production'
];

/** The "How developers validate AI-generated Kotlin code" chart, as `[label, value]` rows. */
const VALIDATION_CHART_ROWS = [
    ['Review the code manually', '88%'],
    ['Run the code', '75%'],
    ['Run or write tests', '66%'],
    ['Check against documentation', '21%'],
    ['No validation', '0.3%']
];

/** The tags on each "Build AI in Kotlin" card, in card order. */
const CAPABILITY_TAGS = [
    ['Official model SDKs', 'Ktor HTTP client', 'Typed request/response'],
    ['Spring AI', 'Ktor'],
    ['Koog 1.0', 'Kotlin MCP SDK']
];

/** Every company on the production strip, sorted the way `visibleCompanies()` returns them. */
const ALL_COMPANIES = [
    'Amazon',
    'Bolt',
    'Cash App',
    'Duolingo',
    'Forbes',
    'Google',
    'ING',
    "McDonald's",
    'Philips',
    'Wolt',
    'Worldline',
];

/** The industry labels above the strip, in the order the design lists them. */
const INDUSTRIES = [
    'Software development',
    'Cloud',
    'Fintech',
    'Healthcare',
    'Education',
    'Media',
    'Consumer services',
];

test.describe('State of Kotlin 2026 landing page', async () => {
    test('State of Kotlin 2026: check hero block content', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        await expect(sokPage.heroTitle).toBeVisible();
        await expect(sokPage.heroTitle).not.toBeEmpty();

        await expect(sokPage.heroDownloadButton).toBeVisible();
        await expect(sokPage.heroDownloadButton).toContainText('Download the full report');
    });

    test('State of Kotlin 2026: hero share row exposes every network', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        await expect(sokPage.heroShareLabel).toBeVisible();
        await expect(sokPage.heroShareLinks).toHaveCount(SHARE_TARGETS.length);

        for (const { name } of SHARE_TARGETS) {
            await expect(sokPage.heroShareLink(name)).toBeVisible();
        }
    });

    test('State of Kotlin 2026: hero share links point at the current page', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        const pageUrl = page.url();

        for (const { name, host } of SHARE_TARGETS) {
            const href = await sokPage.heroShareLink(name).getAttribute('href');

            if (host === null) {
                // the email link is a mailto:, so the page url travels in the body
                expect(href).toContain('mailto:?');
                expect(href).toContain(encodeURIComponent(pageUrl));
                continue;
            }

            const shareUrl = new URL(href!);
            expect(shareUrl.hostname).toBe(host);
            expect(href).toContain(encodeURIComponent(pageUrl));
        }
    });

    test('State of Kotlin 2026: hero share opens in a new tab, except email', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        for (const { name, host } of SHARE_TARGETS) {
            const link = sokPage.heroShareLink(name);

            if (host === null) {
                // a mailto: link must stay in the current tab, otherwise it leaves a blank one behind
                expect(await link.getAttribute('target')).toBeNull();
                continue;
            }

            await expect(link).toHaveAttribute('target', '_blank');
            await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
    });

    test('State of Kotlin 2026: organizations lists the industries as static labels', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        // toHaveText reads textContent, so it sees the markup's own casing
        await expect(sokPage.industryLabels).toHaveText(INDUSTRIES);

        // the labels replaced a chip list, so nothing here may be clickable any more
        await expect(sokPage.industryList.locator('a, button, [role="tab"]')).toHaveCount(0);

        // the design upper-cases them in CSS, which is what the reader actually sees
        const rendered = await sokPage.industryLabels.evaluateAll((labels) =>
            labels.map((label) => (label as HTMLElement).innerText)
        );
        expect(rendered).toEqual(INDUSTRIES.map((name) => name.toUpperCase()));
    });

    test('State of Kotlin 2026: organizations strip shows every company', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        await expect(sokPage.logoStrip).toBeVisible();
        expect(await sokPage.visibleCompanies()).toEqual(ALL_COMPANIES);
    });

    test('State of Kotlin 2026: organizations cards are logo plus outcome, with no links', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        // a mistyped path among eleven new logos is the likeliest regression here
        const logosLoaded = await sokPage.caseCards
            .locator('img')
            .evaluateAll((images) => images.every((image) => (image as HTMLImageElement).naturalWidth > 0));
        expect(logosLoaded).toBe(true);

        for (const company of ALL_COMPANIES) {
            const card = sokPage.caseCards.filter({ has: page.locator(`img[alt="${company}"]`) }).first();
            await expect(card).not.toBeEmpty();
        }

        await expect(sokPage.caseCards.locator('a')).toHaveCount(0);
        await expect(sokPage.caseCards.locator('button')).toHaveCount(0);
    });

    test('State of Kotlin 2026: no organizations card clips its outcome text', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        // the cards are a fixed height, so longer copy would overflow rather than reflow
        const overflowing = await sokPage.caseCards.evaluateAll((cards) =>
            cards
                .map((card) => {
                    const text = card.querySelector('p')!;
                    const paddingBottom = parseFloat(getComputedStyle(card).paddingBottom);
                    const spare =
                        card.getBoundingClientRect().bottom - paddingBottom - text.getBoundingClientRect().bottom;

                    return { company: (card as HTMLElement).dataset.company, spare: Math.round(spare) };
                })
                .filter((card) => card.spare < 0)
        );

        expect(overflowing).toEqual([]);
    });

    test('State of Kotlin 2026: organizations strip announces its cards once', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        // the duplicated track exists for the loop only, so it must not be announced twice
        await expect(sokPage.marqueeDuplicate).toHaveAttribute('aria-hidden', 'true');
    });

    test('State of Kotlin 2026: organizations strip pauses on hover', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        const track = sokPage.logoStrip.getByTestId('marquee-component');
        const playState = () => track.evaluate((el) => getComputedStyle(el).animationPlayState);

        expect(await playState()).toBe('running');

        await sokPage.logoStrip.hover();
        await expect.poll(playState).toBe('paused');

        await sokPage.heroTitle.hover();
        await expect.poll(playState).toBe('running');
    });

    test.describe('with reduced motion', () => {
        test.use({ contextOptions: { reducedMotion: 'reduce' } });

        test('State of Kotlin 2026: organizations strip stops animating', async ({ page }) => {
            const sokPage = new StateOfKotlin2026Page(page);
            await sokPage.init();

            const track = sokPage.logoStrip.getByTestId('marquee-component');
            expect(await track.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');

            await expect(sokPage.marqueeDuplicate).toBeHidden();
        });
    });

    test('State of Kotlin 2026: AI block shows every panel heading in order', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        await expect(sokPage.aiBlock.getByRole('heading', { level: 3 })).toHaveText(AI_PANEL_TITLES);
    });

    test('State of Kotlin 2026: AI validation chart reports every answer', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        await expect(sokPage.aiValidationChart).toBeVisible();
        expect(await sokPage.validationChartRows()).toEqual(VALIDATION_CHART_ROWS);
    });

    test('State of Kotlin 2026: Build AI cards carry their tags', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        await expect(sokPage.aiCapabilityCards).toHaveCount(CAPABILITY_TAGS.length);

        for (let index = 0; index < CAPABILITY_TAGS.length; index++) {
            const card = sokPage.aiCapabilityCards.nth(index);

            for (const tag of CAPABILITY_TAGS[index]) {
                await expect(card.getByText(tag, { exact: true })).toBeVisible();
            }
        }
    });

    test('State of Kotlin 2026: Build AI cards are staggered from a common baseline', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        const edges = await sokPage.aiCapabilityCards.evaluateAll((cards) =>
            cards.map((card) => {
                const { top, bottom } = card.getBoundingClientRect();
                return { top: Math.round(top), bottom: Math.round(bottom) };
            })
        );

        // the design offsets each card upwards but keeps every bottom edge flush with the row
        expect(new Set(edges.map((edge) => edge.bottom)).size).toBe(1);
        expect(edges.map((edge) => edge.top)).toEqual([...edges.map((edge) => edge.top)].sort((a, b) => b - a));
    });

    test('State of Kotlin 2026: Agents in Production shows both cases', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        await expect(sokPage.aiAgentCards).toHaveCount(2);

        const mercedes = sokPage.aiAgentCards.nth(0);
        await expect(mercedes.getByRole('heading', { name: 'Mercedes-Benz.io' })).toBeVisible();
        await expect(mercedes.getByText('Bruno Ferreira')).toBeVisible();
        await expect(mercedes.getByRole('link', { name: 'Read the full story' })).toBeVisible();

        const worldline = sokPage.aiAgentCards.nth(1);
        await expect(worldline.getByRole('heading', { name: 'Worldline' })).toBeVisible();
        await expect(worldline.getByRole('link', { name: 'Watch video' })).toBeVisible();
    });

    test('State of Kotlin 2026: AI case links darken their underline on hover', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        const link = sokPage.aiAgentCards.nth(0).getByRole('link', { name: 'Read the full story' });

        await expect(link).toHaveCSS('text-decoration-color', 'rgba(25, 25, 28, 0.4)');
        await link.hover();
        await expect(link).toHaveCSS('text-decoration-color', 'rgba(25, 25, 28, 0.8)');
    });

    test('State of Kotlin 2026: benchmark link uses the rescui link', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        const link = sokPage.aiBlock.getByRole('link', { name: 'Compare AI agents on the Kotlin Benchmark' });
        await expect(link).toBeVisible();

        // rescui draws the underline as a border and darkens it on hover
        await expect(link).toHaveCSS('border-bottom-color', 'rgba(25, 25, 28, 0.4)');
        await link.hover();
        await expect(link).toHaveCSS('border-bottom-color', 'rgb(25, 25, 28)');
    });

    test('State of Kotlin 2026: leaderboard lists the leading setups in rank order', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        await expect(sokPage.aiLeaderboardRows).toHaveCount(LEADERBOARD_ROW_COUNT);

        const ranks = (await sokPage.aiLeaderboardRanks.allInnerTexts()).map(Number);
        expect(ranks).toEqual([1, 2, 3, 4, 5]);

        // the pending evaluations sit above the ranked rows, as on /benchmark/
        await expect(page.getByTestId('sok-ai-leaderboard-notice')).toContainText('Evaluating');
    });

    test('State of Kotlin 2026: leaderboard is the top of the full benchmark table', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();
        const excerpt = await sokPage.leaderboardSetups();

        const benchmark = new KotlinBenchmarkPage(page);
        await benchmark.init();
        const full = await benchmark.page.getByTestId('bench-setup').allInnerTexts();

        // both tables read the same source through the same formatters, so the excerpt is a prefix
        expect(excerpt).toEqual(full.slice(0, LEADERBOARD_ROW_COUNT).map((setup) => setup.trim()));
    });

    test('State of Kotlin 2026: leaderboard scrolls sideways instead of reflowing', async ({ page }) => {
        await page.setViewportSize({ width: 400, height: 900 });

        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        // the design keeps the full-width table at every breakpoint and scrolls it in place
        const { table, visible, fade } = await sokPage.aiLeaderboardScroll.evaluate((box) => ({
            table: box.scrollWidth,
            visible: box.clientWidth,
            fade: getComputedStyle(box).maskImage
        }));

        expect(table).toBeGreaterThan(visible);
        await expect(sokPage.aiLeaderboardRows).toHaveCount(LEADERBOARD_ROW_COUNT);

        // the cut-off column fades into the panel, as the design draws it
        expect(fade).toContain('gradient');
    });

    test('State of Kotlin 2026: leaderboard has no fade when the whole table fits', async ({ page }) => {
        // at 1191px and up the content column is 1080px, exactly what the table needs
        await page.setViewportSize({ width: 1400, height: 900 });

        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        const { table, visible, fade } = await sokPage.aiLeaderboardScroll.evaluate((box) => ({
            table: box.scrollWidth,
            visible: box.clientWidth,
            fade: getComputedStyle(box).maskImage
        }));

        expect(table).toEqual(visible);
        expect(fade).toBe('none');
    });

    test('State of Kotlin 2026: leaderboard caption links to the full benchmark', async ({ page }) => {
        const sokPage = new StateOfKotlin2026Page(page);
        await sokPage.init();

        await expect(sokPage.aiLeaderboardCaption).toContainText('Leaderboard snapshot as of');

        const link = sokPage.aiLeaderboardCaption.getByRole('link', { name: 'kotlinlang.org/benchmark' });
        await expect(link).toHaveAttribute('href', /\/benchmark\/?$/);
    });

});
