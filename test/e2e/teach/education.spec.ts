import { expect, test } from '@playwright/test';
import { TeachPage } from '../../page/teach/education';
import { closeExternalBanners } from '../utils';
import { testSelector } from '../../utils';
import { checkTeachCta, checkTeachMap, checkTeachNav, MAILTO_LINK, MATERIALS_LINK, SIGNUP_LINK } from './utils';

test.describe('Education landing page content and interactions', async () => {
    test.beforeEach(async ({ context, page, baseURL }) => {
        const teachPage = new TeachPage(page);
        await teachPage.init();
        await closeExternalBanners(context, page, baseURL);
    });

    test('Should load the education page correctly', async ({ page }) => {
        // Check if the page title is correct
        expect(await page.title()).toBe('Kotlin for Education');

        // Check if the main content is visible
        const mainContent = page.locator(testSelector('teach-index-page'));
        await expect(mainContent).toBeVisible();

        // Check if the page heading is correct
        const title = mainContent.locator('h1');
        await expect(title).toBeVisible();

        expect(await title.textContent()).toBe('Teach Computer Science with Kotlin');
    });

    test('Should have working navigation buttons', async ({ page }) => {
        await checkTeachNav(page, 'Overview');
    });

    test('Should display course materials download button', async ({ page }) => {
        const block = page.locator('.teach-launch-course__text');

        // Locate and verify the download button with the exact name match
        const button = block.getByRole('link', { name: 'Download all materials →', exact: true });
        await expect(button).toBeVisible();
        await expect(button).toHaveAttribute('href', MATERIALS_LINK);

        expect(await block.screenshot()).toMatchSnapshot('launch-course-text.png');
    });

    test('Should display features section with features', async ({ page }) => {
        // Check if the features section is visible
        const featuresSection = page.locator('.teach-features');
        await expect(featuresSection).toBeVisible();

        // Check if there are exactly 3 features
        const expectedFeatures = ['Academically recognized', 'Language of the industry', 'Multiplatform'];
        const features = featuresSection.locator('.teach-feature');
        expect(await features.count()).toBe(3);

        // Check each feature
        for (let i = 0; i < expectedFeatures.length; i++) {
            const feature = features.nth(i);
            await expect(feature.locator('.teach-feature__icon img')).toBeVisible();
            expect(await feature.locator('.ktl-h3').textContent()).toBe(expectedFeatures[i]);
        }

        expect(await featuresSection.screenshot()).toMatchSnapshot('teach-features.png');
    });

    test('Should display buttons in top section', async ({ page }) => {
        // Get the top buttons block container
        const block = page.locator('.teach-top-buttons');

        // Check the "Join Educators Community" button visibility and link
        const join = block.getByRole('link', { name: 'Join Educators Сommunity', exact: true });
        await expect(join).toBeVisible();
        await expect(join).toHaveAttribute('href', SIGNUP_LINK);

        // Check the "Why Teach Kotlin" button visibility and link
        const why = block.getByRole('link', { name: 'Why Teach Kotlin →', exact: true });
        await expect(why).toBeVisible();
        await expect(why).toHaveAttribute('href', 'why-teach-kotlin.html');

        expect(await block.screenshot()).toMatchSnapshot('teach-top-mobile-buttons.png');
    });

    test('Should display university statistics correctly', async ({ page }) => {
        // Check if the university count is displayed
        const universitiesText = page.locator('.universities-top__title h2');
        expect(await universitiesText.textContent()).toBe('Kotlin Courses Around the World');

        // Check if the TeachNumbers component is visible
        const teachNumbers = page.locator('.universities-top__numbers');
        await expect(teachNumbers).toBeVisible();

        // Check if the TeachNumbers component is visible
        const subtitles = teachNumbers.locator('.teach-number__subtitle');
        expect(await subtitles.count()).toBe(2);
        expect(await subtitles.nth(0).textContent()).toBe('countries');
        expect(await subtitles.nth(1).textContent()).toBe('universities');
    });

    test('Should display university logos', async ({ page }) => {
        // Check if the university logos are visible
        const logos = page.locator('.teach-logos__logo');
        expect(await logos.count()).toBe(5);

        // Check specific universities
        await expect(page.locator('img[alt="Harvard University"]')).toBeVisible();
        await expect(page.locator('img[alt="University of Cambridge"]')).toBeVisible();
        await expect(page.locator('img[alt="Stanford University"]')).toBeVisible();
        await expect(page.locator('img[alt="Imperial College London"]')).toBeVisible();
        await expect(page.locator('img[alt="The University of Chicago"]')).toBeVisible();

        expect(await page.locator('.teach-logos').screenshot()).toMatchSnapshot('teach-logos.png');
    });

    test('Should have a working interactive map', async ({ page }) => {
        // Check if the map is visible
        const map = page.locator('.teach-map__wrapper');
        await checkTeachMap(page, map);
    });

    test('Should display navigation buttons', async ({ page }) => {
        const bottom = page.locator('.teach-universities__bottom');
        await expect(bottom).toBeVisible();

        // Check if the mailto button is visible and working
        const mailtoButton = bottom.getByRole('link', { name: 'education@kotlinlang.org.', exact: true });
        await expect(mailtoButton).toBeVisible();
        await expect(mailtoButton).toHaveAttribute('href', MAILTO_LINK);

        // Check if the "All Universities" button is visible
        const allUniversitiesButton = bottom.getByRole('link', { name: 'All universities', exact: true });
        await expect(allUniversitiesButton).toBeVisible();
        await expect(allUniversitiesButton).toHaveAttribute('href', 'courses.html');
    });

    test('Should have comprehensive resource links section', async ({ page }) => {
        // Check if the resources section is visible
        const resourcesSection = page.locator('#start-teaching-kotlin');
        await expect(resourcesSection).toBeVisible();

        // Check section title
        const sectionTitle = resourcesSection.locator('h2');
        await expect(sectionTitle).toHaveText('Start Teaching Kotlin with These Resources');

        // Check category headings
        const expectedTitles = ['Get started', 'Tools', 'Online Courses', 'Android in Kotlin', 'Practice Kotlin'];
        const categoryHeadings = resourcesSection.locator('.ktl-h4');
        await expect(categoryHeadings).toHaveCount(expectedTitles.length);

        // Check each category heading and its associated links
        for (let i = 0; i < expectedTitles.length; i++) {
            const item = categoryHeadings.nth(i);
            await expect(item, `Category heading should be ${expectedTitles[i]}`).toHaveText(expectedTitles[i]);
            const links = item.locator(':scope + .teach-list > li');
            expect(await links.count(), `${expectedTitles[i]} category should have at least one link`).toBeGreaterThan(0);
        }
    });

    test('Should have a working subscription form', async ({ page }) => {
        const email = 'test@example.com';

        await page.route('https://forms-service.jetbrains.com/marketo', route => {
            if (route.request().method() !== 'POST') route.continue();
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ 'success': true, 'cause': [] })
            });
        });

        await page.route(`https://account.jetbrains.com/services/acceptAgreement?email=${encodeURIComponent(email)}&type=mkt.newsletter.visitor`, route => {
            if (route.request().method() !== 'POST') route.continue();
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ 'status': 'OK' })
            });
        });

        // Locate the subscription form
        const subscriptionForm = page.locator('.teach-subscription-section');
        await expect(subscriptionForm).toBeVisible();

        // Find the form elements
        await subscriptionForm.locator('input[name="Email"]').fill(email);

        // Check the privacy checkbox by clicking its label
        await subscriptionForm.locator('.teach-subscription-form__checkbox label').click();

        // Submit the form
        await subscriptionForm.locator('button[type="submit"]').click();

        // Verify that the form shows the submitted state (check icon appears)
        await expect(subscriptionForm.locator('.teach-subscription-form__submitted-icon')).toBeVisible();

        expect(await subscriptionForm.screenshot()).toMatchSnapshot('subscription-form.png');
    });

    test('Should have a working YouTube player', async ({ page }) => {
        // Check if the YouTube player container is visible
        const youtubePlayer = page.locator('.teach-video');
        await expect(youtubePlayer).toBeVisible();

        // Check if the player is in "show video" mode
        await expect(youtubePlayer.locator('[class*="ktl-youtube-player-module_preview_"]')).toBeVisible();

        // Check if the play button is visible
        const playButton = youtubePlayer.locator('[class*="ktl-youtube-player-module_play-button_"]');
        await expect(playButton).toBeVisible();

        // Click the play button to start the video
        await playButton.click();

        // After clicking, the play button should be hidden and the video should be playing
        await expect(playButton).toBeHidden();

        // Check if the iframe is loaded correctly
        const iframe = youtubePlayer.locator('iframe');
        await expect(iframe).toBeVisible();

        // Check if the iframe has the correct src attribute (YouTube embed URL)
        const iframeSrc = await iframe.getAttribute('src');
        expect(iframeSrc).toBeTruthy();
        expect(iframeSrc).toContain('youtube.com');
        expect(iframeSrc).toContain('PLlFc5cFwUnmzT4cgLOGJYGnY6j0W2xoFA');
    });

    test('Should have working quotes slider', async ({ page }) => {
        const quotes = page.locator('[class*=ktl-quotes-slider-module_quotes-slider_]');

        // Initial state of quotes
        const defaultAuthor = quotes.getByText('David Vaughn', { exact: false });
        await expect(defaultAuthor).toBeVisible();

        const quoteContent = quotes.getByText('Kotlin is faster to develop', { exact: false });
        await expect(quoteContent).toBeVisible();

        // Controls of navigation
        const controls = page.locator('[class*=ktl-quotes-slider-module_control_]');
        await expect(controls).toHaveCount(2);

        const backButton = controls.first();
        await expect(backButton).not.toHaveClass(/ktl-quotes-slider-module_control-active_/);

        const forwardButton = controls.last();
        await expect(forwardButton).toHaveClass(/ktl-quotes-slider-module_control-active_/);

        await forwardButton.click();

        await expect(quotes.getByText('Sergey Bratus')).toBeVisible();
        await expect(quotes.getByText('I used Kotlin')).toBeVisible();

        await expect(backButton).toHaveClass(/ktl-quotes-slider-module_control-active_/);
    });

    test('Should have action buttons for educators', checkTeachCta);
});