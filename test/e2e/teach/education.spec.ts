import { expect, test } from '@playwright/test';
import { TeachPage } from '../../page/teach/education';
import { closeExternalBanners } from '../utils';
import { testSelector } from '../../utils';

const SIGNUP_LINK = 'https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators' as const;
const MAILTO_LINK = 'mailto:education@kotlinlang.org' as const;
const MATERIALS_LINK = 'https://drive.google.com/drive/folders/1nN3LuyEfmBaSDZpnb4VA9kDuLakmVXH1?usp=drive_link' as const;

test.describe('Education landing page content and interactions', async () => {
    test.beforeEach(async ({ context, page, baseURL }) => {
        const teachPage = new TeachPage(page);
        await teachPage.init();
        await closeExternalBanners(context, page, baseURL);
    });

    test('Should load the education page correctly', async ({ page }) => {
        expect(await page.title()).toBe('Kotlin for Education');

        const mainContent = page.locator(testSelector('teach-index-page'));
        await expect(mainContent).toBeVisible();

        const title = mainContent.locator('h1');
        await expect(title).toBeVisible();
        expect(await title.textContent()).toBe('Teach Computer Science with Kotlin');
    });

    test('Should have working navigation buttons', async ({ page }) => {
        await expect(page.locator('.teach-sticky-menu a[href="/education/"]')).toBeVisible();

        await expect(page.locator('.teach-sticky-menu nav span').getByText('Overview', { exact: true })).toBeVisible();
        await expect(page.locator('.teach-sticky-menu nav a[href="/education/why-teach-kotlin.html"]')).toBeVisible();
        await expect(page.locator('.teach-sticky-menu nav a[href="/education/courses.html"]')).toBeVisible();

        await expect(page.locator(`.teach-sticky-menu a[href="${SIGNUP_LINK}"]`)).toBeVisible();

        expect(await page.locator('.teach-sticky-menu').screenshot()).toMatchSnapshot('sticky-menu.png');
    });

    test('Should display course materials download button', async ({ page }) => {
        const block = page.locator('.teach-launch-course__text');

        const button = block.locator(`a[href="${MATERIALS_LINK}"]`);
        await expect(button).toBeVisible();

        expect(await block.screenshot()).toMatchSnapshot('launch-course-text.png');
    });

    test('Should display features section with three features', async ({ page }) => {
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
        await expect(map).toBeVisible();

        await expect(map.locator('.gm-style')).toBeVisible();

        // The map should have markers
        const markers = page.locator('.teach-map-marker');
        expect(await markers.count()).toBeGreaterThan(100);

        // Check if at least one marker is visible
        let marker = markers.nth(36);
        await expect(marker).toBeVisible();
        await expect(marker).not.toHaveClass('teach-map-marker__active');

        await marker.scrollIntoViewIfNeeded();
        const box = await marker.boundingBox();
        await page.mouse.move(box.x, box.y);
        await page.mouse.down();
        await page.waitForTimeout(100);
        await page.mouse.up();

        // await expect(marker).toHaveClass('teach-map-marker_active');
        const tooltip = marker.locator('.teach-map-tooltip');
        await expect(tooltip).toBeVisible();
    });

    test('Should display navigation buttons', async ({ page }) => {
        const bottom = page.locator('.teach-universities__bottom');
        await expect(bottom).toBeVisible();

        // Check if the mailto button is visible and working
        const mailtoButton = bottom.locator(`a[href="${MAILTO_LINK}"]`);
        await expect(mailtoButton).toBeVisible();

        // Check if the "All Universities" button is visible
        const allUniversitiesButton = bottom.locator('a[href="courses.html"]');
        await expect(allUniversitiesButton).toBeVisible();
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
            await expect(item).toHaveText(expectedTitles[i]);
            const links = item.locator(':scope + .teach-list > li');
            expect(await links.count()).toBeGreaterThan(0);
        }
    });

    test('Should have a working YouTube player', async ({ page }) => {
        const youtubePlayer = page.locator('.teach-video');
        await expect(youtubePlayer).toBeVisible();
    });

    test('Should have a working subscription form', async ({ page }) => {
        const subscriptionForm = page.locator('.teach-subscription-section');
        await expect(subscriptionForm).toBeVisible();
    });


    test('Should have action buttons for educators', async ({ page }) => {
        // Look for the "Connect with us" section which contains the CTA buttons
        const connectUs = page.locator('section [class*=ktl-cta-block-module_wrapper]');

        const title = connectUs.getByText('Connect with us');
        await expect(title).toBeVisible();

        // Check for the Slack signup button
        const slackButton = connectUs.locator(`a[href="${SIGNUP_LINK}"]`);
        await expect(slackButton).toBeVisible();

        // Check for the email button
        const emailButton = connectUs.locator(`a[href="${MAILTO_LINK}"]`);
        await expect(emailButton).toBeVisible();

        expect(await connectUs.screenshot()).toMatchSnapshot('connect-us.png');
    });
});