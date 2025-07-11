import { test, expect } from '@playwright/test';

test.describe('Teach page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/education/');
        await page.waitForSelector('button.ch2-btn.ch2-btn-primary');
        await page.click('button.ch2-btn.ch2-btn-primary');
    });

    test('Why teach Kotlin button in navbar opens the related page', async ({ page }) => {
        const whyTeachKotlinButton = page.getByRole('link', { name: 'Why Teach Kotlin' }).first();
        await expect(whyTeachKotlinButton).toBeVisible();
        await whyTeachKotlinButton.click();
        await expect(page.url()).toContain('/education/why-teach-kotlin.html');
    });

    test('List of courses button in navbar opens the related page', async ({ page }) => {
        const listOfCoursesButton = page.getByRole('link', { name: 'List of Courses' });
        await expect(listOfCoursesButton).toBeVisible();
        await listOfCoursesButton.click();
        await expect(page.url()).toContain('/education/courses.html');
    });

    test('Join Educators button in navbar opens the related page', async ({ page, context }) => {
        const joinEducatorsButton = page.getByRole('link', { name: 'Join Educators' }).first();
        await expect(joinEducatorsButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await joinEducatorsButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators');
    });

    test('Download all materials button opens the related page', async ({ page, context }) => {
        const downloadMaterialsButton = page.getByRole('link', { name: 'Download all materials' });
        await expect(downloadMaterialsButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await downloadMaterialsButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://drive.google.com/drive/folders/1nN3LuyEfmBaSDZpnb4VA9kDuLakmVXH1');
    });

    test('Join Educators button in context opens the related page', async ({ page, context }) => {
        const joinEducatorsButton = page.getByRole('link', { name: 'Join Educators' }).nth(1);
        await expect(joinEducatorsButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await joinEducatorsButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators');
    });

    test('Why teach Kotlin button in context opens the related page', async ({ page }) => {
        const whyTeachKotlinButton = page.getByRole('link', { name: 'Why Teach Kotlin' }).nth(1);
        await expect(whyTeachKotlinButton).toBeVisible();
        await whyTeachKotlinButton.click();
        // await page.waitForTimeout(3000);
        await expect(page.url()).toContain('/education/why-teach-kotlin.html');
    });

    test('All universities button opens the related page', async ({ page }) => {
        const allUniversitiesButton = page.getByRole('link', { name: 'All universities' });
        await expect(allUniversitiesButton).toBeVisible();
        await allUniversitiesButton.click();
        await expect(page.url()).toContain('/education/courses.html');
    });

    test('Slack-channel button in context opens the related page', async ({ page, context }) => {
        const joinEducatorsButton = page.getByRole('link', { name: 'Slack-channel' });
        await expect(joinEducatorsButton).toBeVisible();
        const newPagePromise = context.waitForEvent('page');
        await joinEducatorsButton.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage.url()).toContain('https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators');
    });
});