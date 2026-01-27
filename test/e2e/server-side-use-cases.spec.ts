import { expect, test } from '@playwright/test';
import { ServerSidePage } from '../page/server-side-page';
import { checkAnchor } from '../utils';

test.describe('Server-Side landing page', async () => {
    test('Server-side: check hero block content', async ({ page }) => {
        const serverSidePage = new ServerSidePage(page);
        await serverSidePage.init();

        await expect(serverSidePage.heroTitle.first()).toBeVisible();
        await expect(serverSidePage.heroTitle.first()).not.toBeEmpty();

        await expect(serverSidePage.heroSubTitle.first()).toBeVisible();
        await expect(serverSidePage.heroSubTitle.first()).not.toBeEmpty();

        const anchors = serverSidePage.heroAnchors;
        await expect(anchors).toHaveCount(4);
        const anchorCount = await anchors.count();

        for (let i = 0; i < anchorCount; i++) {
            const anchor = anchors.nth(i);
            await expect(anchor).not.toBeEmpty();
        }
    });

    test('Server-side: check hero block anchors', async ({ page }) => {
        const serverSidePage = new ServerSidePage(page);
        await serverSidePage.init();

        const anchors = serverSidePage.heroAnchors;
        const anchorCount = await anchors.count();

        for (let i = 0; i < anchorCount; i++) {
            const anchor = anchors.nth(i);
            await anchor.scrollIntoViewIfNeeded();
            await checkAnchor(page, anchor);
        }
    });

    test('Server-side: check hero block get started link', async ({ page }) => {
        const serverSidePage = new ServerSidePage(page);
        await serverSidePage.init();

        await serverSidePage.heroGetStartedLink.scrollIntoViewIfNeeded();
        await expect(serverSidePage.heroGetStartedLink).toBeVisible();

        await checkAnchor(page, serverSidePage.heroGetStartedLink);
    });

    test('Server-side: check hero block case-studies link', async ({ page }) => {
        const serverSidePage = new ServerSidePage(page);
        await serverSidePage.init();

        await serverSidePage.heroCaseStudiesLink.scrollIntoViewIfNeeded();
        await expect(serverSidePage.heroCaseStudiesLink).toBeVisible();
        await serverSidePage.heroCaseStudiesLink.click();

        expect(page.url()).toContain('/case-studies/');
    });

    test('Server-side: check Ktor get started link', async ({ page }) => {
        const serverSidePage = new ServerSidePage(page);
        await serverSidePage.init();

        await serverSidePage.ktorGetStartedLink.scrollIntoViewIfNeeded();
        await expect(serverSidePage.ktorGetStartedLink).toBeVisible();
        await serverSidePage.ktorGetStartedLink.click();

        // the url is hardcoded due to reditect
        const ktorGetStartedLinkURL = 'https://ktor.io/docs/welcome.html';

        await page.waitForURL(url => url.toString().includes(ktorGetStartedLinkURL));
        expect(page.url()).toContain(ktorGetStartedLinkURL);
    });

    test('Server-side: check Spring get started link', async ({ page }) => {
        const serverSidePage = new ServerSidePage(page);
        await serverSidePage.init();

        await serverSidePage.springGetStartedLink.scrollIntoViewIfNeeded();
        await expect(serverSidePage.springGetStartedLink).toBeVisible();
        const springGetStartedLinkURL = await serverSidePage.springGetStartedLink.getAttribute('href');
        await serverSidePage.springGetStartedLink.click();
        await page.waitForURL(springGetStartedLinkURL);

        expect(page.url()).toContain(springGetStartedLinkURL);
    });

    test('Server-side: check customer logos block', async ({ page }) => {
        const serverSidePage = new ServerSidePage(page);
        await serverSidePage.init();

        await serverSidePage.customersBlock.scrollIntoViewIfNeeded();
        await expect(serverSidePage.customersBlock).toBeVisible();

        await serverSidePage.customersBlock.hover();
        // Playwright can't handle animated elements, so a pause required.
        const customerLinks = await serverSidePage.customersLink.all();

        for (const customerLink of customerLinks) {
            await customerLink.scrollIntoViewIfNeeded();
            await serverSidePage.customersBlock.hover();
            const customerLinkURL = await customerLink.getAttribute('href');

            if (await customerLink.isVisible()) {
                const [newPage] = await Promise.all([
                    page.context().waitForEvent('page'),
                    customerLink.click()
                ]);

                try {
                    await newPage.waitForLoadState();
                } catch (error) {
                    throw new Error(`Failed to load customer link: ${customerLinkURL}\n${error.message}`);
                }

                const originalDomain = new URL(customerLinkURL).hostname;
                const finalDomain = new URL(newPage.url()).hostname;

                if (originalDomain === finalDomain) {
                    expect(newPage.url()).toContain(customerLinkURL);
                }

                await newPage.close();
            }
        }
    });

    test('Server-side: check download button', async ({ page }) => {
        const serverSidePage = new ServerSidePage(page);
        await serverSidePage.init();

        await serverSidePage.downloadIdeaButton.scrollIntoViewIfNeeded();
        await expect(serverSidePage.downloadIdeaButton).toBeVisible();

        const downloadIdeaButtonURL = await serverSidePage.downloadIdeaButton.getAttribute('href');
        await serverSidePage.downloadIdeaButton.click();

        expect(page.url()).toContain(downloadIdeaButtonURL);
    });
});