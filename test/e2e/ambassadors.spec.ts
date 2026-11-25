import { expect, test, type Locator } from '@playwright/test';

import { checkFullPageScreenshot, checkScreenshot } from '../utils';
import { MICRO_ANIMATION_TIMEOUT } from './visual-constants';

const SECTION_TEST_IDS = [
    'ambassadors-hero',
    'ambassadors-program-section',
    'ambassadors-who-can-become',
    'ambassadors-how-to-become',
    'ambassadors-faq',
];

const BENEFITS: (string | RegExp)[] = [
    // The first title has a manual <br /> in the markup, so allow any whitespace (or none) in the match.
    /Visibility for\s*Ambassadors' work/,
    'Straight talk with the Kotlin team',
    'A global circle of Kotlin experts',
    'Support for community activities',
    'Complimentary JetBrains subscription',
    'KotlinConf tickets',
];

const FAQ_ANSWERS: [string, string][] = [
    ['How are Kotlin Ambassadors selected?', 'not currently employed by JetBrains'],
    ['Can I apply to become a Kotlin Ambassador?', 'does not accept self-nominations'],
    ['How long does the membership last?', 'no fixed expiration date'],
    ['Is there a Code of Conduct?', 'respectful communication'],
];

const checkSectionShot = (section: Locator) =>
    checkScreenshot(section, { stylePath: ['test/e2e/hide-top-menu.css'] });

test.describe('Kotlin Ambassadors page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/community/ambassadors/');
    });

    test('has the correct title and description', async ({ page }) => {
        await expect(page).toHaveTitle('Kotlin Ambassadors Program');

        await expect(page.locator('meta[name="description"]')).toHaveAttribute(
            'content',
            'A program for creators, educators, and community leaders making a lasting impact on the Kotlin ecosystem.'
        );
    });

    test('renders every section', async ({ page }) => {
        for (const testId of SECTION_TEST_IDS) {
            await expect(page.getByTestId(testId)).toBeVisible();
        }
    });

    test('hero shows the program title and six benefit cards', async ({ page }) => {
        await expect(page.getByTestId('ambassadors-hero-title')).toHaveText('Kotlin Ambassadors Program');
        await expect(page.getByTestId('ambassadors-benefit-card')).toHaveCount(6);

        for (const benefit of BENEFITS) {
            await expect(page.getByTestId('ambassadors-benefit-card').filter({ hasText: benefit })).toHaveCount(1);
        }
    });

    test('lists five community contribution types', async ({ page }) => {
        const items = page.getByTestId('ambassadors-contributions-card').locator('dt');

        await expect(items).toHaveCount(5);
        await expect(items.filter({ hasText: 'Mentorship' })).toHaveCount(1);
    });

    test('faq renders the four program questions and the Code of Conduct link', async ({ page }) => {
        const faq = page.getByTestId('ambassadors-faq');

        for (const [question] of FAQ_ANSWERS) {
            await expect(faq.getByText(question, { exact: true })).toHaveCount(1);
        }

        // Every answer starts collapsed; expand each item and read a distinctive phrase.
        await expect(faq.getByText(FAQ_ANSWERS[0][1])).toBeHidden();

        for (const [question, phrase] of FAQ_ANSWERS) {
            await faq.getByText(question, { exact: true }).click();
            await expect(faq.getByText(phrase)).toBeVisible();

            // The accordion keeps a single item open, so check the link while this one is expanded.
            if (question === 'Is there a Code of Conduct?') {
                const codeOfConduct = faq.getByRole('link', { name: 'Code of Conduct' });
                await expect(codeOfConduct).toBeVisible();
                await expect(codeOfConduct).toHaveAttribute('href', 'https://github.com/jetbrains#code-of-conduct');
            }
        }
    });

    test('check full page', async ({ page }) => {
        await checkFullPageScreenshot(page, {
            stylePath: ['test/e2e/ambassadors/mask-section-contents.css']
        });
    });

    test('check hero section', async ({ page }) => {
        await checkSectionShot(page.getByTestId('ambassadors-hero'));
    });

    test('check who can become section', async ({ page }) => {
        await checkSectionShot(page.getByTestId('ambassadors-who-can-become'));
    });

    test('check how to become section', async ({ page }) => {
        await checkSectionShot(page.getByTestId('ambassadors-how-to-become'));
    });

    test('check faq section', async ({ page }) => {
        await checkSectionShot(page.getByTestId('ambassadors-faq'));
    });

    test('check faq section with an expanded answer', async ({ page }) => {
        const faq = page.getByTestId('ambassadors-faq');

        // The accordion allows a single open item at a time.
        await faq.getByText('Is there a Code of Conduct?', { exact: true }).click();

        await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT);

        await checkSectionShot(faq);
    });
});
