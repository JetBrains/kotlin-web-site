import { expect, test, type Locator } from '@playwright/test';

import { checkFullPageScreenshot, checkScreenshot } from '../utils';
import { MICRO_ANIMATION_TIMEOUT } from './visual-constants';

const SECTION_TEST_IDS = [
    'kotlin-ambassador-hero',
    'kotlin-ambassador-program-section',
    'kotlin-ambassador-benefits',
    'kotlin-ambassador-badge',
    'kotlin-ambassador-links',
];

const BENEFITS = [
    'A bigger stage for your work',
    'Connect with the Kotlin team',
    'A community of peers',
    'Join us at KotlinConf',
    'Complimentary JetBrains subscription'
];

const LINKS = [
// Matches the in-code TODO placeholder until marketing provides the final URL (KTL-5273).
    { title: 'Terms and Conditions', href: '#' },
    { title: 'Code of Conduct', href: 'https://github.com/jetbrains#code-of-conduct' },
    { title: 'Brand Assets', href: '#' }
];

const TEST_EMAIL = 'ambassador@example.com';

// The endpoints of @webteam/data-services used by the page submitter.
const MARKETO_URL = 'https://forms-service.jetbrains.com/marketo';
const ACCEPTANCE_URL_PATTERN = /account\.jetbrains\.com\/services\/acceptAgreement/;

const checkSectionShot = (section: Locator) =>
    checkScreenshot(section, { stylePath: ['test/e2e/hide-top-menu.css'] });

test.describe('Kotlin Ambassador welcome page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/community/kotlin-ambassador/');
    });

    test('is hidden from search engines', async ({ page }) => {
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
            'href',
            /\/community\/kotlin-ambassador\/$/
        );
    });

    test('has the correct title and description', async ({ page }) => {
        await expect(page).toHaveTitle('Kotlin Ambassadors Program');

        await expect(page.locator('meta[name="description"]')).toHaveAttribute(
            'content',
            'You’re invited to become a Kotlin Ambassador.'
        );
    });

    test('renders every section', async ({ page }) => {
        for (const testId of SECTION_TEST_IDS) {
            await expect(page.getByTestId(testId)).toBeVisible();
        }
    });

    test('hero shows the invitation heading', async ({ page }) => {
        await expect(page.getByTestId('kotlin-ambassador-sign')).toBeVisible();
        await expect(page.getByTestId('kotlin-ambassador-program-title')).toHaveText('Kotlin Ambassadors Program');
        await expect(page.getByTestId('kotlin-ambassador-title')).toHaveText('Congratulations!');

        // The subtitle contains a manual <br /> in the markup, so allow any whitespace in the match.
        await expect(page.getByTestId('kotlin-ambassador-subtitle')).toHaveText(
            /You’re invited to become\s*a Kotlin Ambassador\./
        );
    });

    test('invitation intro matches the program doc', async ({ page }) => {
        const intro = page.getByTestId('kotlin-ambassador-intro');

        await expect(intro.locator('p').nth(0)).toHaveText(
            'Your work makes a difference to the Kotlin community. You share your knowledge, inspire other developers, and help the ecosystem grow – and we’d love to recognize that.'
        );
        await expect(intro.locator('p').nth(1)).toHaveText(
            'We’d love to invite you to join the Kotlin Ambassadors Program: a community of experts, creators, educators, and community leaders who share your passion for Kotlin.'
        );
    });

    test('terms footnote links to the program document', async ({ page }) => {
        const footnote = page.getByTestId('kotlin-ambassador-terms-footnote');

        await expect(footnote).toHaveText(
            'By clicking “Accept invitation,” you agree to the Kotlin Ambassadors Program Terms & Conditions.'
        );

        // The document opens in a new tab, so the entered form data is not lost.
        await expect(footnote.getByRole('link')).toHaveAttribute('href', LINKS[0].href);
        await expect(footnote.getByRole('link')).toHaveAttribute('target', '_blank');
    });

    test('benefits list five perks', async ({ page }) => {
        const cards = page.getByTestId('kotlin-ambassador-benefit-card');

        await expect(cards).toHaveCount(5);

        for (const benefit of BENEFITS) {
            await expect(cards.filter({ hasText: benefit })).toHaveCount(1);
        }
    });

    test('badge card offers the badge kit and keeps its decoration', async ({ page }) => {
        await expect(page.getByTestId('kotlin-ambassador-badge-title')).toHaveText('Let the community know.');
        await expect(page.getByTestId('kotlin-ambassador-badge-button')).toHaveText('Get your badge');
        await expect(page.getByTestId('kotlin-ambassador-badge-decoration').locator('img')).toHaveCount(3);
    });

    test('footer links list the program resources', async ({ page }) => {
        const links = page.getByTestId('kotlin-ambassador-link');

        await expect(links).toHaveCount(3);

        for (const [index, link] of LINKS.entries()) {
            await expect(links.nth(index)).toHaveText(link.title);
            await expect(links.nth(index)).toHaveAttribute('href', link.href);
        }
    });

    test('form reports every missing required field', async ({ page }) => {
        const formCard = page.getByTestId('kotlin-ambassador-form-card');

        await formCard.getByRole('button', { name: 'Accept invitation' }).click();

        // The three required inputs report their errors at once.
        await expect(formCard.getByText('This field is required')).toHaveCount(3);
    });

    test('form requires the terms acceptance', async ({ page }) => {
        const marketoRequests: unknown[] = [];

        await page.route(MARKETO_URL, (route) => {
            if (route.request().method() !== 'POST') {
                route.continue();
                return;
            }

            marketoRequests.push(route.request().postDataJSON());
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true, cause: [] })
            });
        });

        const formCard = page.getByTestId('kotlin-ambassador-form-card');
        await formCard.locator('input[name="FirstName"]').fill('Ada');
        await formCard.locator('input[name="LastName"]').fill('Lovelace');
        await formCard.locator('input[name="email"]').fill(TEST_EMAIL);
        await formCard.getByRole('button', { name: 'Accept invitation' }).click();

        // The terms acceptance is enforced by the submitter, so its error appears next.
        await expect(formCard.getByText('This field is required')).toHaveCount(1);
        expect(marketoRequests).toHaveLength(0);
    });

    test('form rejects an invalid email', async ({ page }) => {
        const formCard = page.getByTestId('kotlin-ambassador-form-card');

        await formCard.locator('input[name="FirstName"]').fill('Ada');
        await formCard.locator('input[name="LastName"]').fill('Lovelace');
        await formCard.locator('input[name="email"]').fill('not-an-email');
        // The rescui checkbox input carries `transition: all`, so Playwright's stability wait
        // never settles on it; its position is static, and the forced check toggles it reliably.
        await formCard.locator('input[name="termsAccepted"]').check({ force: true });
        await formCard.getByRole('button', { name: 'Accept invitation' }).click();

        await expect(formCard.getByText('E-mail address is not correct')).toHaveCount(1);
    });

    /* While FORM_ID stays a marketing TODO, the submitter refuses to send anything.
       Once the real form id is in place, bring the full-flow assertions back here:
       the Marketo request payload and the conditional acceptAgreement call. */
    test('keeps the placeholder form id from reaching the forms service', async ({ page }) => {
        const marketoRequests: Record<string, unknown>[] = [];
        let acceptanceRequests = 0;
        const dialogs: string[] = [];

        await page.route(MARKETO_URL, (route) => {
            if (route.request().method() !== 'POST') {
                route.continue();
                return;
            }

            marketoRequests.push(route.request().postDataJSON());
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true, cause: [] })
            });
        });

        await page.route(ACCEPTANCE_URL_PATTERN, (route) => {
            acceptanceRequests += 1;
            route.fulfill({ status: 200, body: '' });
        });

        page.on('dialog', (dialog) => {
            dialogs.push(dialog.message());
            void dialog.dismiss();
        });

        const formCard = page.getByTestId('kotlin-ambassador-form-card');
        await formCard.locator('input[name="FirstName"]').fill('Ada');
        await formCard.locator('input[name="LastName"]').fill('Lovelace');
        await formCard.locator('input[name="email"]').fill(TEST_EMAIL);
        // The rescui checkbox input carries `transition: all`, so Playwright's stability wait
        // never settles on it; its position is static, and the forced check toggles it reliably.
        await formCard.locator('input[name="termsAccepted"]').check({ force: true });
        await formCard.locator('input[name="newsletterOptIn"]').check({ force: true });
        await formCard.getByRole('button', { name: 'Accept invitation' }).click();

        // The guard rejects before any network call, whatever the checkboxes say.
        await expect.poll(() => marketoRequests.length + acceptanceRequests + dialogs.length).toBe(0);
        await expect(formCard.getByText('The form is not configured yet, please try again later.')).toBeVisible();
    });

    test('check full page', async ({ page }) => {
        await checkFullPageScreenshot(page, {
            stylePath: ['test/e2e/kotlin-ambassador/mask-section-contents.css']
        });
    });

    test('check hero section', async ({ page }) => {
        await checkSectionShot(page.getByTestId('kotlin-ambassador-hero'));
    });

    test('check invitation card', async ({ page }) => {
        await page.waitForTimeout(MICRO_ANIMATION_TIMEOUT);

        await checkSectionShot(page.getByTestId('kotlin-ambassador-invitation'));
    });

    test('check benefits section', async ({ page }) => {
        await checkSectionShot(page.getByTestId('kotlin-ambassador-benefits'));
    });

    test('check badge section', async ({ page }) => {
        await checkSectionShot(page.getByTestId('kotlin-ambassador-badge'));
    });

    test('check links section', async ({ page }) => {
        await checkSectionShot(page.getByTestId('kotlin-ambassador-links'));
    });
});
