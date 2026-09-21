import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { chromium, FullConfig, FullProject } from '@playwright/test';
import { getUserAgent, isProduction, removeHeadlessUserAgent } from './utils';

export default async function globalSetup(config: FullConfig) {
    const storageStatePath = join(__dirname, 'storage-state.json');
    await writeFile(storageStatePath, '{}', 'utf-8');

    const project = config.projects[0];
    console.log(`[Global Setup] Processing project ${project.name}`);
    const baseURL = project.use?.baseURL;

    if (isProduction(baseURL)) {
        await closeProductionElements(project, baseURL, storageStatePath);
    }
}

async function closeProductionElements(project: FullProject, baseURL: string, storageStatePath: string) {
    console.log(`[Global Setup] Starting setup for ${baseURL}`);

    const { headless, launchOptions } = project.use ?? {};
    const browser = await chromium.launch({ headless, ...launchOptions });

    const originUserAgent = await getUserAgent(browser);
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

        // if the user agent has headless, cookiebanners are not shown
        // isBot() {
        //   const e = new RegExp("(cookiehubscan|adsbot|ahrefsbot|amazonbot|applebot|baiduspider|baidu|bingbot|bingpreview|crawler|spider|headless|curl|wget|googlebot|googleother|mediapartners|mediapartners-google|feedfetcher-google|facebookbot|facebot|twitterbot|linkedinbot|uptimerobot|yandex|duckduckbot|petalbot|semrush|semrushbot|mj12bot|ccbot|dotbot|slurp|meta-externalads|ai2bot|amazonproductbot|site24x7|facebookexternalhit|sogou|proximic|teoma|lighthouse|gtmetrix|pingdom)","i"),
        //   t = navigator.userAgent;
        //   return e.test(t)
        // }
        if (originUserAgent === removeHeadlessUserAgent(originUserAgent)) {
            console.log(`[Global Setup] Closing cookie banner ${baseURL}`);
            try {
                const dialog = page.getByRole('dialog');
                await dialog.waitFor({ state: 'visible' });

                const acceptButton = dialog.getByRole('button', { name: 'Accept All' });
                await acceptButton.waitFor({ state: 'visible', timeout: 5000 });
                await acceptButton.click();

                await dialog.waitFor({ state: 'hidden' });
            } catch (error) {
                const acceptButton = page.getByRole('button', { name: 'Accept All' });
                await acceptButton.waitFor({ state: 'visible', timeout: 5000 });

                console.log('[Global Setup] Cookie banner not found - continuing');
            }
        }

        const urls = [baseURL, `${baseURL}/docs/`, `${baseURL}/docs/multiplatform/`, `${baseURL}/api/core/`];

        for (const url of urls) {
            await page.goto(url, { waitUntil: 'domcontentloaded' });

            try {
                const closeBanner = page.locator('#optly-banner_close');
                await closeBanner.click({ timeout: 3000 });
                console.log(`[Global Setup] Closing "purple" banner - ${url}`);
                await page.waitForSelector('#optly-banner_close', { state: 'hidden' });
            } catch (error) {
                console.log(`[Global Setup] No "purple" banner - ${url}`);
            }
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