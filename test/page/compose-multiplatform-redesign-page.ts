import { Locator, Page } from '@playwright/test';

const PREFIX = 'compose-multiplatform-redesign';

export const SECTION_SLUGS = [
    'hero',
    'android-skills-every',
    'native-experiences',
    'supported-platforms',
    'try-compose-multiplatform',
    'alex-askerov',
    'faq',
    'build-your-first',
] as const;

export type SectionSlug = typeof SECTION_SLUGS[number];

export class ComposeMultiplatformRedesignPage {
    readonly page: Page;
    readonly layout: Locator;

    readonly hero: Locator;
    readonly heroTitle: Locator;
    readonly heroCta: Locator;

    readonly platformsBlock: Locator;
    readonly platformCards: Locator;

    readonly testimonials: Locator;
    readonly testimonialsNext: Locator;

    readonly faqBlock: Locator;
    readonly faqItems: Locator;
    readonly faqButtons: Locator;
    readonly faqAnswers: Locator;

    readonly buildYourFirstCta: Locator;

    constructor(page: Page) {
        this.page = page;
        this.layout = page.getByTestId(`${PREFIX}-page`);

        this.hero = this.section('hero');
        this.heroTitle = page.getByTestId(`${PREFIX}-hero-title`);
        this.heroCta = page.getByTestId(`${PREFIX}-hero-cta`);

        this.platformsBlock = this.section('supported-platforms');
        this.platformCards = this.platformsBlock.locator('h3');

        this.testimonials = this.section('alex-askerov');
        this.testimonialsNext = page.getByRole('button', { name: 'Next testimonial' });

        this.faqBlock = this.section('faq');
        this.faqItems = this.faqBlock.locator('[data-rs-internal=collapse__collapse]');
        this.faqButtons = this.faqBlock.locator('[data-rs-internal=collapse__button]');
        this.faqAnswers = this.faqBlock.locator('[data-rs-internal=collapse__content]');

        this.buildYourFirstCta = page.getByTestId(`${PREFIX}-build-your-first-cta`);
    }

    section(slug: SectionSlug): Locator {
        return this.page.getByTestId(`${PREFIX}-${slug}`);
    }

    platformCard(id: string): Locator {
        return this.page.getByTestId(`${PREFIX}-supported-platforms-${id}`);
    }

    async init() {
        await this.page.goto('/compose-multiplatform-redesign/');

        await Promise.all([this.layout.waitFor(), this.page.locator('html.hydrated').waitFor()]);
    }
}
