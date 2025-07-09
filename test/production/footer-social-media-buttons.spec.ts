import { test, expect } from '@playwright/test';

test.describe('Footer social media buttons', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('button.ch2-btn.ch2-btn-primary');
        await page.click('button.ch2-btn.ch2-btn-primary');
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
    });

    test('GitHub button should navigate to Kotlin GitHub page', async ({ page, context }) => {
        const githubButton = page.getByRole('link', { name: 'Kotlin on GitHub' });
        await expect(githubButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await githubButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('github.com/JetBrains/kotlin');
    });

    test('Twitter/X button should navigate to Kotlin Twitter page', async ({ page, context }) => {
        const twitterButton = page.getByRole('link', { name: 'Kotlin on Twitter' });
        await expect(twitterButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await twitterButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState()
        await expect(newPage.url()).toContain('https://x.com/kotlin');
    });

    test('Bluesky button should navigate to Bluesky page', async ({ page, context }) => {
        const blueskyButton = page.getByRole('link', { name: 'Kotlin on Bluesky' });
        await expect(blueskyButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await blueskyButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState()
        await expect(newPage.url()).toContain('https://bsky.app/profile/kotlinlang.org');
    });

    test('Slack button should navigate to Kotlin Slack Sign-up page', async ({ page, context }) => {
        const slackButton = page.getByRole('link', { name: 'Kotlin Slack' });
        await expect(slackButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await slackButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState()
        await expect(newPage.url()).toContain('https://surveys.jetbrains.com/s3/kotlin-slack-sign-up');
    });

    test('Reddit button should navigate to Kotlin on Reddit', async ({ page, context }) => {
        const redditButton = page.getByRole('link', { name: 'Kotlin on Reddit' });
        await expect(redditButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await redditButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState()
        await expect(newPage.url()).toContain('https://www.reddit.com/r/Kotlin/');
    });

    test('Stackoverflow button should navigate to Kotlin on Stackoverflow', async ({ page, context }) => {
        const stackoverflowButton = page.getByRole('link', { name: 'Kotlin on Stack Overflow' });
        await expect(stackoverflowButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await stackoverflowButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState()
        await expect(newPage.url()).toContain('https://stackoverflow.com/questions/tagged/kotlin');
    });

//Without click on YouTube button, because of YouTube Cookies page, but it checks that the button contains the right link.
    test('YouTube button should navigate to Kotlin on YouTube', async ({ page }) => {
        const youTubeButton = page.getByRole('link', { name: ' Kotlin on YouTube' });
        await expect(youTubeButton).toBeVisible();
        const href = await youTubeButton.getAttribute('href');
        expect(href).toBe('https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw')

    });
});