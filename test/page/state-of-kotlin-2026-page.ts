import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class StateOfKotlin2026Page implements BasePage {
    readonly page: Page;
    readonly layout: Locator;
    readonly heroBlock: Locator;
    readonly heroTitle: Locator;
    readonly heroDownloadButton: Locator;
    readonly heroShareLabel: Locator;
    readonly heroShareLinks: Locator;
    readonly industryPanel: Locator;
    readonly industryList: Locator;
    readonly industryLabels: Locator;
    readonly logoStrip: Locator;
    readonly caseCards: Locator;
    readonly marqueeDuplicate: Locator;
    readonly aiBlock: Locator;
    readonly aiValidationChart: Locator;
    readonly aiCapabilityCards: Locator;
    readonly aiAgentCards: Locator;
    readonly aiLeaderboard: Locator;
    readonly aiLeaderboardScroll: Locator;
    readonly aiLeaderboardRows: Locator;
    readonly aiLeaderboardRanks: Locator;
    readonly aiLeaderboardCaption: Locator;

    constructor(page) {
        this.page = page;

        this.layout = page.getByTestId('state-of-kotlin-2026-page');
        this.heroBlock = page.getByTestId('sok-hero');
        this.heroTitle = page.getByTestId('sok-hero-title');
        this.heroDownloadButton = page.getByTestId('sok-hero-download');
        this.heroShareLabel = this.heroBlock.getByText('Share', { exact: true });
        this.heroShareLinks = this.heroBlock.getByRole('link', { name: /^Share (on|by)/ });

        this.industryPanel = page.getByTestId('sok-organizations-industry-panel');
        this.industryList = page.getByTestId('sok-organizations-industries');
        this.industryLabels = this.industryList.getByTestId('sok-organizations-industry');
        this.logoStrip = page.getByTestId('sok-organizations-logo-strip');
        // the marquee renders its children twice; this testid sits on the first track only
        this.caseCards = this.logoStrip
            .getByTestId('marquee-component')
            .getByTestId('sok-organizations-case-card');
        this.marqueeDuplicate = this.logoStrip.getByTestId('marquee-duplicate');

        this.aiBlock = page.getByTestId('sok-ai');
        this.aiValidationChart = page.getByTestId('sok-ai-validation-chart');
        this.aiCapabilityCards = page.getByTestId(/^sok-ai-capability-/);
        this.aiAgentCards = page.getByTestId('sok-ai-agents').getByTestId(/^sok-ai-case-/);

        this.aiLeaderboard = page.getByTestId('sok-ai-leaderboard');
        this.aiLeaderboardScroll = page.getByTestId('sok-ai-leaderboard-scroll');
        this.aiLeaderboardRows = page.getByTestId('sok-ai-leaderboard-row');
        this.aiLeaderboardRanks = page.getByTestId('sok-ai-leaderboard-rank');
        this.aiLeaderboardCaption = page.getByTestId('sok-ai-leaderboard-caption');
    }

    /** The setups the leaderboard excerpt lists, in row order. */
    async leaderboardSetups(): Promise<string[]> {
        const setups = await this.aiLeaderboardRows.locator('td[data-col="setup"]').allInnerTexts();
        return setups.map((setup) => setup.trim());
    }

    aiPanelHeading(title: string): Locator {
        return this.aiBlock.getByRole('heading', { name: title, exact: true });
    }

    /** The bar chart's rows, as `[label, value]` pairs in the order the chart renders them. */
    async validationChartRows(): Promise<string[][]> {
        const labels = await this.aiValidationChart.locator('[data-test="horizontal-barchart-title"]').allInnerTexts();
        const values = await this.aiValidationChart.locator('[data-test="horizontal-barchart-value"]').allInnerTexts();

        return labels.map((label, index) => [label, values[index]]);
    }

    /** The companies on the strip's first track, where each of them appears exactly once. */
    async visibleCompanies(): Promise<string[]> {
        const companies = await this.caseCards.evaluateAll((cards) =>
            cards.map((card) => (card as HTMLElement).dataset.company ?? '')
        );

        return companies.sort();
    }

    heroShareLink(name: string): Locator {
        return this.heroBlock.getByRole('link', { name });
    }

    async init() {
        await this.page.goto('/state-of-kotlin-2026/');
        await this.layout.waitFor();
    }
}
