import { expect, test } from '@playwright/test';
import { WhyTeachPage } from '../../page/teach/why-page';
import { closeExternalBanners } from '../utils';
import { checkTeachCta, checkTeachNav } from './utils';
import { testSelector } from '../../utils';

const LIST_OF_SECTION = [
    ['Academically recognized', 2, 'Eugeniy Tyumentcev, Omsk State University'],
    ['Language of the industry', 2, 'Ryan Stansifer, Florida Institute of Technology'],
    ['Multiplatform', 1, 'Jakob Mass, University of Tartu'],
    ['Interoperable', 2, 'David Vaughn, University of Missouri–St. Louis'],
    ['Supports multiple paradigms', 3, 'Alexey Mitsyuk, HSE university'],
    ['Modern, concise, and safe', 4, 'Nick Efford, University of Leeds'],
    ['Tooling', 2, 'Mariusz Nowostawski, Norwegian University of Science and Technology']
] as const;

function toId(label: typeof LIST_OF_SECTION[number][0]) {
    return label.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^a-z-]/g, '');
}

test.describe('Why Teach Kotlin page appearance and functionality', async () => {
    test.beforeEach(async ({ page, context, baseURL }) => {
        const whyTeachPage = new WhyTeachPage(page);
        await whyTeachPage.init();
        await closeExternalBanners(context, page, baseURL);
    });

    test('Should load the Why Teach Kotlin page correctly', async ({ page }) => {
        // Check if the page title is correct
        expect(await page.title()).toBe('Why teach Kotlin');

        // Check if the main content is visible
        const mainContent = page.locator(testSelector('teach-why-teach-page'));
        await expect(mainContent).toBeVisible();

        // Check if the page heading is correct
        const heading = page.getByRole('heading', { name: 'Why Teach Kotlin', exact: true });
        await expect(heading).toBeVisible();
    });

    test('Should have working navigation buttons', async ({ page }) => {
        await checkTeachNav(page, 'Why Teach Kotlin');
    });

    test('Should display all sections with quotes correctly', async ({ page }) => {
        // Check if the navigation menu is visible
        const content = page.locator('.why-teach-grid__content');
        await expect(content).toBeVisible();

        // Check if all navigation items are present
        const sections = content.locator(':scope > section');
        expect(await sections.count()).toBe(7);

        // Check specific navigation items
        for (const [label, quotesSize, expectedAuthor] of LIST_OF_SECTION) {
            const section = sections.locator(`:scope#${toId(label)}`);
            await expect(section, `Section "${label}" should be visible`).toBeVisible();

            const title = section.locator(`:scope > h3`);
            await expect(title, `Title for section "${label}" should be visible`).toBeVisible();
            expect(await title.textContent(), `Title text for section "${label}" should match`).toBe(label);

            // Check if the quote slider exists
            const quotesSlider = section.locator('[class*=ktl-quotes-slider-module_quotes-slider_]');
            await expect(quotesSlider, `Quote slider for section "${label}" should be visible`).toBeVisible();

            // Check if the quote text is visible (using first() to handle multiple elements)
            const quoteText = quotesSlider.locator('[class*=ktl-quotes-slider-module_quote-text_]').first();
            await expect(quoteText, `Quote text for section "${label}" should be visible`).toBeVisible();
            expect(await quoteText.textContent(), `Quote text for section "${label}" should not be empty`).not.toBe('');

            // Check if the author is visible (using a more specific selector)
            const author = quotesSlider.locator('[class*=ktl-quotes-slider-module_nav_] > div:first-child');
            await expect(author, `Author for section "${label}" should be visible`).toBeVisible();
            expect(await author.textContent(), `Author for section "${label}" should match expected`).toBe(expectedAuthor);

            if (quotesSize < 2) {
                const controls = quotesSlider.locator('[class*=ktl-quotes-slider-module_control_]');
                expect(await controls.count(), `Controls for section "${label}" should not exist`).toBe(0);
                return;
            }

            // Check for navigation controls - but don't fail if they don't exist
            const controls = quotesSlider.locator('[class*=ktl-quotes-slider-module_control_]');
            expect(await controls.count(), `Navigation controls count for section "${label}" should be 2`).toBe(2);

            // Check if the slide count is visible
            const slidesCount = quotesSlider.locator('[class*=ktl-quotes-slider-module_slides-count_]');
            expect(await slidesCount.count(), `Slides count element for section "${label}" should exist`).toBe(1);
            await expect(slidesCount, `Slides count for section "${label}" should be visible`).toBeVisible();

            expect(await slidesCount.textContent(), `For section "${label}" slides should be ${quotesSize}`).toBe(`1/${quotesSize}`);
        }
    });

    test('Check the "Academically recognized" section', async ({ page }) => {
        await expect(page.locator('#academically-recognized .quote-section__content')).toContainText('We know of over 300 universities');

        const academicallyRecognizedInfo = page.locator('#academically-recognized .quote-section__info');

        const statNumber = academicallyRecognizedInfo.locator('.ktl-hero');
        await expect(statNumber).toBeVisible();
        expect(await statNumber.textContent()).toBe('32');

        const description = academicallyRecognizedInfo.locator('.ktl-dimmed-text');
        await expect(description).toBeVisible();
        expect(await description.textContent()).toContain('top 100 universities');

        const link = academicallyRecognizedInfo.locator('a[href="courses.html"]');
        await expect(link).toBeVisible();
        expect(await link.textContent()).toBe('List of universities ↗');
    });

    test('Check the "Language of the industry" section', async ({ page }) => {
        // Check list items in the "Language of the industry" section
        const industrySection = page.locator('#language-of-the-industry');
        const listItems = industrySection.locator('.quote-section__content ul.rs-ul > li');

        // Verify there are multiple list items
        expect(await listItems.count()).toBe(4);

        // Check the content of specific list items
        await expect(listItems.nth(0)).toContainText('Kotlin is used by top companies');
        await expect(listItems.nth(1)).toContainText('Teaching professional software engineering practices');
        await expect(listItems.nth(2)).toContainText('One out of every two developers');
        await expect(listItems.nth(3)).toContainText('In 2020, Kotlin became the 2nd most popular language');

        const industrySectionInfo = industrySection.locator('.quote-section__info');

        const description = industrySectionInfo.locator('.ktl-dimmed-text');
        await expect(description).toBeVisible();
        await expect(description).toContainText('Kotlin has consistently ranked');

        const link = industrySectionInfo.locator('a[href="https://hired.com/state-of-software-engineers/2023/" ]');
        await expect(link).toBeVisible();
        expect(await link.textContent()).toBe('Hired’s 2023 State of Software Engineers ↗');
    });

    test('Check the "Multiplatform" section', async ({ page }) => {
        const multiplatformSection = page.locator('#multiplatform');
        await expect(multiplatformSection.locator('.quote-section__content')).toContainText('Kotlin is a top choice for teaching Android development');

        const multiplatformSectionInfo = multiplatformSection.locator('.quote-section__info');

        const description = multiplatformSectionInfo.locator('.ktl-dimmed-text');
        await expect(description).toBeVisible();
        await expect(description).toContainText('Compose Multiplatform frameworks from JetBrains');

        const link = multiplatformSectionInfo.locator('a[href="https://developers.googleblog.com/2023/05/bringing-kotlin-to-web.html"]');
        await expect(link).toBeVisible();
        expect(await link.textContent()).toBe('Google for Developers blog, 2023 ↗');
    });

    test('Check the "Interoperable" section', async ({ page }) => {
        const interoperableSection = page.locator('#interoperable');
        await expect(interoperableSection.locator('.quote-section__content')).toContainText('Seamless interoperability with the JVM ecosystem');

        const interoperableSectionInfo = interoperableSection.locator('.quote-section__info');

        const description = interoperableSectionInfo.locator('.ktl-dimmed-text');
        await expect(description).toBeVisible();
        await expect(description).toContainText('Kotlin can also be compiled into');

        const link1 = interoperableSectionInfo.locator('a[href="https://kotlinlang.org/docs/mixing-java-kotlin-intellij.html#converting-an-existing-java-file-to-kotlin-with-j2k"]');
        await expect(link1).toBeVisible();
        expect(await link1.textContent()).toBe('Java-to-Kotlin converter ↗');

        const link2 = interoperableSectionInfo.locator('a[href="https://kotlinlang.org/docs/jvm-get-started.html"]');
        await expect(link2).toBeVisible();
        expect(await link2.textContent()).toBe('Kotlin/JVM ↗');

        const link3 = interoperableSectionInfo.locator('a[href="https://kotlinlang.org/docs/native-get-started.html"]');
        await expect(link3).toBeVisible();
        expect(await link3.textContent()).toBe('Kotlin/Native ↗');
    });

    test('Check the "Supports multiple paradigms" section', async ({ page }) => {
        const paradigmsSection = page.locator('#supports-multiple-paradigms');
        await expect(paradigmsSection.locator('.quote-section__content')).toContainText('Kotlin combines all the major programming paradigms');

        const paradigmsSectionInfo = paradigmsSection.locator('.quote-section__info');

        const description = paradigmsSectionInfo.locator('.ktl-dimmed-text');
        await expect(description).toBeVisible();
        await expect(description).toContainText('Kotlin supports functional, imperative');

        const link = paradigmsSectionInfo.locator('a[href]');
        await expect(link).not.toBeVisible();
    });

    test('Check the "Modern, concise, and safe" section', async ({ page }) => {
        const modernSection = page.locator('#modern-concise-and-safe');
        await expect(modernSection.locator('.quote-section__content')).toContainText('Kotlin allows students to focus on expressing their ideas');

        const modernSectionInfo = modernSection.locator('.quote-section__info');

        const description = modernSectionInfo.locator('.ktl-dimmed-text');
        expect(await description.count()).toBe(2);

        await expect(description.nth(0)).toBeVisible();
        await expect(description.nth(0)).toContainText('Type safety, null safety, and expressive');

        await expect(description.nth(1)).toBeVisible();
        await expect(description.nth(1)).toContainText('Source: an internal study on teaching Kotlin');

        const link = modernSectionInfo.locator('a[href]');
        await expect(link).not.toBeVisible();
    });

    test('Check the "Tooling" section', async ({ page }) => {
        // Check content in the "Tooling" section
        const toolingSection = page.locator('#tooling');
        await expect(toolingSection.locator('.quote-section__content')).toContainText('Many of the top professional tools are packaged with the language');

        const toolingSectionInfo = toolingSection.locator('.quote-section__info');

        const description = toolingSectionInfo.locator('.ktl-dimmed-text');
        await expect(description).not.toBeVisible();

        const link1 = toolingSectionInfo.locator('a[href="https://www.jetbrains.com/community/education/#students"]');
        await expect(link1).toBeVisible();
        expect(await link1.textContent()).toBe('Free IntelliJ IDEA Ultimate license ↗');

        const link2 = toolingSectionInfo.locator('a[href="https://play.kotlinlang.org/"]');
        await expect(link2).toBeVisible();
        expect(await link2.textContent()).toBe('Playground ↗');

        const link3 = toolingSectionInfo.locator('a[href="https://plugins.jetbrains.com/plugin/10081-jetbrains-academy"]');
        await expect(link3).toBeVisible();
        expect(await link3.textContent()).toBe('JetBrains Academy plugin ↗');

        const link4 = toolingSectionInfo.locator('a[href="https://www.jetbrains.com/code-with-me/"]');
        await expect(link4).toBeVisible();
        expect(await link4.textContent()).toBe('Code With Me ↗');

        const link5 = toolingSectionInfo.locator('a[href="https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-education&utm_content=button_1&utm_term=22.03.23&"]');
        await expect(link5).toBeVisible();
        expect(await link5.textContent()).toBe('Kotlin tracks by JetBrains Academy ↗');
    });

    test('Should have action buttons for educators', checkTeachCta);
});
