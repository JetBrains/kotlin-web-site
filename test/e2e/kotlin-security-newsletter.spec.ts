import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

import { testSelector } from '../utils';

const SIGNUP_PATH = '/security-newsletter/';
const NEWSLETTER_TITLE = 'Kotlin Security Newsletter';
const CONSENT_ID = 'mkt.general.jb-intention';
const CONSENT_URL = 'https://resources.jetbrains.com/services/consentOptions**';
const STUB_CONSENT_SHORT_TEXT = 'Stub short consent text';
const FEEDBACK_URL = 'https://forms-service.jetbrains.com/feedback';
const ASSESSMENT_URL = 'https://forms-service.jetbrains.com/assessment';
const RECAPTCHA_SCRIPT_URL = 'https://www.google.com/recaptcha/api.js**';
const RECAPTCHA_SITE_KEY = 'e2e-site-key';
const RECAPTCHA_TOKEN = 'e2e-captcha-token';
const ASSESSMENT_REQUEST_ID = 'e2e-request-id';

const getForm = (page: Page): Locator => page.locator(testSelector('wtform'));

test.beforeEach(async ({ page }) => {
    await page.route(CONSENT_URL, async (route) => {
        await route.fulfill({
            status: 200,
            headers: { 'access-control-allow-origin': '*' },
            json: { shortText: STUB_CONSENT_SHORT_TEXT, text: 'Stub full consent text' },
        });
    });
    // `createFormServiceSubmitter` loads the Google script on demand when the
    // backend responds with a reCAPTCHA v3 assessment challenge.
    await page.route(RECAPTCHA_SCRIPT_URL, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/javascript',
            body: `window.grecaptcha = { ready: (cb) => cb(), execute: async () => '${RECAPTCHA_TOKEN}' };`,
        });
    });
});

test.describe.only('Kotlin Security Newsletter', () => {
    test('opens directly with newsletter content and public security resources', async ({ page }) => {
        await page.goto(SIGNUP_PATH);
        const main = page.getByRole('main');

        await expect(page).toHaveTitle(NEWSLETTER_TITLE);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
            'href',
            /\/security-newsletter\/$/
        );
        await expect(page.getByTestId('top-menu')).toHaveCount(0);
        await expect(main.getByRole('heading', { level: 1 })).toHaveText(NEWSLETTER_TITLE);

        await expect(main.getByText(/^A free email digest from the Kotlin team/)).toHaveCount(0);

        const coverage = main.getByRole('region', { name: 'What you’ll get' });
        await expect(coverage.getByRole('listitem').getByRole('heading')).toHaveText([
            'Kotlin ecosystem security updates',
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

        const form = main.locator(testSelector('wtform'));
        const email = form.getByRole('textbox', { name: 'Email address' });
        await expect(email).toHaveAttribute('placeholder', 'your.email@example.com');

        const notice = form.locator(testSelector('privacy-notice'));
        await expect(notice).toContainText(STUB_CONSENT_SHORT_TEXT);
        await expect(form.getByText('Email address', { exact: true })).toHaveCount(0);
        await expect(form.getByText('You can unsubscribe at any time.', { exact: true })).toHaveCount(0);

        const artwork = main.locator('img[alt=""]');
        await expect(artwork).toHaveCount(2);
        for (const image of await artwork.all()) {
            await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });

    test('validates email, solves the recaptcha challenge, and confirms a successful retry', async ({ page }) => {
        const requests: string[] = [];
        const emailAddress = 'newsletter-test@example.com';
        let feedbackAttempts = 0;
        const headers = {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'POST, OPTIONS',
            'access-control-allow-headers': 'content-type',
        };

        await page.route(FEEDBACK_URL, async (route) => {
            const request = route.request();
            if (request.method() === 'OPTIONS') {
                await route.fulfill({ status: 204, headers });
                return;
            }

            feedbackAttempts += 1;
            expect(request.postDataJSON()).toMatchObject({
                formid: '10127',
                email: emailAddress,
                kotlinSecurityNewsletter: true,
                privacyConsent: true,
                privacyConsentType: [CONSENT_ID],
                marketingData: expect.objectContaining({
                    origin: expect.stringContaining(SIGNUP_PATH),
                    utmSource: 'kotlinlang',
                    utmMedium: 'e2e',
                    utmCampaign: 'security-newsletter',
                }),
            });
            requests.push('feedback');
            // The first submit fails without a captcha challenge; the second one
            // asks the client to solve an invisible reCAPTCHA v3 and resubmit.
            const challenged = feedbackAttempts > 1;
            await route.fulfill({
                status: challenged ? 200 : 503,
                headers,
                json: challenged
                    ? {
                          success: false,
                          cause: [],
                          assessment: {
                              requestId: ASSESSMENT_REQUEST_ID,
                              assessmentType: 'reCaptcha v3',
                              captchaDetails: { siteKey: RECAPTCHA_SITE_KEY },
                          },
                      }
                    : { success: false, cause: [] },
            });
        });

        await page.route(ASSESSMENT_URL, async (route) => {
            const request = route.request();
            if (request.method() === 'OPTIONS') {
                await route.fulfill({ status: 204, headers });
                return;
            }

            expect(request.postDataJSON()).toMatchObject({
                requestId: ASSESSMENT_REQUEST_ID,
                assessmentResponse: { token: RECAPTCHA_TOKEN, type: 'reCaptcha v3' },
            });
            requests.push('assessment');
            await route.fulfill({ status: 200, headers, json: { success: true } });
        });

        await page.goto(`${SIGNUP_PATH}?utm_source=kotlinlang&utm_medium=e2e&utm_campaign=security-newsletter`);
        const form = getForm(page);
        const email = form.getByRole('textbox', { name: 'Email address' });
        const subscribe = form.getByRole('button', { name: 'Subscribe', exact: true });

        await subscribe.click();
        await expect(form.getByText('This field is required')).toBeVisible();
        expect(requests).toEqual([]);

        await email.fill('invalid-email');
        await subscribe.click();
        await expect(form.getByText('E-mail address is not correct')).toBeVisible();
        expect(requests).toEqual([]);

        await email.fill(emailAddress);
        await subscribe.click();
        await expect(form.getByText('Please try again')).toBeVisible();
        await expect(email).toHaveValue(emailAddress);
        expect(requests).toEqual(['feedback']);

        await subscribe.click();
        await expect(page.getByRole('main').getByRole('status')).toContainText('Thanks for signing up');
        await expect(form).toHaveCount(0);
        expect(requests).toEqual(['feedback', 'feedback', 'assessment']);
        await expect(page).toHaveURL(/\/security-newsletter\//);
    });
});

test.describe('Kotlin Security Newsletter on a small screen', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('renders the stacked layout without horizontal overflow', async ({ page }) => {
        await page.goto(SIGNUP_PATH);
        const main = page.getByRole('main');
        const form = getForm(page);

        await expect(main.getByRole('heading', { level: 1 })).toBeVisible();
        await expect(form.getByRole('textbox', { name: 'Email address' })).toBeVisible();
        await expect(form.getByRole('button', { name: 'Subscribe', exact: true })).toBeVisible();
        await expect(form.locator(testSelector('privacy-notice'))).toContainText(STUB_CONSENT_SHORT_TEXT);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
});

test.describe('Kotlin Security Newsletter without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('keeps the signup disabled and explains how to enable it', async ({ page }) => {
        await page.goto(SIGNUP_PATH);
        const form = getForm(page);
        await expect(form.getByRole('textbox', { name: 'Email address' })).toBeDisabled();
        await expect(form.getByRole('button', { name: 'Subscribe' })).toBeDisabled();
        const fallback = form.locator('noscript');
        await expect(fallback).toBeVisible();
        expect(await fallback.textContent()).toBe('Enable JavaScript to use this form.');
    });
});
