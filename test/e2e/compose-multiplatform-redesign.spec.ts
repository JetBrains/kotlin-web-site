import { expect, test } from '@playwright/test';
import { ComposeMultiplatformRedesignPage, SECTION_SLUGS } from '../page/compose-multiplatform-redesign-page';

const PLATFORMS = [
    { id: 'android', name: 'Android' },
    { id: 'ios', name: 'iOS' },
    { id: 'desktop', name: 'Desktop' },
    { id: 'web', name: 'Web' },
];
const FAQ_ITEMS = 3;

test.describe('Compose Multiplatform redesign landing page', () => {
    let cmp: ComposeMultiplatformRedesignPage;

    test.beforeEach(async ({ page }) => {
        cmp = new ComposeMultiplatformRedesignPage(page);
        await cmp.init();
    });

    test('opens and renders every section in order', async ({ page }) => {
        const response = await page.goto('/compose-multiplatform-redesign/');
        expect(response?.status()).toBe(200);

        const sections = cmp.layout.locator('section[data-testid^="compose-multiplatform-redesign-"]');
        const rendered = await sections.evaluateAll((nodes: HTMLElement[]) => nodes.map((node) => node.dataset.testid));

        expect(rendered).toEqual(SECTION_SLUGS.map((slug) => `compose-multiplatform-redesign-${slug}`));
    });

    test('hero has a single h1 and the get started link', async () => {
        await expect(cmp.layout.locator('h1')).toHaveCount(1);
        await expect(cmp.heroTitle).toHaveText(/^Compose\s*Multiplatform$/);

        const cta = cmp.hero.getByRole('link', { name: 'Get started' });
        await expect(cta).toBeVisible();
        await expect(cta).toHaveAttribute('href', '/docs/multiplatform/compose-multiplatform-create-first-app.html');
    });

    test('platforms section lists four platform cards', async () => {
        await expect(cmp.platformsBlock).toBeVisible();
        await expect(cmp.platformCards).toHaveCount(PLATFORMS.length);

        for (const { id, name } of PLATFORMS) {
            await expect(cmp.platformCard(id).getByRole('heading', { name, exact: true })).toBeVisible();
        }
    });

    test('FAQ has three items and toggles an answer', async () => {
        await expect(cmp.faqItems).toHaveCount(FAQ_ITEMS);
        await expect(cmp.faqAnswers.first()).toBeHidden();

        await cmp.faqButtons.first().evaluate((element) => element.scrollIntoView({ block: 'center' }));
        await cmp.faqButtons.first().click();
        await expect(cmp.faqAnswers.first()).toBeVisible();

        await cmp.faqButtons.first().click();
        await expect(cmp.faqAnswers.first()).toBeHidden();
    });

    test('testimonial carousel starts at 1/4 and next advances the counter', async () => {
        await expect(cmp.testimonials.getByText('1/4', { exact: true })).toBeVisible();

        await cmp.testimonialsNext.evaluate((element) => element.scrollIntoView({ block: 'center' }));
        await cmp.testimonialsNext.click();

        await expect(cmp.testimonials.getByText('2/4', { exact: true })).toBeVisible();
    });

    test('footer call to action links to get started', async () => {
        const cta = cmp.section('build-your-first').getByRole('link', { name: 'Get started' });

        await expect(cta).toBeVisible();
        await expect(cta).toHaveAttribute('href', /\S/);
    });
});
