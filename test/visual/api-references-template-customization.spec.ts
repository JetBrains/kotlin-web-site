import { expect, test } from '@playwright/test';
import { ApiReferencePage } from '../page/api-reference-page';
import { testSelector } from '../utils';

const pagesWithCustomizedTemplates = [
    {
        name: 'kotlinx.coroutines index',
        getInstance: (page) => new ApiReferencePage(page, '/api/kotlinx.coroutines/'),
    },
    {
        name: 'kotlinx-coroutines-core module',
        getInstance: (page) => new ApiReferencePage(page, '/api/kotlinx.coroutines/kotlinx-coroutines-core/'),
    },
    {
        name: 'kotlinx-serialization index',
        getInstance: (page) => new ApiReferencePage(page,  '/api/kotlinx.serialization/'),
    },
    {
        name: 'kotlinx-serialization-core module',
        getInstance: (page) => new ApiReferencePage(page,  '/api/kotlinx.serialization/kotlinx-serialization-core/'),
    },
];

test.describe('Check api references template customization', async () => {
    for (const pageWithCustomizedTemplate of pagesWithCustomizedTemplates) {
        test(`Check footer on the ${pageWithCustomizedTemplate.name} page`, async ({ page }) => {
            const currentPage = pageWithCustomizedTemplate.getInstance(page);
            await currentPage.init();

            expect(await page.locator(testSelector('footer')).screenshot()).toMatchSnapshot(
                `${pageWithCustomizedTemplate.name}.footer.png`
            );
        });
    }
});
