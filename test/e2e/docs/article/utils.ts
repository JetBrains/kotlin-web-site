import { expect, Locator, Page } from '@playwright/test';
import { testSelector } from '@/test/utils';

export const TEST_PAGE_URL = '/docs/test-page.html';

// the page holds several definition lists, so every one of them is scoped by the chapter it belongs to.
// `last()` picks the innermost chapter, since the parent chapters contain the heading as well
export const chapterOf = (page: Page, headingId: string) =>
    page
        .locator('section.chapter')
        .filter({ has: page.locator(`#${headingId}`) })
        .last();

export const deflistIn = (page: Page, headingId: string) =>
    chapterOf(page, headingId).locator(testSelector('definition-list')).first();

// only direct children, otherwise a nested definition list would be counted as an item of the outer one
export const itemsOf = (deflist: Locator) => deflist.locator(`> ${testSelector('collapse-element')}`);

// direct children only, so that a nested definition list inside an exercise isn't picked up
export const titleOf = (item: Locator) => item.locator(`> ${testSelector('definition-list-title')}`);
export const bodyOf = (item: Locator) => item.locator(`> ${testSelector('collapse-content')}`);
export const buttonOf = (item: Locator) => titleOf(item).locator(testSelector('collapse-button'));

export const pixelValue = async (element: Locator, property: string) =>
    parseFloat(await element.evaluate((node, prop) => getComputedStyle(node).getPropertyValue(prop), property));

export const expandItem = async (item: Locator) => {
    await titleOf(item).click();
    await expect(item).toContainClass('collapse--expanded');
    await item.locator(':scope[data-is-animating="false"][data-test-is-animating="false"]').waitFor({
        state: 'visible',
    });
};
