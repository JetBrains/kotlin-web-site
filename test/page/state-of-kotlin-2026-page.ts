import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class StateOfKotlin2026Page implements BasePage {
    readonly page: Page;
    readonly layout: Locator;
    readonly sections: Locator;
    readonly sectionNav: Locator;
    readonly sectionNavOptions: Locator;
    readonly selectedSectionNavOption: Locator;
    readonly heroBlock: Locator;
    readonly heroTitle: Locator;
    readonly heroDownloadButton: Locator;
    readonly heroShareLabel: Locator;
    readonly heroShareLinks: Locator;
    readonly questionLinks: Locator;
    readonly industryPanel: Locator;
    readonly industryList: Locator;
    readonly industryLabels: Locator;
    readonly logoStrip: Locator;
    readonly marqueeTrack: Locator;
    readonly marqueeDuplicate: Locator;
    readonly caseCards: Locator;
    readonly duplicatedCaseCards: Locator;
    readonly aiBlock: Locator;
    readonly aiValidationChart: Locator;
    readonly aiCapabilityCards: Locator;
    readonly aiAgentCards: Locator;
    readonly aiLeaderboard: Locator;
    readonly aiLeaderboardScroll: Locator;
    readonly aiLeaderboardHeaders: Locator;
    readonly aiLeaderboardRows: Locator;
    readonly aiLeaderboardRanks: Locator;
    readonly aiLeaderboardCaption: Locator;
    readonly downloadCtaButton: Locator;
    readonly faqBlock: Locator;
    readonly faqItems: Locator;
    readonly faqButtons: Locator;
    readonly faqAnswers: Locator;
    readonly faqSchema: Locator;

    constructor(page: Page) {
        this.page = page;

        this.layout = page.getByTestId('state-of-kotlin-2026-page');
        this.sections = this.layout.locator('section[data-testid]');

        this.sectionNav = page.getByTestId('sok-section-nav');
        this.sectionNavOptions = this.sectionNav.locator('[data-rs-internal=switcher__option]');
        this.selectedSectionNavOption = this.sectionNavOptions.locator(':scope[class*=_selected_]');

        this.heroBlock = page.getByTestId('sok-hero');
        this.heroTitle = page.getByTestId('sok-hero-title');
        this.heroDownloadButton = page.getByTestId('sok-hero-download');
        this.heroShareLabel = this.heroBlock.getByText('Share', { exact: true });
        this.heroShareLinks = this.heroBlock.locator('a[title^="Share"]');

        this.questionLinks = page.getByTestId('sok-questions').locator('a[href^="#"]');

        this.industryPanel = page.getByTestId('sok-organizations-industry-panel');
        this.industryList = page.getByTestId('sok-organizations-industries');
        this.industryLabels = page.getByTestId('sok-organizations-industry');

        this.logoStrip = page.getByTestId('sok-organizations-logo-strip');
        this.marqueeTrack = this.logoStrip.getByTestId('marquee-component');
        this.marqueeDuplicate = this.logoStrip.getByTestId('marquee-duplicate');
        this.caseCards = this.marqueeTrack.getByTestId('sok-organizations-case-card');
        this.duplicatedCaseCards = this.marqueeDuplicate.getByTestId('sok-organizations-case-card');

        this.aiBlock = page.getByTestId('sok-ai');
        this.aiValidationChart = page.getByTestId('sok-ai-validation-chart');
        this.aiCapabilityCards = this.aiBlock.locator('[data-testid^="sok-ai-capability-"]');
        this.aiAgentCards = this.aiBlock.locator('[data-testid^="sok-ai-case-"]');

        this.aiLeaderboard = page.getByTestId('sok-ai-leaderboard');
        this.aiLeaderboardScroll = page.getByTestId('sok-ai-leaderboard-scroll');
        this.aiLeaderboardHeaders = page.getByTestId('sok-ai-leaderboard-table').locator('thead th');
        this.aiLeaderboardRows = page.getByTestId('sok-ai-leaderboard-row');
        this.aiLeaderboardRanks = page.getByTestId('sok-ai-leaderboard-rank');
        this.aiLeaderboardCaption = page.getByTestId('sok-ai-leaderboard-caption');

        this.downloadCtaButton = page.getByTestId('sok-download-cta-button');

        this.faqBlock = page.getByTestId('sok-faq');
        this.faqItems = this.faqBlock.locator('[data-rs-internal=collapse__collapse]');
        this.faqButtons = this.faqBlock.locator('[data-rs-internal=collapse__button]');
        this.faqAnswers = this.faqBlock.locator('[data-rs-internal=collapse__content]');
        this.faqSchema = page.locator('script[type="application/ld+json"]');
    }

    /** "Go deeper" banner of the given report section. */
    goDeeperBanner(section: string): Locator {
        return this.page.getByTestId(`sok-${section}-cta`);
    }

    /** Position of the highlighted nav option, or -1 when nothing is highlighted. */
    async selectedSectionNavIndex(): Promise<number> {
        return this.sectionNavOptions.evaluateAll((options) =>
            options.findIndex((option) => option.className.includes('_selected_'))
        );
    }

    async scrollToSection(anchor: string) {
        await this.page.locator(`#${anchor}`).evaluate((section) => section.scrollIntoView());
    }

    /** Leaderboard cells of the given column, in row order. */
    leaderboardCells(column: string): Locator {
        return this.aiLeaderboardRows.locator(`td[data-col="${column}"]`);
    }

    async init(hash = '') {
        await this.page.goto(`/state-of-kotlin-2026/${hash}`);

        await Promise.all([this.layout.waitFor(), this.page.locator('html.hydrated').waitFor()]);
    }
}
