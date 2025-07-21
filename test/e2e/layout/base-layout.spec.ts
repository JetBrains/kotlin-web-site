import { test, expect } from '@playwright/test';
import { testSelector } from '../../utils';

/**
 * Tests for the PageMetadata component
 * 
 * These tests verify that the PageMetadata component renders correctly
 * and includes all the expected metadata and content.
 */
test.describe('PageMetadata', () => {
  // Create a test page that uses the PageMetadata component
  test.beforeAll(async ({ request }) => {
    // This is a placeholder for any setup needed before tests
    // In a real implementation, we might need to create a test page
    // or ensure the test environment is properly configured
  });

  test('should render the page title correctly', async ({ page }) => {
    // Navigate to the homepage which uses the new layout system
    await page.goto('/');
    
    // Check if the page title is correct
    const title = await page.title();
    expect(title).toContain('Kotlin Programming Language');
  });

  test('should include proper meta tags', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Check Open Graph meta tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toContain('Kotlin Programming Language');
    
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    expect(ogType).toBe('website');
    
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toContain('/assets/images/open-graph/');
    
    // Check Twitter card meta tags
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBe('summary_large_image');
    
    const twitterSite = await page.locator('meta[name="twitter:site"]').getAttribute('content');
    expect(twitterSite).toBe('@kotlin');
  });

  test('should render the content correctly', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Check if the main content is visible
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
    
    // Check if the hero section is visible
    const heroSection = page.getByRole('heading', { name: 'Kotlin' });
    await expect(heroSection).toBeVisible();
  });

  test('should apply the correct theme', async ({ page }) => {
    // Navigate to the homepage which uses the dark theme
    await page.goto('/');
    
    // Check if the dark theme class is applied to the document
    const hasThemeClass = await page.evaluate(() => {
      return document.documentElement.classList.contains('theme-dark');
    });
    
    expect(hasThemeClass).toBeTruthy();
  });
});

/**
 * Tests for the PageLayout component
 * 
 * These tests verify that the PageLayout component renders correctly
 * and includes the header and footer.
 */
test.describe('PageLayout', () => {
  test('should include the global header', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Check if the global header is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check if the header contains the Kotlin logo
    const logo = page.getByAltText('Kotlin');
    await expect(logo).toBeVisible();
  });

  test('should include the global footer', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Check if the global footer is visible
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check if the footer contains the copyright text
    const copyright = page.getByText(/© 2010-\d{4} JetBrains/);
    await expect(copyright).toBeVisible();
  });
});

/**
 * Tests for the SectionLayout component
 * 
 * These tests verify that the SectionLayout component renders correctly
 * and includes section-specific navigation and CTA blocks.
 */
test.describe('SectionLayout', () => {
  test('should include section-specific navigation', async ({ page }) => {
    // Navigate to the education page which uses the education section layout
    await page.goto('/education/');
    
    // Check if the section navigation is visible
    const navigation = page.locator('nav');
    await expect(navigation).toBeVisible();
    
    // Check if the navigation contains the expected items
    const overviewLink = page.getByRole('link', { name: 'Overview' });
    await expect(overviewLink).toBeVisible();
    
    const whyTeachLink = page.getByRole('link', { name: 'Why Teach Kotlin' });
    await expect(whyTeachLink).toBeVisible();
  });

  test('should include section-specific CTA block', async ({ page }) => {
    // Navigate to the education page
    await page.goto('/education/');
    
    // Check if the CTA block is visible
    const ctaBlock = page.getByText('Help us improve');
    await expect(ctaBlock).toBeVisible();
    
    // Check if the CTA block contains the expected button
    const ctaButton = page.getByRole('link', { name: 'Write to us' });
    await expect(ctaButton).toBeVisible();
    expect(await ctaButton.getAttribute('href')).toContain('mailto:education@kotlinlang.org');
  });
});