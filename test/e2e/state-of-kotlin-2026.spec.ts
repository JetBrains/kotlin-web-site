import { expect, Locator, test } from '@playwright/test';
import { StateOfKotlin2026Page } from '../page/state-of-kotlin-2026-page';
import { REPORT_PDF_URL, REPORT_SECTION_URLS } from '../../blocks/state-of-kotlin-2026/constants';
import { KOTLIN_BENCHMARK_URL } from '../../blocks/benchmark/constants';

const SECTION_ORDER = [
    'sok-hero',
    'sok-questions',
    'sok-numbers',
    'sok-growth',
    'sok-organizations',
    'sok-backend',
    'sok-multiplatform',
    'sok-ai',
    'sok-download-cta',
    'sok-faq',
    'sok-methodology'
];

const NAV_ANCHORS = Object.keys(REPORT_SECTION_URLS);
const SECTION_NAV_MIN_WIDTH = 809;
const LEADERBOARD_ROWS = 5;
const LEADERBOARD_COLUMNS = 8;

const clickInViewportCenter = async (link: Locator) => {
    await link.evaluate((element) => element.scrollIntoView({ block: 'center' }));
    await link.click();
};

test.describe('State of Kotlin 2026 page', () => {
    let sok: StateOfKotlin2026Page;

    test.beforeEach(async ({ page }) => {
        sok = new StateOfKotlin2026Page(page);
        await sok.init();
    });

    test('renders every report section in order', async () => {
        await expect(sok.sections).toHaveCount(SECTION_ORDER.length);

        const rendered = await sok.sections.evaluateAll((nodes: HTMLElement[]) =>
            nodes.map((node) => node.dataset.testid)
        );
        expect(rendered).toEqual(SECTION_ORDER);

        await expect(sok.layout.locator('h1')).toHaveCount(1);
        await expect(sok.heroTitle).toBeVisible();
    });

    test('in-page links target existing unique sections', async ({ page }) => {
        const hrefs = await sok.questionLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
        const anchors = [...new Set([...hrefs.map((href) => href.slice(1)), ...NAV_ANCHORS])];

        expect(anchors.length).toBe(NAV_ANCHORS.length);

        for (const anchor of anchors) {
            await expect(page.locator(`section[id="${anchor}"]`)).toHaveCount(1);
        }
    });

    test('section nav activates and scrolls to the chosen section', async ({ page, viewport }) => {
        if (viewport && viewport.width < SECTION_NAV_MIN_WIDTH) {
            await expect(sok.sectionNav).toBeHidden();
            return;
        }

        await expect(sok.sectionNavOptions).toHaveCount(NAV_ANCHORS.length);

        for (const [index, anchor] of NAV_ANCHORS.entries()) {
            const option = sok.sectionNavOptions.nth(index);
            await option.click();

            await expect(option.locator(':scope[class*=_selected_]')).toBeVisible();
            await expect(page.locator(`#${anchor}`)).toBeInViewport();
        }
    });

    test('section nav puts the chosen section anchor into the URL', async ({ page, viewport }) => {
        if (viewport && viewport.width < SECTION_NAV_MIN_WIDTH) {
            await expect(sok.sectionNav).toBeHidden();
            return;
        }

        for (const [index, anchor] of NAV_ANCHORS.entries()) {
            await sok.sectionNavOptions.nth(index).click();

            await expect(page).toHaveURL(new RegExp(`/state-of-kotlin-2026/#${anchor}$`));
        }
    });

    test('section anchor from the URL selects the matching nav option', async ({ viewport }) => {
        const index = NAV_ANCHORS.indexOf('organizations');

        await sok.init(`#${NAV_ANCHORS[index]}`);

        if (viewport && viewport.width < SECTION_NAV_MIN_WIDTH) {
            await expect(sok.sectionNav).toBeHidden();
            return;
        }

        await expect(sok.selectedSectionNavOption).toHaveCount(1);
        await expect(sok.sectionNavOptions.nth(index).locator(':scope[class*=_selected_]')).toBeVisible();
    });

    test('question cards scroll to the sections they promise', async ({ page }) => {
        const hrefs = await sok.questionLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')));

        expect(hrefs.length).toBeGreaterThan(0);

        for (const [index, href] of hrefs.entries()) {
            await clickInViewportCenter(sok.questionLinks.nth(index));
            await expect(page.locator(href)).toBeInViewport();
        }
    });

    test('both report buttons open the same PDF in a new tab', async () => {
        for (const button of [sok.heroDownloadButton, sok.downloadCtaButton]) {
            await expect(button).toHaveAttribute('href', REPORT_PDF_URL);
            await expect(button).toHaveAttribute('target', '_blank');
            await expect(button).toHaveAttribute('rel', /noopener/);
        }
    });

    test('every go deeper banner opens its own part of the report', async () => {
        const hrefs: string[] = [];

        for (const anchor of NAV_ANCHORS) {
            const banner = sok.goDeeperBanner(anchor);

            await expect(banner).toHaveAttribute('target', '_blank');
            const href = await banner.getAttribute('href');
            expect(href).toContain(`${REPORT_PDF_URL}#`);
            hrefs.push(href);
        }

        expect(new Set(hrefs).size).toBe(hrefs.length);
    });

    test('share links point back to this page', async ({ page }) => {
        await expect(sok.heroShareLabel).toBeVisible();

        const encodedUrl = encodeURIComponent(page.url());
        const encodedTitle = encodeURIComponent(await page.title());
        const links = await sok.heroShareLinks.evaluateAll((nodes) =>
            nodes.map((node) => ({ href: node.getAttribute('href'), target: node.getAttribute('target') }))
        );

        expect(links.length).toBeGreaterThan(0);

        for (const link of links) {
            expect(link.href).toContain(encodedUrl);
            expect(link.target).toBe(link.href.startsWith('mailto:') ? null : '_blank');
        }

        expect(links.some((link) => link.href.includes(encodedTitle))).toBe(true);
    });

    test('company strip repeats its cards and pauses on hover', async () => {
        const cardCount = await sok.caseCards.count();

        expect(cardCount).toBeGreaterThan(0);
        await expect(sok.duplicatedCaseCards).toHaveCount(cardCount);
        await expect(sok.marqueeDuplicate).toHaveAttribute('aria-hidden', 'true');

        const playState = () => sok.marqueeTrack.evaluate((el) => getComputedStyle(el).animationPlayState);

        expect(await playState()).toBe('running');

        await sok.logoStrip.hover();
        await expect.poll(playState).toBe('paused');
    });

    test('every production case links out with a matching logo', async () => {
        const cards = await sok.caseCards.evaluateAll((nodes: HTMLAnchorElement[]) =>
            nodes.map((node) => ({
                company: node.dataset.company,
                href: node.getAttribute('href'),
                logoAlt: node.querySelector('img')?.getAttribute('alt')
            }))
        );

        for (const card of cards) {
            expect(card.company).toBeTruthy();
            expect(card.href).toMatch(/^(https?:\/\/|\/)/);
            expect(card.logoAlt).toBe(card.company);
        }

        expect(new Set(cards.map((card) => card.company)).size).toBe(cards.length);
        await expect(sok.industryLabels.first()).toBeVisible();
        expect(await sok.industryLabels.count()).toBeGreaterThan(0);
    });

    test('leaderboard shows the top setups ranked by resolution rate', async () => {
        await expect(sok.aiLeaderboardRows).toHaveCount(LEADERBOARD_ROWS);

        const ranks = (await sok.aiLeaderboardRanks.allInnerTexts()).map(Number);
        expect(ranks).toEqual(ranks.map((_, index) => index + 1));

        const rates = (await sok.leaderboardCells('resolutionRate').allInnerTexts()).map((text) => parseFloat(text));
        expect(rates).toEqual([...rates].sort((a, b) => b - a));
    });

    test('leaderboard is a labelled region with consistent columns', async () => {
        await expect(sok.aiLeaderboardScroll).toHaveAttribute('role', 'region');
        await expect(sok.aiLeaderboardScroll).toHaveAttribute('tabindex', '0');
        await expect(sok.aiLeaderboardScroll).toHaveAttribute('aria-label', /\S/);
        await expect(sok.aiLeaderboardHeaders).toHaveCount(LEADERBOARD_COLUMNS);

        const cellsPerRow = await sok.aiLeaderboardRows.evaluateAll((rows) =>
            rows.map((row) => row.querySelectorAll('td').length)
        );
        expect(cellsPerRow).toEqual(cellsPerRow.map(() => LEADERBOARD_COLUMNS));

        await expect(sok.aiLeaderboardCaption.locator('a')).toHaveAttribute('href', KOTLIN_BENCHMARK_URL);
    });

    test('AI section renders its charts, capabilities and cases', async () => {
        await expect(sok.aiValidationChart).toBeVisible();
        await expect(sok.aiCapabilityCards).toHaveCount(3);
        await expect(sok.aiAgentCards).toHaveCount(2);

        for (const card of await sok.aiAgentCards.all()) {
            await expect(card.locator('a')).toHaveAttribute('href', /^https?:\/\//);
        }
    });

    test('FAQ opens one answer at a time', async () => {
        expect(await sok.faqButtons.count()).toBeGreaterThan(1);
        await expect(sok.faqAnswers.first()).toBeHidden();

        await clickInViewportCenter(sok.faqButtons.first());
        await expect(sok.faqAnswers.first()).toBeVisible();

        await clickInViewportCenter(sok.faqButtons.nth(1));
        await expect(sok.faqAnswers.nth(1)).toBeVisible();
        await expect(sok.faqAnswers.first()).toBeHidden();

        await clickInViewportCenter(sok.faqButtons.nth(1));
        await expect(sok.faqAnswers.nth(1)).toBeHidden();
    });

    test('FAQ structured data matches the rendered questions', async () => {
        const schemas = await sok.faqSchema.evaluateAll((nodes) => nodes.map((node) => JSON.parse(node.textContent)));
        const faq = schemas.find((schema) => schema['@type'] === 'FAQPage');

        expect(faq).toBeDefined();

        const titles = (await sok.faqBlock.locator('[data-rs-internal=collapse__title]').allInnerTexts()).map((text) =>
            text.trim()
        );

        expect(faq.mainEntity.map((entity) => entity.name)).toEqual(titles);

        for (const entity of faq.mainEntity) {
            expect(entity.acceptedAnswer.text.length).toBeGreaterThan(0);
        }
    });

    test('all report images load', async () => {
        const broken = await sok.layout.locator('img').evaluateAll(async (images: HTMLImageElement[]) => {
            await Promise.all(
                images.map((image) => {
                    image.loading = 'eager';
                    return image.decode().catch(() => null);
                })
            );

            return images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.src);
        });

        expect(broken).toEqual([]);
    });

    test('page metadata is set for search and sharing', async ({ page }) => {
        const title = await page.title();

        expect(title.length).toBeGreaterThan(0);
        await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', /\/state-of-kotlin-2026\/$/);
        await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
        await expect(page.locator('meta[name=description]')).toHaveAttribute('content', /\S/);
    });
});
