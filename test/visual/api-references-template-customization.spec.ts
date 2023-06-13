import { expect, test } from '@playwright/test';
import { ApiReferencePage } from '../page/api-reference-page';
import { testSelector } from '../utils';

const pagesWithCustomizedTemplates = [
    [ '/api/kotlinx.coroutines/', 'kotlinx-coroutines-core/' ],
    [ '/api/kotlinx.serialization/', 'kotlinx-serialization-core/' ],
    [ '/api/kotlinx-datetime/kotlinx-datetime/', 'kotlinx.datetime/' ],
]
  .map(item => {
      const [ url, section ] = item;
      return [
        { name: `${section} index`, getInstance: (page) => new ApiReferencePage(page, url) },
        { name: `${section} module`, getInstance: (page) => new ApiReferencePage(page, `${url}/${section}/`) },
      ];
  })
  .flat();

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
