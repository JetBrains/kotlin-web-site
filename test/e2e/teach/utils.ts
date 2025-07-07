import { expect, Locator, Page } from '@playwright/test';

export const MAILTO_LINK = 'mailto:education@kotlinlang.org' as const;
export const SIGNUP_LINK = 'https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators' as const;
export const MATERIALS_LINK = 'https://drive.google.com/drive/folders/1nN3LuyEfmBaSDZpnb4VA9kDuLakmVXH1?usp=drive_link' as const;

const NAV_LINKS = [
    ['Overview', '/education/'],
    ['Why Teach Kotlin', '/education/why-teach-kotlin.html'],
    ['List of Courses', '/education/courses.html']
] as const;

export async function checkTeachNav(page: Page, selected: typeof NAV_LINKS[number][0]) {
    const navBar = page.locator('.teach-sticky-menu');

    // Check section title to root of nav
    const sectionLink = navBar.getByRole('link', { name: 'Teach', exact: true });
    await expect(sectionLink).toBeVisible();
    await expect(sectionLink).toHaveAttribute('href', '/education/');

    // Check the Join button
    const joinLink = navBar.getByRole('link', { name: 'Join Educators', exact: true });
    await expect(joinLink).toBeVisible();
    await expect(joinLink).toHaveAttribute('href', SIGNUP_LINK);

    const subNav = navBar.getByRole('navigation');

    // Check sub-nav link
    for (let [title, link] of NAV_LINKS) {
        if (title == selected) {
            await expect(subNav.getByRole('link', { name: title })).toHaveCount(0);
            await expect(subNav.getByText(title)).toBeVisible();
            continue;
        }

        const subLink = subNav.getByRole('link', { name: title }).filter({ visible: true });
        await expect(subLink).toHaveAttribute('href', link);
    }

    expect(await navBar.screenshot()).toMatchSnapshot('sticky-menu.png');
}

export async function checkTeachMap(page: Page, map: Locator) {
    await expect(map).toBeVisible();
    await expect(map.locator('.gm-style')).toBeVisible();

    // Wait for the Google Maps API to attach itself
    await page.waitForFunction(() => window['google'] && window['google']['maps']);

    // The map should have markers
    const markers = page.locator('.teach-map-marker');
    expect(await markers.count()).toBeGreaterThan(100);

    // Wait for the Google Maps Markers to attach
    await page.waitForFunction(() => {
        const markers = document.querySelectorAll('.teach-map-marker');
        return markers.length > 100 &&
            Array.from(markers).every(marker =>
                marker['offsetHeight'] > 0 && marker['offsetWidth'] > 0
            );
    });

    // Check if at least one marker is visible
    let marker = markers.last();
    await expect(marker).toBeVisible();
    await expect(marker).not.toHaveClass('teach-map-marker teach-map-marker_active');

    await marker.scrollIntoViewIfNeeded();

    // !!!ATTENTION!!!: marker.click and marker.hover don't work for Google Maps.
    const box = await marker.boundingBox();
    await page.mouse.move(box.x, box.y);
    await page.mouse.down();
    await page.waitForTimeout(100);
    await page.mouse.up();

    await expect(marker).toHaveClass('teach-map-marker teach-map-marker_active');

    const tooltip = marker.locator('.teach-map-tooltip');
    await expect(tooltip).toBeVisible();
}

export async function checkTeachCta({ page }) {
    // Get the CTA wrapper element from the page
    const connectUs = page.locator('section [class*=ktl-cta-block-module_wrapper_]');

    // Check if the "Connect with us" heading is visible
    const title = connectUs.getByRole('heading', { name: 'Connect with us', exact: true });
    await expect(title).toBeVisible();

    // Check if the Slack link is visible and has the correct href
    const slackLink = connectUs.getByRole('link', { name: 'Slack-channel →', exact: true });
    await expect(slackLink).toBeVisible();
    await expect(slackLink).toHaveAttribute('href', SIGNUP_LINK);

    // Check if the email link is visible and has the correct mailto href 
    const eduLink = connectUs.getByRole('link', { name: 'education@kotlinlang.org', exact: true });
    await expect(eduLink).toBeVisible();
    await expect(eduLink).toHaveAttribute('href', MAILTO_LINK);

    expect(await connectUs.screenshot()).toMatchSnapshot('connect-us.png');
}
