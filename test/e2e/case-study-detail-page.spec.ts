import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';
import { expect, test } from '@playwright/test';
import { CaseItem } from '@/blocks/case-studies/case-studies';


const CASE_TYPE_TEST_ID: Record<string, string> = {
    multiplatform: 'multiplatform-case-study',
    backend: 'server-side-case-study-page'
};

function getInternalCaseStudyLinks(): CaseItem[] {
    const yamlPath = path.join(process.cwd(), 'data/case-studies/case-studies.yml');
    const { items } = parse(fs.readFileSync(yamlPath, 'utf-8'));

    return (items as CaseItem[]).filter((item) => !item.isExternal && item.link?.startsWith('/case-studies/'));
}

// Regression test for KTL-4786: getStaticPaths silently skipped an entire
// case type when its content directory didn't match data/case-studies/<type>,
// so every case study of that type 404'd despite a successful build.
// This reads the same case-studies.yml that drives the hub page/cards, so any
// future rename that breaks the type -> content-directory mapping fails here
// for every affected case study, not just the ones spot-checked by hand.
test.describe('Case study detail pages', () => {
    for (const item of getInternalCaseStudyLinks()) {
        test(`"${item.id}" (${item.type}) case study page is available`, async ({ page }) => {
            await page.goto(item.link!);

            await expect(page.getByTestId(CASE_TYPE_TEST_ID[item.type])).toBeVisible();
            await expect(page.locator('h1').first()).not.toBeEmpty();
        });
    }
});
