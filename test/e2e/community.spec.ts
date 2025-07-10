import { expect, test } from '@playwright/test';
import { CommunityPage } from '../page/community-page';

const SOCIAL_LINKS = [
    ['Slack', 'https://slack-chats.kotlinlang.org/'],
    ['X', 'https://twitter.com/kotlin'],
    ['Kotlin Blog', 'https://blog.jetbrains.com/kotlin/'],
    ['Reddit', 'https://www.reddit.com/r/Kotlin/'],
    ['StackOverflow', 'https://stackoverflow.com/questions/tagged/kotlin'],
    ['YouTube', 'https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw'],
    ['Talking Kotlin', 'http://talkingkotlin.com/'],
    ['LinkedIn', 'https://www.linkedin.com/groups/7417237/profile'],
    ['Issue Tracker', 'https://youtrack.jetbrains.com/issues/kt']
] as const;


test.describe('Community pages', () => {
    test('Main community page loads correctly', async ({ page }) => {
        const communityPage = new CommunityPage(page);
        await communityPage.init();

        // Check page title
        const title = await page.title();
        expect(title).toBe('Community');

        // Check community banner is visible
        const banner = page.locator('[data-test="community-banner"]');
        await expect(banner).toBeVisible();

        // Check the "Keep in Touch" section title is visible
        const keepInTouchTitle = page.getByRole('heading', { name: 'Keep in Touch', exact: true });
        await expect(keepInTouchTitle).toBeVisible();

        // Then check for links in the "Keep in Touch" section
        const socials = keepInTouchTitle.locator(':scope ~ [class*=keep-in-touch_grid_]');
        await expect(socials).toBeVisible();

        const socialLinks = socials.getByRole('link');
        await expect(socialLinks).toHaveCount(SOCIAL_LINKS.length);

        for (const [title, href] of SOCIAL_LINKS) {
            const link = socialLinks.locator(`:scope[href="${href}"]`);
            await expect(link, `Link with href ${href} should be visible`).toBeVisible();
            await expect(socials.getByText(title, { exact: true }), `Text "${title}" should be visible`).toBeVisible();
        }

        // Check that the "Join a Kotlin User Group" link is present
        const kugLink = page.getByRole('link', { name: 'All KUGs →' });
        await expect(kugLink).toBeVisible();
        await expect(kugLink).toHaveAttribute('href', '/community/user-groups/');
    });

    test('Events page loads correctly', async ({ page }) => {
        // Navigate to the events page
        await page.goto('/community/events/');

        // Check page title
        const title = await page.title();
        expect(title).toBe('Community Events');

        // Check that the event list is visible
        const eventList = page.getByRole('heading', { name: 'Events' });
        await expect(eventList).toBeVisible();

        // Check that the "Support for Kotlin speakers" section is visible
        const speakersSection = page.getByText('Support for Kotlin speakers');
        await expect(speakersSection).toBeVisible();

        // Check that the "I am a Speaker" button is present
        const speakerButton = page.getByRole('link', { name: 'I am a Speaker →' });
        await expect(speakerButton).toBeVisible();
        await expect(speakerButton).toHaveAttribute('href', 'https://surveys.jetbrains.com/s3/Submit-a-Kotlin-Talk');

        // Check that the "Organize a Kotlin Night" section is visible
        const kotlinNightSection = page.getByRole('heading', { name: 'Organize a Kotlin Night' });
        await expect(kotlinNightSection).toBeVisible();

        // Check that the "Organize a Kotlin Night" button is present
        const kotlinNightButton = page.getByRole('link', { name: 'Organize a Kotlin Night →' });
        await expect(kotlinNightButton).toBeVisible();
        await expect(kotlinNightButton).toHaveAttribute('href', 'https://kotlinlang.org/docs/kotlin-night-guidelines.html');
    });

    test('User Groups page loads correctly', async ({ page }) => {
        // Navigate to the user groups page
        await page.goto('/community/user-groups/');

        // Check page title
        const title = await page.title();
        expect(title).toBe('Kotlin User Groups');

        // Check that the KUGs banner is visible
        const kugsBanner = page.getByRole('heading', { name: 'Kotlin User Groups' });
        await expect(kugsBanner).toBeVisible();

        // Check that the KUGs map is visible
        const kugsMap = page.getByRole('region', { name: /map/i });
        await expect(kugsMap).toBeVisible();

        // Check that the KUGs list is visible
        const kugsList = page.getByRole('heading', { name: /User Groups/i });
        await expect(kugsList).toBeVisible();
    });

    test('Global search works on community pages', async ({ page }) => {
        const communityPage = new CommunityPage(page);
        await communityPage.init();

        // Open a quick search
        await communityPage.globalSearch.openQuickSearch();

        // Check that a quick search is visible
        await communityPage.globalSearch.quickSearchIsVisible();

        // Input a search query
        await communityPage.globalSearch.inputQuickSearch('kotlin');

        // Check that search results are visible
        const searchResults = page.locator('[data-test="quick-search-results"]');
        await expect(searchResults).toBeVisible();

        // Close quick search
        await page.keyboard.press('Escape');
        await expect(page.locator('[data-test="quick-search-input"]')).toBeHidden();
    });
});