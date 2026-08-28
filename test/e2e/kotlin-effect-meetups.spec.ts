import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';
import { expect, test } from '@playwright/test';
import { testSelector } from '../utils';

function getMeetups(): AnniversaryMeetup[] {
    const yamlPath = path.join(process.cwd(), 'data/kotlin-effect/anniversary-meetups.yml');

    return parse(fs.readFileSync(yamlPath, 'utf-8')) as AnniversaryMeetup[];
}

// The map is client-only (google-map-react injects a script), so the list is what
// carries the meetup names and links. Asserting it from the same YAML that drives the
// block means every future edit to the data file is covered, not just today's 23 rows.
// Deliberately no assertions on map internals: Google Maps needs a live API key and a
// network round trip, which is flaky in CI.
test.describe('Kotlin Effect anniversary meetups block', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/kotlin-effect/');
    });

    test('Should render every meetup from the data file', async ({ page }) => {
        const block = page.locator(testSelector('meetups-block'));
        await expect(block).toBeVisible();

        for (const meetup of getMeetups()) {
            await expect(block.getByText(meetup.name, { exact: true }).first()).toBeVisible();
        }
    });

    test('Should not render meetups without a URL as links', async ({ page }) => {
        // an empty url in anniversary-meetups.yml must not produce <a href=""
        // target="_blank">, which reopens the landing page in a new tab
        const emptyLinks = await page
            .locator(testSelector('meetups-block'))
            .locator('a[target="_blank"]')
            .evaluateAll((anchors) => anchors.filter((anchor) => !anchor.getAttribute('href')).length);
        expect(emptyLinks).toBe(0);
    });

    test('Should link the organizer CTA to the KUG mailbox', async ({ page }) => {
        const cta = page.locator(testSelector('meetups-block')).getByRole('link', { name: 'Get in touch' });

        await expect(cta).toHaveAttribute('href', 'mailto:kug@jetbrains.com');
    });
});
