import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { chromium, FullConfig } from '@playwright/test';
import { isProduction } from './utils';

export default async function globalSetup(config: FullConfig) {
    const storageStatePath = join(__dirname, 'storage-state.json');
    await writeFile(storageStatePath, '{}', 'utf-8');

    const project = config.projects[0];
    console.log(`[Global Setup] Processing project ${project.name}`);
    const baseURL = project.use?.baseURL;

    if (isProduction(baseURL)) {
        await closeProductionElements(baseURL, storageStatePath);
    }
}

async function closeProductionElements(baseURL: string, storageStatePath: string) {
    console.log(`[Global Setup] Starting cookie banner setup for ${baseURL}`);

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

        try {
            const acceptButton = page.getByRole('button', { name: 'Accept All' });
            await acceptButton.waitFor({ state: 'visible', timeout: 5000 });
            await acceptButton.click();

            await page.waitForTimeout(1000);
        } catch (error) {
            console.log('[Global Setup] Cookie banner not found - continuing');
        }

        const closeBanner = page.locator('#optly-banner_close');

        if (await closeBanner.count() > 0) {
            console.log('[Global Setup] Closing "purple" banner');
            await closeBanner.click();
            await page.waitForSelector('#optly-banner_close', { state: 'hidden' });
        }

        await context.storageState({ path: storageStatePath });
        console.log(`[Global Setup] Storage state saved to ${storageStatePath}`);
    } catch (error) {
        console.error('[Global Setup] Error during setup:', error);
        throw error;
    } finally {
        await context.close();
        await browser.close();
    }
}