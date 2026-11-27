import { expect, test } from '@playwright/test';
import { KotlinLtsPage } from '../page/kotlin-lts-page';
import { testSelector } from '../utils';
import { CONTACT_TEAM_URL, NEWSLETTER_URL, PUBLIC_SUPPORT_URL } from '../../blocks/kotlin-lts/constants';

const FORMS_SERVICE_URL = 'https://forms-service.jetbrains.com/feedback';
const EMAIL_VALIDATION_PATH = '/services/rest/validation/v1/checkEmail';
const CORS_HEADERS = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, OPTIONS, POST',
    'access-control-allow-headers': 'content-type',
};

test.beforeEach(async ({ page }) => {
    await page.route(
        'https://resources.jetbrains.com/services/consentOptions?consentId=mkt.general.user-intention',
        (route) => route.fulfill({
            headers: CORS_HEADERS,
            json: {
                shortText: 'I understand how my data will be processed.',
                text: 'This inquiry uses the <a href="https://www.jetbrains.com/legal/docs/privacy/privacy/">JetBrains Privacy Notice</a>.',
            },
        })
    );
});

for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
]) {
    test.describe(`Kotlin LTS at ${viewport.width}px`, () => {
        test.use({ viewport });

        let lts: KotlinLtsPage;

        test.beforeEach(async ({ page }) => {
            lts = new KotlinLtsPage(page);
            await lts.init();
        });

        test('keeps the section order, compact coverage, and restored Gradle workflow', async () => {
            await expect(lts.main.getByRole('heading', { level: 1 })).toHaveText(
                'Kotlin Long-Term Security Support'
            );
            expect(
                await lts.main
                    .locator(':scope > section')
                    .evaluateAll((sections) => sections.map((section) => section.getAttribute('data-testid')))
            ).toEqual([
                'lts-hero',
                'lts-constraints',
                'lts-coverage',
                'lts-how',
                'lts-benefits',
                'lts-newsletter',
                'lts-faq',
                'lts-cta',
            ]);
            await expect(lts.coverage.getByRole('listitem').getByRole('heading', { level: 3 })).toHaveText([
                'Kotlin',
                'kotlinx libraries',
                'Ktor',
                'Exposed',
                'Compose Multiplatform',
            ]);
            await expect(lts.coverage.getByRole('listitem')).toHaveCount(5);
            await expect(lts.coverage.getByRole('list').getByRole('link')).toHaveCount(0);
            await expect(lts.coverage.getByRole('listitem').filter({ hasText: 'kotlinx libraries' })).toContainText(
                'coroutines and serialization'
            );
            await expect(lts.benefits.getByRole('link', { name: 'Public support policy' })).toHaveAttribute(
                'href',
                PUBLIC_SUPPORT_URL
            );
            await expect(lts.process.getByRole('heading', { level: 2 })).toHaveText(
                'How it works in your workflow'
            );
            await expect(lts.process).toContainText('with no migration project required');
            await expect(lts.process.getByRole('listitem')).toHaveText([
                'Minimal, targeted changes on top of your current version',
                'Drop-in artifacts from a subscriber-only repository',
                'Direct notifications when a security fix is available',
            ]);
            const code = lts.process.getByTestId('lts-how-code').locator('pre');
            await expect(code).toContainText('// settings.gradle.kts');
            await expect(code).toContainText('// build.gradle.kts');
            await expect(code).toContainText('kotlin("jvm") version "2.x.y-lts.N"');
            expect(await lts.expectNoOverflow()).toBe(true);
            await expect(lts.main.getByText('Show handoff notes')).toHaveCount(0);
        });

        test('keeps the approved light surfaces and loads the artwork without overflow', async () => {
            await expect(lts.hero).toHaveCSS('background-color', 'rgb(245, 242, 255)');
            await expect(lts.footer).toHaveCSS('background-color', 'rgb(255, 255, 255)');
            for (const section of [lts.hero, lts.benefits, lts.cta]) {
                await section.scrollIntoViewIfNeeded();
                for (const artwork of await section.locator('img').all()) {
                    await expect
                        .poll(() => artwork.evaluate((img: HTMLImageElement) => img.naturalWidth))
                        .toBeGreaterThan(0);
                }
            }
            expect(await lts.expectNoOverflow()).toBe(true);
            const contrast = await lts.footer.getByRole('link', { name: 'Contributing to Kotlin' }).evaluate((el) => {
                const rgb = getComputedStyle(el)
                    .color.match(/[\d.]+/g)
                    .map(Number);
                const linear = rgb.slice(0, 3).map((value) => {
                    const channel = value / 255;
                    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
                });
                return 1.05 / (0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2] + 0.05);
            });
            expect(contrast).toBeGreaterThanOrEqual(4.5);
        });

        test('routes every Contact team action to the same inquiry and keeps newsletter signup separate', async ({
            page,
        }) => {
            const contacts = page.getByRole('link', { name: 'Contact team', exact: true });
            await expect(contacts).toHaveCount(3);
            for (const contact of await contacts.all()) await expect(contact).toHaveAttribute('href', CONTACT_TEAM_URL);
            await expect(lts.hero.getByRole('link')).toHaveCount(2);
            const included = lts.hero.getByRole('link', { name: "What's included" });
            await expect(included).toHaveAttribute('href', '#coverage');
            await included.click();
            await expect(lts.coverage.getByRole('heading', { level: 2 })).toBeInViewport();
            await expect(lts.newsletter.getByRole('link', { name: 'Track Kotlin security fixes' })).toHaveAttribute(
                'href',
                NEWSLETTER_URL
            );
            await lts.cta.getByRole('link', { name: 'Contact team', exact: true }).click();
            await expect(page).toHaveURL(new RegExp(`${CONTACT_TEAM_URL}$`));
            await expect(page.getByRole('heading', { level: 1 })).toHaveText('Discuss a paid subscription');
            await expect(page.getByRole('checkbox')).toHaveCount(0);
            await expect(page.getByRole('textbox', { name: 'Work email address *' })).toBeEnabled();
            const teamSize = page.getByRole('group', { name: 'Engineering team size *' });
            await expect(teamSize.locator(testSelector('radio-button-list'))).toHaveCSS('border-top-width', '0px');
            expect(await lts.expectNoOverflow()).toBe(true);
        });

        test('animates the hero briefly and reveals cards only on their first entry', async ({ page }) => {
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            await page.reload();
            await page.locator('html.hydrated').waitFor();

            const heroMotion = await lts.hero.locator('img').evaluateAll((images) =>
                images.map((image) => {
                    const style = getComputedStyle(image);
                    return {
                        name: style.animationName,
                        seconds: parseFloat(style.animationDuration),
                        iterations: style.animationIterationCount,
                    };
                })
            );
            for (const motion of heroMotion) {
                expect(motion.name).not.toBe('none');
                expect(motion.seconds).toBeGreaterThan(0);
                expect(motion.seconds).toBeLessThanOrEqual(5);
                expect(motion.iterations).toBe('1');
            }

            for (const card of [
                lts.coverage.getByRole('listitem').first(),
            ]) {
                await card.scrollIntoViewIfNeeded();
                await expect.poll(() => card.evaluate((element) => element.getAnimations().length)).toBeGreaterThan(0);
                await card.evaluate((element) =>
                    Promise.all(element.getAnimations().map((animation) => animation.finished))
                );
                await expect(card).toHaveCSS('opacity', '1');
                await lts.hero.scrollIntoViewIfNeeded();
                await card.scrollIntoViewIfNeeded();
                await page.evaluate(() =>
                    new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
                );
                expect(await card.evaluate((element) => element.getAnimations().length)).toBe(0);
            }
            expect(await lts.expectNoOverflow()).toBe(true);
        });

        test('stops active motion and keeps all cards visible with reduced motion', async ({ page }) => {
            await lts.coverage.getByRole('listitem').first().scrollIntoViewIfNeeded();
            await expect
                .poll(() =>
                    lts.coverage.getByRole('listitem').first().evaluate((element) => element.getAnimations().length)
                )
                .toBeGreaterThan(0);
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await expect
                .poll(() => lts.main.evaluate((element) => element.getAnimations({ subtree: true }).length))
                .toBe(0);

            await page.reload();
            await page.locator('html.hydrated').waitFor();
            for (const card of [
                ...(await lts.coverage.getByRole('listitem').all()),
            ]) {
                await card.scrollIntoViewIfNeeded();
                await expect(card).toHaveCSS('opacity', '1');
                await expect(card).toBeVisible();
            }
            expect(await lts.main.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
            expect(await lts.expectNoOverflow()).toBe(true);
        });

        test('supports keyboard opening and closing of the initially collapsed FAQ', async () => {
            const items = lts.faq.locator('details');
            await expect(items).toHaveCount(8);
            for (const item of await items.all()) await expect(item).not.toHaveAttribute('open', '');
            const question = lts.faq.getByText('What happens after I contact the team?', { exact: true });
            await question.focus();
            await question.press('Enter');
            await expect(items.nth(6)).toHaveAttribute('open', '');
            await expect(items.nth(6).getByText(/We’ll review your components/)).toBeVisible();
            await question.press('Space');
            await expect(items.nth(6)).not.toHaveAttribute('open', '');
            await expect(items.nth(6).getByText(/We’ll review your components/)).not.toBeVisible();
        });

        test('validates and submits a paid support inquiry with the agreed consent', async ({ page }) => {
            const emailChecks: string[] = [];
            const inquiries: unknown[] = [];
            const personalEmail = 'lts-form-test@personal.example';
            const workEmail = 'lts-form-test@company.example';
            const unexpectedRequests: string[] = [];
            let acceptInquiry: () => void;
            const acceptance = new Promise<void>((resolve) => {
                acceptInquiry = resolve;
            });

            await page.route('https://data.services.jetbrains.com/geo', (route) =>
                route.fulfill({ headers: CORS_HEADERS, json: { code: 'NL', name: 'Nederland' } })
            );
            await page.route('https://account.jetbrains.com/**', (route) => {
                const url = new URL(route.request().url());
                if (url.pathname !== EMAIL_VALIDATION_PATH) {
                    unexpectedRequests.push(url.pathname);
                    return route.abort();
                }
                const email = url.searchParams.get('email');
                emailChecks.push(email);
                return route.fulfill({
                    headers: CORS_HEADERS,
                    json: { isValid: true, isFree: email === personalEmail },
                });
            });
            await page.route('https://forms-service.jetbrains.com/**', async (route) => {
                const request = route.request();
                if (request.url() !== FORMS_SERVICE_URL) {
                    unexpectedRequests.push(request.url());
                    await route.abort();
                    return;
                }
                if (request.method() === 'OPTIONS') {
                    await route.fulfill({ status: 204, headers: CORS_HEADERS });
                    return;
                }

                inquiries.push(request.postDataJSON());
                if (inquiries.length === 1) {
                    await route.fulfill({
                        headers: CORS_HEADERS,
                        json: { success: false, cause: [{ name: 'form', cause: 'Request rejected' }] },
                    });
                    return;
                }
                if (inquiries.length === 2) {
                    await route.fulfill({
                        status: 503,
                        headers: CORS_HEADERS,
                        json: { message: 'Service unavailable' },
                    });
                    return;
                }

                await acceptance;
                await route.fulfill({ headers: CORS_HEADERS, json: { success: true } });
            });

            await page.goto(CONTACT_TEAM_URL);
            const form = page.locator(testSelector('wtform'));
            const submit = form.getByRole('button', { name: 'Send request', exact: true });
            const status = page.getByRole('main').getByRole('status');
            const emailField = form.getByLabel('Work email address *', { exact: true });
            const country = form.getByLabel('Country/Region *');
            const components = form.getByLabel('Components and versions (optional)');
            await expect(form.getByRole('checkbox')).toHaveCount(0);
            const privacyNotice = form.locator(testSelector('privacy-notice'));
            await expect(privacyNotice).toContainText('This inquiry uses the');
            await expect(privacyNotice.getByRole('link', { name: 'JetBrains Privacy Notice' })).toBeVisible();
            await expect(country).toHaveValue('Netherlands');
            expect(await lts.expectNoOverflow()).toBe(true);
            await submit.click();
            const firstName = form.getByLabel('First name *', { exact: true });
            await expect(firstName).toHaveAttribute('aria-invalid', 'true');
            await expect(form.getByText('This field is required').first()).toBeVisible();
            await expect(status).toHaveCount(0);
            await firstName.fill(' Test ');
            await form.getByLabel('Last name *').fill('Inquiry');
            await emailField.fill('invalid-email');
            const company = form.getByLabel('Company *', { exact: true });
            await company.fill('Example Company');
            const role = form.getByLabel('Role *');
            await role.focus();
            await expect(company).toHaveAttribute('aria-invalid', 'false');
            await role.selectOption('Individual Contributor');
            await expect(form.locator('[data-field-name="Role__c"]')).toHaveAttribute('data-field-error', 'false');
            await country.selectOption('Germany');
            const teamSizes = form.getByRole('group', { name: 'Engineering team size *' });
            const option = teamSizes.locator('label').filter({ hasText: /^26-50$/ });
            await option.evaluate((element) => element.scrollIntoView({ block: 'center' }));
            await option.click();
            await expect(teamSizes.getByRole('radio', { name: '26-50' })).toBeChecked();
            await form.getByLabel('What would you like to discuss? (optional)').fill('Upgrade timing');

            await submit.click();
            await expect(form.getByText('E-mail address is not correct')).toBeVisible();
            expect(emailChecks).toEqual([]);

            await emailField.fill(personalEmail);
            await submit.click();
            await expect(form.getByText('Enter your work email address.')).toBeVisible();
            await expect(emailField).toHaveAttribute('aria-invalid', 'true');
            expect(emailChecks).toEqual([personalEmail]);
            expect(inquiries).toEqual([]);

            await emailField.fill(workEmail);
            await submit.click();
            await expect(form.getByRole('alert')).toHaveText('We couldn’t send your request. Please try again.');
            await expect(emailField).toHaveValue(workEmail);
            await expect(country).toHaveValue('Germany');
            await expect(status).toHaveCount(0);
            const requiredPayload = {
                formid: 'consent/10118',
                firstName: 'Test',
                lastName: 'Inquiry',
                email: workEmail,
                company: 'Example Company',
                Role__c: 'Individual Contributor',
                country: 'Germany',
                Number_of_Developers__c: '26-50',
                mktoPersonNotes: 'Upgrade timing',
                privacyConsent: true,
                privacyConsentType: ['mkt.general.user-intention'],
            };
            expect(inquiries).toEqual([requiredPayload]);

            await components.fill('Kotlin 2.3 and Ktor 3.2');
            await form.getByLabel('Job title (optional)').fill('Platform engineer');
            const completePayload = {
                ...requiredPayload,
                title: 'Platform engineer',
                codeReviewTool: 'Kotlin 2.3 and Ktor 3.2',
            };
            await submit.click();
            await expect(form.getByRole('alert')).toHaveText('We couldn’t send your request. Please try again.');
            await expect(components).toHaveValue('Kotlin 2.3 and Ktor 3.2');
            await expect(status).toHaveCount(0);

            try {
                await submit.click();
                await expect.poll(() => inquiries.length).toBe(3);
                await expect(form.getByRole('button', { name: 'Sending…' })).toBeDisabled();
                await expect(status).toHaveCount(0);
                await form.evaluate((element: HTMLFormElement) => element.requestSubmit());
            } finally {
                acceptInquiry();
            }

            await expect(status).toContainText('Request sent');
            await expect(status).toBeFocused();
            await expect(form).toHaveCount(0);
            await expect(page).toHaveURL(new RegExp(`${CONTACT_TEAM_URL}$`));
            expect(inquiries).toEqual([requiredPayload, completePayload, completePayload]);
            expect(emailChecks).toEqual([personalEmail, workEmail, workEmail, workEmail]);
            expect(unexpectedRequests).toEqual([]);
        });

        test('registers newsletter consent and submits the Kotlin Security Newsletter signup', async ({ page }) => {
            const requests: string[] = [];
            const emailAddress = 'lts-preview-test@example.com';
            let marketoAttempts = 0;
            const headers = {
                'access-control-allow-origin': '*',
                'access-control-allow-methods': 'POST, OPTIONS',
                'access-control-allow-headers': 'content-type',
            };
            await page.route(/https:\/\/(account\.jetbrains\.com\/services\/acceptAgreement|forms-service\.jetbrains\.com\/marketo)$/, async (route) => {
                const request = route.request();
                if (request.method() === 'OPTIONS') {
                    await route.fulfill({ status: 204, headers });
                    return;
                }

                const url = new URL(request.url());
                requests.push(url.pathname);
                expect(request.method()).toBe('POST');
                if (url.pathname === '/services/acceptAgreement') {
                    const consent = new URLSearchParams(request.postData() ?? '');
                    expect(consent.get('type')).toBe('mkt.general.jb-intention');
                    expect(consent.get('email')).toBe(emailAddress);
                    expect(url.search).toBe('');
                    await route.fulfill({ status: 200, headers, json: {} });
                } else {
                    expect(url.pathname).toBe('/marketo');
                    expect(request.postDataJSON()).toMatchObject({
                        formid: '10127',
                        Email: emailAddress,
                        kotlinSecurityNewsletter: true,
                    });
                    marketoAttempts += 1;
                    await route.fulfill({ status: marketoAttempts === 1 ? 503 : 200, headers, json: {} });
                }
            });

            await lts.newsletter.getByRole('link', { name: 'Track Kotlin security fixes' }).click();
            await expect(page).toHaveURL(new RegExp(`${NEWSLETTER_URL}$`));
            const form = page.getByRole('form', { name: 'Security newsletter signup' });
            const email = form.getByRole('textbox', { name: 'Email' });
            const submit = form.getByRole('button', { name: 'Submit' });
            await submit.click();
            await expect(email).toBeFocused();
            await email.fill('invalid-email');
            await submit.click();
            expect(requests).toEqual([]);

            await email.fill(emailAddress);
            await submit.click();
            await expect(form.getByRole('alert')).toContainText('Please try again');
            await expect(email).toHaveValue(emailAddress);
            expect(requests).toEqual(['/services/acceptAgreement', '/marketo']);
            await submit.click();
            await expect(form.getByRole('status')).toContainText('Thanks for signing up');
            await expect(submit).toBeDisabled();
            expect(requests).toEqual(['/services/acceptAgreement', '/marketo', '/services/acceptAgreement', '/marketo']);
            expect(await lts.expectNoOverflow()).toBe(true);
        });

        test('section navigation reveals the process and closes the mobile menu', async ({ page }) => {
            await lts.openSection('How it works');
            await expect(page).toHaveURL(/#how$/);
            if (viewport.width === 390) {
                await expect(page.getByRole('link', { name: 'How it works', exact: true })).toHaveCount(0);
            }
            const heading = lts.process.getByRole('heading', { level: 2 });
            await expect(heading).toBeInViewport({ ratio: 1 });
            await expect
                .poll(async () => {
                    const headingBox = await heading.boundingBox();
                    const navigationBox = await page.getByTestId('top-menu').boundingBox();
                    return headingBox.y - (navigationBox.y + navigationBox.height);
                })
                .toBeGreaterThanOrEqual(0);
        });
    });
}

test('completes a Forms Service CAPTCHA challenge before confirming the contact request', async ({ page }) => {
    let submissions = 0;
    const assessments: unknown[] = [];

    await page.route('https://data.services.jetbrains.com/geo', (route) =>
        route.fulfill({ headers: CORS_HEADERS, json: { code: 'NL' } })
    );
    await page.route(`https://account.jetbrains.com${EMAIL_VALIDATION_PATH}?**`, (route) =>
        route.fulfill({ headers: CORS_HEADERS, json: { isValid: true } })
    );
    await page.route(/https:\/\/www\.google\.com\/recaptcha\/api\.js\?/, (route) =>
        route.fulfill({
            contentType: 'application/javascript',
            body: "window.grecaptcha = { ready: (done) => done(), execute: async () => 'test-token' };",
        })
    );
    await page.route('https://forms-service.jetbrains.com/**', async (route) => {
        const request = route.request();
        if (request.method() === 'OPTIONS') {
            await route.fulfill({ status: 204, headers: CORS_HEADERS });
            return;
        }
        if (request.url() === FORMS_SERVICE_URL) {
            submissions += 1;
            await route.fulfill({
                status: 429,
                headers: CORS_HEADERS,
                json: {
                    success: false,
                    assessment: {
                        assessmentType: 'reCaptcha v3',
                        requestId: 'test-request',
                        captchaDetails: { siteKey: 'test-site-key' },
                    },
                },
            });
            return;
        }
        if (new URL(request.url()).pathname === '/assessment') {
            assessments.push(request.postDataJSON());
            await route.fulfill({ headers: CORS_HEADERS, json: { success: true } });
            return;
        }
        await route.abort();
    });

    await page.goto(CONTACT_TEAM_URL);
    const form = page.locator(testSelector('wtform'));
    await form.getByLabel('First name *', { exact: true }).fill('Test');
    await form.getByLabel('Last name *', { exact: true }).fill('Inquiry');
    await form.getByLabel('Work email address *', { exact: true }).fill('lts-form-test@company.example');
    await form.getByLabel('Company *', { exact: true }).fill('Example Company');
    await form.getByLabel('Role *').selectOption('Manager');
    await form.getByLabel('Country/Region *').selectOption('Germany');
    const teamSize = form.getByRole('radio', { name: '26-50' });
    await teamSize.press('Space');
    await expect(teamSize).toBeChecked();
    await form.getByRole('button', { name: 'Send request', exact: true }).press('Enter');

    await expect(page.getByRole('main').getByRole('status')).toContainText('Request sent');
    expect(submissions).toBe(1);
    expect(assessments).toEqual([
        {
            requestId: 'test-request',
            assessmentResponse: { token: 'test-token', type: 'reCaptcha v3' },
        },
    ]);
});

test('keeps animated-section content available without JavaScript', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce', baseURL });
    const page = await context.newPage();
    await page.goto('/kotlin-lts/');
    const lts = new KotlinLtsPage(page);
    await expect(lts.benefits.getByRole('table')).toBeVisible();
    await expect(lts.coverage.getByRole('listitem')).toHaveCount(5);
    for (const card of [
        ...(await lts.coverage.getByRole('listitem').all()),
    ]) {
        await expect(card).toBeVisible();
    }
    await context.close();
});

test('keeps both LTS forms disabled without JavaScript', async ({
    browser,
    baseURL,
}) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await context.newPage();
    for (const path of [CONTACT_TEAM_URL, NEWSLETTER_URL]) {
        await page.goto(path);
        await expect(page.getByRole('main').getByRole('textbox').first()).toBeDisabled();
        await expect(page.getByRole('main').getByRole('button', { name: /Send|Submit/ })).toBeDisabled();
    }
    await context.close();
});
