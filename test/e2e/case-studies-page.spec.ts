import { expect, test } from '@playwright/test';

// Verifies that the Case Studies page renders correctly
// Prerequisite to run locally: yarn start (serves at http://localhost:9000)

test.describe('Case Studies page', () => {
  test('should load and display hero, filter, and grid', async ({ page }) => {
    await page.goto('/case-studies/');

    // H1 title
    const h1 = page.getByRole('heading', { level: 1, name: 'Case studies' });
    await expect(h1).toBeVisible();

    // Filter section
    const filter = page.getByRole('region', { name: 'Case Studies Filter' });
    await expect(filter).toBeVisible();

    // Grid section
    const grid = page.getByRole('region', { name: 'Case Studies Grid' });
    await expect(grid).toBeVisible();
  });
});
