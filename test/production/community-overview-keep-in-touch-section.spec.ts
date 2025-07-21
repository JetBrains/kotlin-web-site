import { expect, test } from '@playwright/test';

test.describe('Community page, overview tab, keep in touch section', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/community/');
        await page.waitForSelector('button.ch2-btn.ch2-btn-primary');
        await page.click('button.ch2-btn.ch2-btn-primary');
    });

    test('Slack button opens the related page', async ({ page, context }) => {
        const slackButton = page.getByRole('link', { name: 'Slack' }).first();
        await expect(slackButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await slackButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://slack-chats.kotlinlang.org/');
    });

    test('X (Twitter) button opens the related page', async ({ page, context }) => {
        const twitterButton = page.getByRole('link', { name: 'X' }).first();
        await expect(twitterButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await twitterButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://x.com/kotlin');
    });

    test('Kotlin Blog button opens the related page', async ({ page, context }) => {
        const blogButton = page.getByRole('link', { name: 'Kotlin Blog' }).first();
        await expect(blogButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await blogButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://blog.jetbrains.com/kotlin/');
    });

    test('Reddit button opens the related page', async ({ page, context }) => {
        const redditButton = page.getByRole('link', { name: 'Reddit' }).first();
        await expect(redditButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await redditButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://www.reddit.com/r/Kotlin/');
    });

    test('StackOverflow button opens the related page', async ({ page, context }) => {
        const stackOverflowButton = page.getByRole('link', { name: 'StackOverflow' });
        await expect(stackOverflowButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await stackOverflowButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://stackoverflow.com/questions/tagged/kotlin');
    });

    // Without click on YouTube button, because of YouTube Cookies page, but it checks that the button contains the right link.
    test('YouTube button opens the related page', async ({ page }) => {
        const youtubeButton = page.getByRole('link', { name: 'YouTube' }).first();
        await expect(youtubeButton).toBeVisible();
        const href = await youtubeButton.getAttribute('href');
        expect(href).toBe('https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw')
    });

    test('Talking Kotlin button opens the related page', async ({ page, context }) => {
        const talkingKotlinButton = page.getByRole('link', { name: 'Talking Kotlin' });
        await expect(talkingKotlinButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await talkingKotlinButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('talkingkotlin.com/');
    });

    // Without click on LinkedIn button, since LinkedIn requires authorization, but it checks that the button contains the right link.
    test('LinkedIn button opens the related page', async ({ page }) => {
        const linkedInButton = page.getByRole('link', { name: 'LinkedIn' });
        await expect(linkedInButton).toBeVisible();
        const href = await linkedInButton.getAttribute('href');
        expect(href).toBe('https://www.linkedin.com/groups/7417237/profile');
    });

    test('Issue Tracker button opens the related page', async ({ page, context }) => {
        const issueTrackerButton = page.getByRole('link', { name: 'Issue Tracker' }).first();
        await expect(issueTrackerButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await issueTrackerButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://youtrack.jetbrains.com/issues/kt');
    });
});