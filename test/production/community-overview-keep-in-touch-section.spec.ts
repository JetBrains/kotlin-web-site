import { expect, test } from '@playwright/test';
import { CommunityPage } from '../page/community-page';

let communityPage: CommunityPage = null;

test.describe('Community page, overview tab, keep in touch section', () => {
    test.beforeEach(async ({ page }) => {
        communityPage = new CommunityPage(page);
        await communityPage.init();
    });

    test('Slack button opens the related page', async ({ page, context }) => {
        const slackButton = communityPage.keepInTouchBlock.getByRole('link', { name: 'Slack' }).first();
        await expect(slackButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await slackButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://slack-chats.kotlinlang.org/');
    });

    test('X (Twitter) button opens the related page', async ({ page, context }) => {
        const twitterButton = communityPage.keepInTouchBlock.getByTitle('X').first();
        await expect(twitterButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await twitterButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://x.com/kotlin');
    });

    test('Kotlin Blog button opens the related page', async ({ page, context }) => {
        const blogButton = communityPage.keepInTouchBlock.getByRole('link', { name: 'Kotlin Blog' }).first();
        await expect(blogButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await blogButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://blog.jetbrains.com/kotlin/');
    });

    test('Reddit button opens the related page', async ({ page, context }) => {
        const redditButton = communityPage.keepInTouchBlock.getByRole('link', { name: 'Reddit' }).first();
        await expect(redditButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await redditButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://www.reddit.com/r/Kotlin/');
    });

    test('StackOverflow button opens the related page', async ({ page, context }) => {
        const stackOverflowButton = communityPage.keepInTouchBlock.getByRole('link', { name: 'StackOverflow' });
        await expect(stackOverflowButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await stackOverflowButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://stackoverflow.com/questions/tagged/kotlin');
    });

    // Without click on YouTube button, because of YouTube Cookies page, but it checks that the button contains the right link.
    test('YouTube button opens the related page', async ({ page }) => {
        const youtubeButton = communityPage.keepInTouchBlock.getByRole('link', { name: 'YouTube' }).first();
        await expect(youtubeButton).toBeVisible();
        const href = await youtubeButton.getAttribute('href');
        expect(href).toBe('https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw')
    });

    test('Talking Kotlin button opens the related page', async ({ page, context }) => {
        const talkingKotlinButton = communityPage.keepInTouchBlock.getByRole('link', { name: 'Talking Kotlin' });
        await expect(talkingKotlinButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await talkingKotlinButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('talkingkotlin.com/');
    });

    // Without click on LinkedIn button, since LinkedIn requires authorization, but it checks that the button contains the right link.
    test('LinkedIn button opens the related page', async ({ page }) => {
        const linkedInButton = communityPage.keepInTouchBlock.getByRole('link', { name: 'LinkedIn' });
        await expect(linkedInButton).toBeVisible();
        const href = await linkedInButton.getAttribute('href');
        expect(href).toBe('https://www.linkedin.com/groups/7417237/profile');
    });

    test('Issue Tracker button opens the related page', async ({ page, context }) => {
        const issueTrackerButton = communityPage.keepInTouchBlock.getByRole('link', { name: 'Issue Tracker' }).first();
        await expect(issueTrackerButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await issueTrackerButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://youtrack.jetbrains.com/issues/kt');
    });
});