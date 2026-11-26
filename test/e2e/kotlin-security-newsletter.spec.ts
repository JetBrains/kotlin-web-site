import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

import { testSelector } from '../utils';

const SIGNUP_PATH = '/security-newsletter/';
const NEWSLETTER_TITLE = 'Kotlin Security Newsletter';
const CONSENT_ID = 'mkt.general.jb-intention';
const CONSENT_SHORT_TEXT = 'I agree that my personal data will be processed for this purpose.';
const CONSENT_URL = 'https://resources.jetbrains.com/services/consentOptions**';

const getForm = (page: Page): Locator => page.locator(testSelector('wtform'));

test.beforeEach(async ({ page }) => {
    await page.route(CONSENT_URL, async (route) => {
        await route.fulfill({
            status: 200,
            headers: { 'access-control-allow-origin': '*' },
            json: {
                consentId: CONSENT_ID,
                version: '1.0',
                shortText: CONSENT_SHORT_TEXT,
                text: 'By submitting this form, I agree that JetBrains s.r.o. may process the personal data I provided above and my location for the purpose explained above and may engage <a href="https://www.jetbrains.com/legal/privacy/third-parties.html" target="_blank">third parties</a> in such processing. The consent can be revoked in <a href="https://account.jetbrains.com/profile-details/privacy" target="_blank">my profile</a> at any time. More details about the processing are in <a href="https://www.jetbrains.com/legal/docs/privacy/privacy/" target="_blank">JetBrains Privacy Notice</a>. In addition, an unsubscribe link is included in each email.',
            },
        });
    });
});

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
            const subscribe = form.getByRole('button', { name: 'Subscribe', exact: true });
            await expect(email).toHaveAttribute('placeholder', 'your.email@example.com');

            const notice = form.locator(testSelector('privacy-notice'));
            await expect(notice).toContainText(CONSENT_SHORT_TEXT);
            await expect(form.getByText('Email address', { exact: true })).toHaveCount(0);
            await expect(form.getByText('You can unsubscribe at any time.', { exact: true })).toHaveCount(0);

            if (viewport.width > 640) {
                const privacyTrigger = notice.locator('svg');
                // The tooltip content is rendered into a portal attached to the document body.
                const privacyNotice = page.getByRole('link', { name: 'JetBrains Privacy Notice' });
                const subscribePosition = await subscribe.boundingBox();

                await expect(privacyNotice).toHaveCount(0);
                await privacyTrigger.hover();
                await expect(privacyNotice).toBeVisible();
                expect(await subscribe.boundingBox()).toEqual(subscribePosition);
                await privacyNotice.hover();
                await expect(privacyNotice).toBeVisible();
                await main.getByRole('heading', { level: 1 }).hover();
                await expect(privacyNotice).toHaveCount(0);

                await email.focus();
                await page.keyboard.press('Tab');
                await expect(privacyTrigger).toBeFocused();
                await expect(privacyNotice).toBeVisible();
                await page.keyboard.press('Tab');
                await expect(privacyNotice).toHaveCount(0);
            }

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
                expect(consent.get('type')).toBe(CONSENT_ID);
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

                expect(request.postDataJSON()).toMatchObject({
                    formid: '10127',
                    formVid: '10127',
                    munchkinId: expect.any(String),
                    checksum: expect.any(String),
                    checksumFields: expect.any(String),
                    Email: emailAddress,
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
                requests.push('marketo');
                marketoAttempts += 1;
                await route.fulfill({
                    status: marketoAttempts === 1 ? 503 : 200,
                    headers,
                    json: { success: marketoAttempts === 1 ? false : true, cause: [] },
                });
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
            expect(requests).toEqual(['consent', 'marketo']);

            await subscribe.click();
            await expect(page.getByRole('main').getByRole('status')).toContainText('Thanks for signing up');
            await expect(form).toHaveCount(0);
            expect(requests).toEqual(['consent', 'marketo', 'consent', 'marketo']);
            await expect(page).toHaveURL(/\/security-newsletter\//);
        });
    });
}

test.describe('Newsletter privacy details on a touch screen', () => {
    test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

    test('expands the full consent text on tap and collapses it back', async ({ page }) => {
        await page.goto(SIGNUP_PATH);
        const form = getForm(page);
        const privacyNotice = form.getByRole('link', { name: 'JetBrains Privacy Notice' });

        await form.getByRole('button', { name: 'Show more' }).tap();
        await expect(privacyNotice).toBeVisible();
        await form.getByRole('button', { name: 'Show less' }).tap();
        await expect(privacyNotice).toHaveCount(0);
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
