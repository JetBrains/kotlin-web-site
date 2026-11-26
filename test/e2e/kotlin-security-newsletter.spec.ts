import { expect, test } from '@playwright/test';

const SIGNUP_PATH = '/kotlin-security-newsletter/';
const NEWSLETTER_TITLE = 'Kotlin Security Newsletter';

for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
]) {
    test.describe(`Kotlin Security Newsletter at ${viewport.width}px`, () => {
        test.use({ viewport });

        test('opens directly with newsletter content and public security resources', async ({ page }) => {
            await page.goto(SIGNUP_PATH);
            const main = page.getByRole('main');

            await expect(page).toHaveTitle(NEWSLETTER_TITLE);
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
                'href',
                /\/kotlin-security-newsletter\/$/
            );
            await expect(page.getByTestId('top-menu')).toHaveCount(0);
            await expect(main.getByRole('heading', { level: 1 })).toHaveText(NEWSLETTER_TITLE);

            const coverage = main.getByRole('region', { name: 'What you’ll get' });
            await expect(coverage.getByRole('listitem').getByRole('heading')).toHaveText([
                'Security fixes in Kotlin and its ecosystem.',
                'JVM security news relevant to Kotlin',
                'Kotlin security events',
            ]);
            await expect(coverage.getByRole('listitem').first()).toContainText(
                'Fixed CVEs, affected versions, and dependency updates for Kotlin, the kotlinx libraries, Ktor, and Exposed.'
            );

            const resources = main.getByRole('region', { name: 'More Kotlin security resources' });
            await expect(resources.getByRole('listitem')).toHaveCount(2);
            await expect(resources.getByText('Kotlin LTS', { exact: true })).toHaveCount(0);
            await expect(resources.getByRole('link', { name: 'Public security support policy' })).toHaveAttribute(
                'href',
                'https://kotlinlang.org/docs/releases.html#standard-library-security-support'
            );
            await expect(resources.getByRole('link', { name: 'How to report a Kotlin vulnerability' })).toHaveAttribute(
                'href',
                'https://kotlinlang.org/docs/security.html'
            );

            const form = main.getByRole('form', { name: `${NEWSLETTER_TITLE} signup` });
            const privacyNotice = form.getByRole('link', { name: 'JetBrains Privacy Notice' });
            await expect(form.getByRole('textbox', { name: 'Email address' })).toHaveAccessibleDescription(
                'I agree that my personal data will be processed for this purpose.'
            );
            await expect(privacyNotice).toBeHidden();
            await form.locator('summary').press('Enter');
            await expect(privacyNotice).toBeVisible();
            await expect(form.getByText('You can unsubscribe at any time.')).toBeVisible();

            const artwork = main.locator('img[alt=""]');
            await expect(artwork).toHaveCount(2);
            for (const image of await artwork.all()) {
                await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
            }
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        });

        test('validates email, registers consent, and confirms a successful retry', async ({ page }) => {
            const requests: string[] = [];
            const emailAddress = 'newsletter-test@example.com';
            let marketoAttempts = 0;
            const headers = {
                'access-control-allow-origin': '*',
                'access-control-allow-methods': 'POST, OPTIONS',
                'access-control-allow-headers': 'content-type',
            };

            await page.route('https://account.jetbrains.com/services/acceptAgreement', async (route) => {
                const request = route.request();
                expect(request.method()).toBe('POST');
                const consent = new URLSearchParams(request.postData() ?? '');
                expect(consent.get('type')).toBe('mkt.general.jb-intention');
                expect(consent.get('email')).toBe(emailAddress);
                requests.push('consent');
                await route.fulfill({ status: 200, headers, json: {} });
            });

            await page.route('https://forms-service.jetbrains.com/marketo', async (route) => {
                const request = route.request();
                if (request.method() === 'OPTIONS') {
                    await route.fulfill({ status: 204, headers });
                    return;
                }

                expect(request.method()).toBe('POST');
                expect(request.postDataJSON()).toMatchObject({
                    formid: '10127',
                    Email: emailAddress,
                    kotlinSecurityNewsletter: true,
                });
                requests.push('marketo');
                marketoAttempts += 1;
                await route.fulfill({ status: marketoAttempts === 1 ? 503 : 200, headers, json: {} });
            });

            await page.goto(SIGNUP_PATH);
            const form = page.getByRole('form', { name: `${NEWSLETTER_TITLE} signup` });
            const email = form.getByRole('textbox', { name: 'Email address' });
            const subscribe = form.getByRole('button', { name: 'Subscribe', exact: true });
            await subscribe.click();
            await expect(email).toBeFocused();
            await email.fill('invalid-email');
            await subscribe.click();
            expect(requests).toEqual([]);

            await email.fill(emailAddress);
            await subscribe.click();
            await expect(form.getByRole('alert')).toContainText('Please try again');
            await expect(email).toHaveValue(emailAddress);
            expect(requests).toEqual(['consent', 'marketo']);

            await subscribe.click();
            await expect(form.getByRole('status')).toContainText('Thanks for signing up');
            await expect(subscribe).toBeDisabled();
            expect(requests).toEqual(['consent', 'marketo', 'consent', 'marketo']);
            await expect(page).toHaveURL(/\/kotlin-security-newsletter\/$/);
        });
    });
}

test.describe('Kotlin Security Newsletter without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('keeps the signup disabled and explains how to enable it', async ({ page }) => {
        await page.goto(SIGNUP_PATH);
        const form = page.getByRole('form', { name: `${NEWSLETTER_TITLE} signup` });
        await expect(form.getByRole('textbox', { name: 'Email address' })).toBeDisabled();
        await expect(form.getByRole('button', { name: 'Subscribe' })).toBeDisabled();
        const fallback = form.locator('noscript');
        await expect(fallback).toBeVisible();
        expect(await fallback.textContent()).toBe('Enable JavaScript to use this form.');
    });
});
