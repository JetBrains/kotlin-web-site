import { expect, Locator, test } from '@playwright/test';
import { ComposeMultiplatformPage } from '../page/compose-multiplatform-page';
import { checkScreenshot } from '../utils';
import { FAQ_ITEMS } from '../../blocks/compose-multiplatform/faq/faq-data';
import { platformsData } from '../../blocks/compose-multiplatform/platforms-block/platforms-data';

// A slide is shown when it is aligned with the visible area of its scroll container
const isShownInCarousel = (slide: Locator) =>
    slide.evaluate(el => {
        const slideRect = el.getBoundingClientRect();
        const containerRect = el.parentElement.getBoundingClientRect();
        return Math.abs(slideRect.left - containerRect.left) < 2;
    });

test.describe('Compose Multiplatform landing page', async () => {
    let composePage: ComposeMultiplatformPage;

    test.beforeEach(async ({ page }) => {
        composePage = new ComposeMultiplatformPage(page);
        await composePage.init();
    });

    test('check hero block content', async () => {
        await expect(composePage.heroTitle).toBeVisible();
        await expect(composePage.heroTitle).not.toBeEmpty();

        await expect(composePage.heroSubTitle).toBeVisible();
        await expect(composePage.heroSubTitle).not.toBeEmpty();

        await expect(composePage.heroActionButton).toBeVisible();
        const href = await composePage.heroActionButton.getAttribute('href');

        await checkScreenshot(composePage.hero, {
            mask: [composePage.heroCarousel]
        });

        await composePage.heroActionButton.click();
        await expect(composePage.page).toHaveURL(new RegExp(`.*${href}$`));
    });

    test('check hero platforms chips', async () => {
        const platforms = [
            { name: 'Android', href: '/docs/multiplatform/compose-multiplatform-create-first-app.html' },
            { name: 'iOS', href: '/docs/multiplatform/compose-multiplatform-create-first-app.html' },
            { name: 'Web', href: 'https://kotl.in/wasm-compose-example' },
            { name: 'Desktop', href: '/docs/multiplatform/compose-multiplatform-create-first-app.html' }
        ];

        for (const { name, href } of platforms) {
            const chip = composePage.hero.getByRole('tab', { name, exact: true });
            await expect(chip).toBeVisible();
            await expect(chip).toHaveAttribute('href', href);
        }
    });

    test('check platforms block', async () => {
        await expect(composePage.platformsBlock).toBeVisible();
        await expect(composePage.platformsTitle).toHaveText('Supported platforms');

        await expect(composePage.platformsItems).toHaveCount(platformsData.length);

        await checkScreenshot(composePage.platformsBlock);
    });

    test('check features block', async () => {
        await expect(composePage.featuresBlock).toBeVisible();

        await expect(composePage.featureItems).not.toHaveCount(0);

        for (const title of await composePage.featureTitles.all()) {
            await expect(title).toBeVisible();
            await expect(title).not.toBeEmpty();
        }

        await checkScreenshot(composePage.featuresBlock);
    });

    test('check quote section', async () => {
        await expect(composePage.quoteSection).toBeVisible();
        await expect(composePage.quoteCards).not.toHaveCount(0);

        await checkScreenshot(composePage.quoteSection);
    });

    test('check quote gallery navigation', async () => {
        const total = await composePage.quoteCards.count();
        const { quoteCards, quoteCounter, quotePrevButton, quoteNextButton } = composePage;

        await expect(quoteCounter).toHaveText(`1/${total}`);
        await expect.poll(() => isShownInCarousel(quoteCards.nth(0))).toBe(true);
        await expect.poll(() => isShownInCarousel(quoteCards.nth(1))).toBe(false);
        await expect(quotePrevButton).toBeDisabled();

        await quoteNextButton.click();
        await expect(quoteCounter).toHaveText(`2/${total}`);
        await expect.poll(() => isShownInCarousel(quoteCards.nth(1))).toBe(true);
        await expect.poll(() => isShownInCarousel(quoteCards.nth(0))).toBe(false);

        await quotePrevButton.click();
        await expect(quoteCounter).toHaveText(`1/${total}`);
        await expect.poll(() => isShownInCarousel(quoteCards.nth(0))).toBe(true);

        for (let i = 2; i <= total; i++) {
            await quoteNextButton.click();
            await expect(quoteCounter).toHaveText(`${i}/${total}`);
        }
        await expect.poll(() => isShownInCarousel(quoteCards.nth(total - 1))).toBe(true);
        await expect(quoteNextButton).toBeDisabled();
    });

    test('check FAQ block', async () => {
        await expect(composePage.faqBlock).toBeVisible();
        await expect(composePage.faqTitle).toBeVisible();
        await expect(composePage.faqButtons).toHaveCount(FAQ_ITEMS.length);

        await checkScreenshot(composePage.faqBlock);

        await expect(composePage.faqAnswers.first()).toBeHidden();

        await composePage.faqButtons.first().click();
        await expect(composePage.faqAnswers.first()).toBeVisible();

        await composePage.faqButtons.nth(1).click();
        await expect(composePage.faqAnswers.nth(1)).toBeVisible();
        await expect(composePage.faqAnswers.first()).toBeHidden();
    });

    test('check CTA block', async () => {
        await expect(composePage.ctaBlockTitle).toBeVisible();
        await expect(composePage.ctaBlockTitle).not.toBeEmpty();

        await expect(composePage.ctaBlockButton).toBeVisible();
        const href = await composePage.ctaBlockButton.getAttribute('href');

        await checkScreenshot(composePage.ctaBlock);

        await composePage.ctaBlockButton.click();
        await expect(composePage.page).toHaveURL(new RegExp(`.*${href}$`));
    });
});
