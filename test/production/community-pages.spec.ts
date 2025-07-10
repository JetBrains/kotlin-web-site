import { expect, test } from '@playwright/test';
import { testSelector } from '../utils';

test.describe('Community Pages', () => {
    test('Main community page elements', async ({ page }) => {
        // Navigate to the community page
        await page.goto('/community/');

        // Check banner
        const banner = page.locator(testSelector('community-banner'));
        await expect(banner).toBeVisible();
        await expect(banner.getByText('Get involved in the community')).toBeVisible();

        // Check "Keep in Touch" section
        const keepInTouchLinks = [
            { title: 'Slack', url: 'https://slack-chats.kotlinlang.org/' },
            { title: 'X', url: 'https://twitter.com/kotlin' },
            { title: 'Kotlin Blog', url: 'https://blog.jetbrains.com/kotlin/' },
            { title: 'Reddit', url: 'https://www.reddit.com/r/Kotlin/' },
            { title: 'StackOverflow', url: 'https://stackoverflow.com/questions/tagged/kotlin' },
            { title: 'YouTube', url: 'https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw' },
            { title: 'Talking Kotlin', url: 'http://talkingkotlin.com/' },
            { title: 'LinkedIn', url: 'https://www.linkedin.com/groups/7417237/profile' },
            { title: 'Issue Tracker', url: 'https://youtrack.jetbrains.com/issues/kt' }
        ];

        for (const link of keepInTouchLinks) {
            const linkElement = page.locator('[class*=keep-in-touch_]').getByRole('link').locator(`:scope[href="${link.url}"]`);
            await expect(linkElement).toBeVisible();
            await expect(linkElement.getByText(link.title, { exact: true }), `Text "${link.title}" should be visible`).toBeVisible();
        }

        // Check "Join a Kotlin User Group" link
        const kugLink = page.getByRole('link', { name: 'All KUGs →' });
        await expect(kugLink).toBeVisible();
        await expect(kugLink).toHaveAttribute('href', '/community/user-groups/');
    });

    test('Community events page elements', async ({ page }) => {
        // Navigate to the events page
        await page.goto('/community/events/');

        // Check title
        expect(await page.title()).toBe('Community Events');

        // Check EventList component
        await expect(page.locator('[class*=event-list_wrapper_]')).toBeVisible();

        // Check "Support for Kotlin speakers" section
        const speakersSection = page.getByText('Support for Kotlin speakers');
        await expect(speakersSection).toBeVisible();

        const speakerButton = page.getByRole('link', { name: 'I am a Speaker →' });
        await expect(speakerButton).toBeVisible();
        await expect(speakerButton).toHaveAttribute('href', 'https://surveys.jetbrains.com/s3/Submit-a-Kotlin-Talk');

        // Check "Organize a Kotlin Night" section
        const organizeSection = page.getByText('Organize a Kotlin Night →');
        await expect(organizeSection).toBeVisible();

        const organizeButton = page.getByRole('link', { name: 'Organize a Kotlin Night →' });
        await expect(organizeButton).toBeVisible();
        await expect(organizeButton).toHaveAttribute('href', 'https://kotlinlang.org/docs/kotlin-night-guidelines.html');
    });

    test('User groups page elements', async ({ page }) => {
        // Navigate to the user groups page
        await page.goto('/community/user-groups/');

        // Check title
        expect(await page.title()).toBe('Kotlin User Groups');

        // Check KugsBanner component
        const banner = page.locator('[class*=kugs-banner_banner_]');
        await expect(banner).toBeVisible();
        await expect(banner.getByText('Kotlin User Groups (KUGs)')).toBeVisible();

        // Check KugMap component
        const map = page.locator('[class*=kug-map_map_]');
        await expect(map).toBeVisible();

        // Check KugsList component
        const list = page.locator('[class*=kugs-list_wrapper_]');
        await expect(list).toBeVisible();
    });

    test('Navigation between community pages', async ({ page }) => {
        // Start at the main community page
        await page.goto('/community/');

        // Navigate to user groups page
        const kugLink = page.getByRole('link', { name: 'All KUGs →' });
        await kugLink.click();

        // Check we're on the user groups page
        expect(page.url()).toContain('/community/user-groups/');
        await expect(page.locator('title')).toContainText('Kotlin User Groups');

        // Navigate back to main community page via header
        await page.getByRole('link', { name: 'Community' }).first().click();

        // Check we're back on the main community page
        expect(page.url()).toContain('/community/');
        await expect(page.locator(testSelector('community-banner'))).toBeVisible();
    });
});