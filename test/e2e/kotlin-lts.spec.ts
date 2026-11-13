import { expect, Page, test } from '@playwright/test';
import { KotlinLtsPage } from '../page/kotlin-lts-page';
import { CONTACT_TEAM_URL, NEWSLETTER_URL, PUBLIC_SUPPORT_URL } from '../../blocks/kotlin-lts/constants';

function observeSubmissions(page: Page) {
    const requests: string[] = [];
    page.on('request', (request) => {
        // The global shell sends page analytics. Form values must never appear in those requests either.
        const analyticsHost =
            /(^|\.)(google-analytics\.com|analytics\.google\.com|doubleclick\.net|optimizely\.com)$/.test(
                new URL(request.url()).hostname
            );
        const containsFormValue = `${request.url()} ${request.postData() || ''}`.includes('lts-preview-test');
        if ((request.method() !== 'GET' && !analyticsHost) || containsFormValue) {
            requests.push(`${request.method()} ${request.url()}`);
        }
    });
    return requests;
}

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
            await expect(lts.main.getByRole('heading', { level: 1 })).toHaveText('Kotlin Targeted Security Patches');
            expect(
                await lts.main
                    .locator(':scope > section')
                    .evaluateAll((sections) => sections.map((section) => section.getAttribute('data-testid')))
            ).toEqual([
                'lts-hero',
                'lts-newsletter',
                'lts-constraints',
                'lts-benefits',
                'lts-coverage',
                'lts-how',
                'lts-faq',
                'lts-cta',
            ]);
            await expect(lts.coverage.getByRole('heading', { level: 3 })).toHaveText([
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
            await expect(lts.coverage).toContainText('agreed for your subscription');
            await expect(lts.coverage.getByRole('link', { name: 'Contact the team', exact: true })).toHaveAttribute(
                'href',
                CONTACT_TEAM_URL
            );
            await expect(lts.benefits.getByRole('link', { name: 'Read the public support policy' })).toHaveAttribute(
                'href',
                PUBLIC_SUPPORT_URL
            );
            await expect(lts.process.getByRole('heading', { level: 2 })).toHaveText(
                'Targeted Patches in Your Workflow'
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
            await expect(included).toHaveAttribute('href', '#benefits');
            await included.click();
            await expect(lts.benefits.getByRole('heading', { level: 2 })).toBeInViewport({ ratio: 1 });
            await expect(lts.newsletter.getByRole('link', { name: 'Subscribe to updates' })).toHaveAttribute(
                'href',
                NEWSLETTER_URL
            );
            await lts.coverage.getByRole('link', { name: 'Contact the team', exact: true }).click();
            await expect(page).toHaveURL(new RegExp(`${CONTACT_TEAM_URL}$`));
            await expect(page.getByRole('heading', { level: 1 })).toHaveText('Discuss a commercial subscription');
            await expect(page.getByRole('checkbox')).toHaveCount(0);
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
                lts.benefits.getByRole('article').first(),
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
                ...(await lts.benefits.getByRole('article').all()),
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
            await expect(items).toHaveCount(7);
            for (const item of await items.all()) await expect(item).not.toHaveAttribute('open', '');
            const question = lts.faq.getByText('What happens after I contact the team?', { exact: true });
            await question.focus();
            await question.press('Enter');
            await expect(items.nth(5)).toHaveAttribute('open', '');
            await expect(items.nth(5).getByText(/We’ll review your components/)).toBeVisible();
            await question.press('Space');
            await expect(items.nth(5)).not.toHaveAttribute('open', '');
            await expect(items.nth(5).getByText(/We’ll review your components/)).not.toBeVisible();
        });

        test('validates inquiry fields and clearly previews without sending or enrolling', async ({ page }) => {
            await page.goto(CONTACT_TEAM_URL);
            const form = page.getByRole('form', { name: 'Commercial support inquiry preview' });
            const submit = form.getByRole('button', { name: 'Preview request' });
            const status = form.getByRole('status');
            const requests = observeSubmissions(page);
            await expect(form.locator('input:required')).toHaveCount(3);
            await submit.click();
            await expect(form.getByLabel('Full name *', { exact: true })).toBeFocused();
            await expect(status).toHaveCount(0);
            await form.getByLabel('Full name *', { exact: true }).fill('lts-preview-test');
            await form.getByLabel('Work email *', { exact: true }).fill('invalid-email');
            await form.getByLabel('Company *', { exact: true }).fill('lts-preview-test');
            await submit.click();
            expect(
                await form
                    .getByLabel('Work email *', { exact: true })
                    .evaluate((el: HTMLInputElement) => el.validity.typeMismatch)
            ).toBe(true);
            await expect(status).toHaveCount(0);
            await form.getByLabel('Work email *', { exact: true }).fill('lts-preview-test@example.com');
            await submit.click();
            await expect(status).toContainText('No request has been sent');
            await expect(page).toHaveURL(new RegExp(`${CONTACT_TEAM_URL}$`));
            await expect(form.getByRole('checkbox')).toHaveCount(0);
            expect(requests).toEqual([]);
            await form.getByLabel('Components and versions (optional)').fill('Kotlin');
            await expect(status).toHaveCount(0);
        });

        test('requires a newsletter topic, permits every combination, and never creates a subscription', async ({
            page,
        }) => {
            await lts.newsletter.getByRole('link', { name: 'Subscribe to updates' }).click();
            await expect(page).toHaveURL(new RegExp(`${NEWSLETTER_URL}$`));
            const form = page.getByRole('form', { name: 'Security newsletter signup preview' });
            const topics = form.getByRole('checkbox');
            const submit = form.getByRole('button', { name: 'Preview signup' });
            const requests = observeSubmissions(page);
            await expect(topics).toHaveCount(3);
            for (const topic of await topics.all()) await expect(topic).not.toBeChecked();
            await submit.click();
            await expect(form.getByLabel('Email *', { exact: true })).toBeFocused();
            await form.getByLabel('Email *', { exact: true }).fill('lts-preview-test@example.com');
            await submit.click();
            await expect(form.getByRole('alert')).toHaveText('Please select at least one security update topic.');
            await expect(topics.first()).toBeFocused();
            await topics.first().press('Space');
            await expect(topics.first()).toBeChecked();
            await form.getByText('Kotlin Core', { exact: true }).click();
            await expect(topics.first()).not.toBeChecked();
            const topicNames = ['Kotlin Core', 'Kotlin ecosystem', 'Broader JVM ecosystem'];
            for (let mask = 1; mask < 8; mask++) {
                for (let index = 0; index < 3; index++) {
                    const checked = Boolean(mask & (1 << index));
                    if ((await topics.nth(index).isChecked()) !== checked) {
                        await form.getByText(topicNames[index], { exact: true }).click();
                    }
                    await expect(topics.nth(index)).toBeChecked({ checked });
                }
                await expect(form.getByRole('alert')).toBeHidden();
                await submit.click();
                await expect(form.getByRole('status')).toContainText(
                    'No email has been sent and no subscription has been created.'
                );
            }
            for (const name of topicNames) await form.getByText(name, { exact: true }).click();
            await submit.click();
            await expect(form.getByRole('status')).toHaveCount(0);
            await expect(form.getByRole('alert')).toBeVisible();
            await expect(page).toHaveURL(new RegExp(`${NEWSLETTER_URL}$`));
            expect(await lts.expectNoOverflow()).toBe(true);
            expect(requests).toEqual([]);
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

test('keeps animated-section content available without JavaScript', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce', baseURL });
    const page = await context.newPage();
    await page.goto('/kotlin-lts/');
    const lts = new KotlinLtsPage(page);
    await expect(lts.benefits.getByRole('article')).toHaveCount(2);
    await expect(lts.coverage.getByRole('listitem')).toHaveCount(5);
    for (const card of [
        ...(await lts.benefits.getByRole('article').all()),
        ...(await lts.coverage.getByRole('listitem').all()),
    ]) {
        await expect(card).toBeVisible();
    }
    await expect(lts.coverage.getByRole('link', { name: 'Contact the team', exact: true })).toHaveAttribute(
        'href',
        CONTACT_TEAM_URL
    );
    await context.close();
});

test('previews remain disabled without JavaScript so native form submission cannot send entered data', async ({
    browser,
    baseURL,
}) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await context.newPage();
    for (const path of [CONTACT_TEAM_URL, NEWSLETTER_URL]) {
        await page.goto(path);
        await expect(page.getByRole('main').getByRole('textbox').first()).toBeDisabled();
        await expect(page.getByRole('main').getByRole('button', { name: /Preview/ })).toBeDisabled();
    }
    await context.close();
});
