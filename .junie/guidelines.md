# Kotlin Website Development Guidelines

This document provides guidelines and instructions for developing and maintaining the Kotlin Website project. It is intended for advanced developers who are already familiar with the technologies used in the project.

## Project Overview

The Kotlin Website project (kotlinlang.org) is the official website for the Kotlin programming language. It serves as the primary resource for developers to learn about Kotlin, access documentation, tutorials, and community resources. The website provides comprehensive information about the language, its features, and its ecosystem.

### Project Goals

- Provide comprehensive documentation for the Kotlin programming language
- Showcase Kotlin features and capabilities
- Support the Kotlin community with resources and information
- Offer interactive code examples through Kotlin Playground
- Provide API reference documentation
- Facilitate learning through tutorials and educational resources

## Technology Stack

The Kotlin Website is built using a hybrid architecture combining two different approaches for page generation:

1. **Next.js-based Pages**:
   - Next.js (React framework) for modern, interactive pages
   - React for UI components
   - TypeScript for type checking
   - CSS Modules for component-specific styling
   - Static site generation for performance

2. **Flask-based Pages**:
   - Python with Flask web framework
   - Jinja2 templating engine
   - Flask-Frozen for generating static pages
   - Traditional webpack-bundled assets

3. **Shared Frontend Technologies**:
   - Webpack for bundling traditional assets
   - SCSS/Sass and PostCSS for styling
   - Kotlin Playground for interactive code examples

4. **Build and Testing**:
   - Yarn/NPM for package management
   - Playwright for end-to-end testing
   - Docker for containerization

5. **Documentation Tools**:
   - Markdown for content
   - JetBrains Writerside for documentation
   - Dokka for API documentation generation

## Build/Configuration Instructions

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- Yarn package manager
- Python 3.x with pip

### Setup

1. Clone the repository
2. Install Node.js dependencies:
   ```bash
   yarn install
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Scripts and Commands

The Kotlin Website project includes various scripts defined in `package.json` for different purposes. Understanding these scripts is essential for efficient development and testing. Below is a comprehensive guide to all available scripts, organized by category.

#### Development Scripts (Long-running Processes)

These scripts start development servers that continue running until manually stopped. They are not "builds" in the traditional sense and should not be expected to complete on their own.

- **`yarn start`**: Starts the webpack development server on port 9000.
  - **Purpose**: Main development server that integrates both Flask and Next.js components.
  - **Behavior**: Long-running process that continues until manually stopped (Ctrl+C).
  - **Details**: 
    - Serves the website on http://localhost:9000
    - Proxies requests to the Next.js server (port 3000) for `/community/**` and `/_next/**` routes
    - Proxies all other requests to the Flask server (port 8080)
    - Enables hot module replacement for frontend assets
  - **When to use**: For general website development when working on both Flask and Next.js components.

- **`yarn next-dev`**: Starts the Next.js development server on port 3000.
  - **Purpose**: Development server for Next.js components only.
  - **Behavior**: Long-running process that continues until manually stopped (Ctrl+C).
  - **Details**: 
    - Serves Next.js pages on http://localhost:3000
    - Provides fast refresh for React components
  - **When to use**: When focusing solely on Next.js components (e.g., home page, community section).
  - **Note**: This server only handles Next.js routes and won't serve Flask-based pages.

#### Build Scripts (One-time Commands)

These scripts perform build operations and complete when the build is finished. They produce static output files that can be deployed or served.

- **`yarn build`**: Builds the entire website for production.
  - **Purpose**: Creates a complete production build of the website.
  - **Behavior**: One-time command that completes when the build is finished.
  - **Details**: 
    - Runs both `build:production` and `next-build-static` sequentially
    - Outputs webpack assets to `dist/` directory
    - Outputs Next.js static files to `out/` directory
  - **When to use**: When preparing the website for production deployment.

- **`yarn build:production`**: Builds webpack assets for production.
  - **Purpose**: Creates optimized webpack bundles for production.
  - **Behavior**: One-time command that completes when the build is finished.
  - **Details**: 
    - Sets NODE_ENV to 'production'
    - Outputs optimized assets to `dist/` directory
    - Minifies JavaScript and CSS
  - **When to use**: When you need to build only the webpack assets without the Next.js part.

- **`yarn next-build-static`**: Builds and exports the Next.js static site.
  - **Purpose**: Creates static HTML files from Next.js pages.
  - **Behavior**: One-time command that completes when the build is finished.
  - **Details**: 
    - Runs `next build` followed by `next export`
    - Outputs static files to `out/` directory
  - **When to use**: When you need to build only the Next.js part without the webpack assets.

#### Testing Scripts

These scripts run tests using Playwright. Some are one-time commands that complete when tests finish, while others may open browser windows for interactive testing.

- **`yarn test`**: Runs all Playwright tests.
  - **Purpose**: Executes all automated tests.
  - **Behavior**: One-time command that completes when tests finish.
  - **Prerequisite**: Development server should be running on http://localhost:9000 (`yarn start`).
  - **When to use**: For comprehensive testing before submitting changes.

- **`yarn test:production`**: Runs production tests.
  - **Purpose**: Tests production-specific functionality.
  - **Behavior**: One-time command that completes when tests finish.
  - **Prerequisite**: Development server should be running on http://localhost:9000 (`yarn start`).
  - **When to use**: To verify production-specific features.

- **`yarn test:production:ci`**: Runs production tests in CI environment.
  - **Purpose**: Tests production-specific functionality in continuous integration.
  - **Behavior**: One-time command that completes when tests finish.
  - **Details**: Sets CI=true and uses kotlinlang.org as the base URL.
  - **When to use**: In CI/CD pipelines.

- **`yarn test:production:headed`**: Runs production tests with visible browser.
  - **Purpose**: Tests production-specific functionality with visible browser windows.
  - **Behavior**: One-time command that completes when tests finish, but opens browser windows.
  - **Prerequisite**: Development server should be running on http://localhost:9000 (`yarn start`).
  - **When to use**: For debugging production tests visually.

- **`yarn test:production:debug`**: Runs production tests in debug mode.
  - **Purpose**: Debugs production tests with Playwright's debugging tools.
  - **Behavior**: Interactive process that opens Playwright's debugging interface.
  - **Prerequisite**: Development server should be running on http://localhost:9000 (`yarn start`).
  - **When to use**: For detailed debugging of production tests.

- **`yarn test:e2e`**: Runs end-to-end tests.
  - **Purpose**: Tests end-to-end functionality.
  - **Behavior**: One-time command that completes when tests finish.
  - **Prerequisite**: Development server should be running on http://localhost:9000 (`yarn start`).
  - **When to use**: To verify end-to-end functionality.

- **`yarn test:e2e:ci`**: Runs end-to-end tests in CI environment.
  - **Purpose**: Tests end-to-end functionality in continuous integration.
  - **Behavior**: One-time command that completes when tests finish.
  - **Details**: Sets CI=true.
  - **When to use**: In CI/CD pipelines.

- **`yarn test:e2e:headed`**: Runs end-to-end tests with visible browser.
  - **Purpose**: Tests end-to-end functionality with visible browser windows.
  - **Behavior**: One-time command that completes when tests finish, but opens browser windows.
  - **Prerequisite**: Development server should be running on http://localhost:9000 (`yarn start`).
  - **When to use**: For debugging end-to-end tests visually.

- **`yarn test:e2e:debug`**: Runs end-to-end tests in debug mode.
  - **Purpose**: Debugs end-to-end tests with Playwright's debugging tools.
  - **Behavior**: Interactive process that opens Playwright's debugging interface.
  - **Prerequisite**: Development server should be running on http://localhost:9000 (`yarn start`).
  - **When to use**: For detailed debugging of end-to-end tests.

- **`yarn test:e2e:update`**: Updates test snapshots.
  - **Purpose**: Updates visual regression test snapshots.
  - **Behavior**: One-time command that completes when snapshots are updated.
  - **Prerequisite**: Development server should be running on http://localhost:9000 (`yarn start`).
  - **When to use**: When intentional UI changes cause snapshot tests to fail.

- **`yarn test:e2e:new`**: Generates new Playwright tests.
  - **Purpose**: Creates new test scripts using Playwright's codegen tool.
  - **Behavior**: Interactive process that opens Playwright's codegen interface.
  - **Prerequisite**: Development server should be running on http://localhost:9000 (`yarn start`).
  - **When to use**: When creating new automated tests.

#### Utility Scripts

These scripts perform various utility functions and are typically one-time commands.

- **`yarn postinstall`**: Runs automatically after `yarn install`.
  - **Purpose**: Builds the codemirror dependency.
  - **Behavior**: One-time command that completes when the build is finished.
  - **Details**: Changes to the codemirror directory and runs rollup.
  - **When to use**: Automatically executed after installing dependencies.

- **`yarn lint`**: Runs ESLint on the codebase.
  - **Purpose**: Checks code quality and style.
  - **Behavior**: One-time command that completes when linting is finished.
  - **Details**: Uses Next.js's built-in linting configuration.
  - **When to use**: Before committing changes to ensure code quality.

### Production Build

To build the website for production:

```bash
yarn build
```

This command:
1. Runs the production webpack build (`yarn build:production`)
2. Builds and exports the Next.js static site (`yarn next-build-static`)

The production build outputs to:
- `dist/` - Webpack output
- `out/` - Next.js static export

### Docker Build

The project includes Docker configuration for containerized development and deployment:

```bash
docker-compose up
```

## Testing Information

### Testing Framework

The project uses Playwright for end-to-end testing. Tests are written in TypeScript and located in the `test/` directory.

### Test Structure

- `test/e2e/` - End-to-end tests
- `test/production/` - Production tests
- `test/page/` - Page object models
- `test/snapshots/` - Visual regression test snapshots

### Running Tests

Before running tests, ensure the development server is running on http://localhost:9000:

```bash
yarn start
```

This is the most common approach as the webpack development server proxies requests to both Flask and Next.js servers. Tests are configured to use port 9000 by default.

#### For Testing Next.js Pages

If you're specifically testing or developing Next.js-based pages (like the home page or `/community/`), you should also run the Next.js development server:

```bash
yarn next-dev
```

#### Advanced Setup (When Needed)

In some cases, if you need to test specific Flask functionality or encounter issues with certain pages not loading correctly, you may need to run additional servers:

1. Start the Flask server:
```bash
python kotlin-website.py
```

2. Start the Next.js development server:
```bash
yarn next-dev
```

3. Start the webpack development server:
```bash
yarn start
```

Running all three servers ensures that all parts of the website are properly served, but for most testing scenarios, just running `yarn start` is sufficient.

To run all tests:

```bash
yarn test
```

To run only end-to-end tests:

```bash
yarn test:e2e
```

To run production tests:

```bash
yarn test:production
```

For debugging tests:

```bash
yarn test:e2e:debug
```

For visual testing with headed browser:

```bash
yarn test:e2e:headed
```

### Creating New Tests

1. Create a new test file in the appropriate directory
2. Use the Playwright test framework
3. Follow the page object model pattern for complex pages
4. Use descriptive test names and organize tests in describe blocks
5. Use semantic selectors (see "Test Selectors Best Practices" below)

#### Example Test

Here's a simple test that checks if the homepage loads correctly:

```typescript
import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load correctly', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Check if the page title contains "Kotlin"
    const title = await page.title();
    expect(title).toContain('Kotlin');
    
    // Check if the main content is visible using semantic selector
    const mainContent = page.getByRole('main');
    await expect(mainContent).toBeVisible();
  });
});
```

### Test Coverage Requirements

Tests are an integral part of feature development, not an optional add-on. When modifying code in the Kotlin Website project, you must ensure that your changes are properly tested. This is especially important when working with code that isn't already covered by tests.

#### Adding Tests for Modified Code

When you modify code that isn't covered by tests:

1. **Create new tests** that specifically target the functionality you've modified
2. **Place tests in the appropriate directory**:
   - `test/e2e/` for end-to-end tests of user-facing features
   - `test/production/` for production-specific functionality
   - `test/component/` for isolated component tests
   
3. **Test both the happy path and edge cases**:
   - Verify that the feature works as expected under normal conditions
   - Test boundary conditions and error handling
   - Consider accessibility and different user interactions

4. **Follow existing test patterns** in the project:
   - Use the Page Object Model for complex pages
   - Use semantic selectors for stable tests
   - Write descriptive test names that explain what's being tested

#### Identifying Code That Needs Test Coverage

To identify whether code you're modifying needs test coverage:

1. **Search for existing tests** that cover the component or functionality
2. **Check test coverage** if coverage reports are available
3. **When in doubt, add tests** - it's better to have redundant tests than missing tests

#### Example: Adding Tests for a Modified Component

If you modify a component like the site header:

```typescript
// test/component/header.spec.ts
import { expect, test } from '@playwright/test';

test.describe('Site Header', () => {
  test('should display the correct navigation items', async ({ page }) => {
    // ..
    // Test the specific functionality you modified
    const docsLink = page.getByRole('link', { name: 'Docs' });
    await expect(docsLink).toBeVisible();
    await docsLink.click();
    await expect(page.url()).toContain('/docs/');
  });
  
  // Add more tests for other aspects of your changes
});
```

Remember that tests are part of your deliverable. Code changes without corresponding test coverage are considered incomplete.

### Test Selectors Best Practices

When writing tests, prefer semantic selectors over class identifiers. This approach makes tests more resilient to UI changes and better reflects the user's interaction with the page.

#### Semantic Selectors Priority

Use selectors in the following order of preference:

1. **Semantic Selectors**: These target elements based on their role, text content, or accessibility attributes
   - `getByRole`: Select elements by their ARIA role
     ```typescript
     // Find a link with specific text
     const getStartedButton = page.getByRole('link', { name: 'Get started' });
     
     // Find a button with specific text
     const submitButton = page.getByRole('button', { name: 'Submit' });
     ```
   
   - `getByText`: Select elements by their text content
     ```typescript
     // Find an element containing specific text
     const heading = page.getByText('Get involved in the community');
     ```
   
   - `getByTestId`: Select elements by their data-test attribute
     ```typescript
     // Find an element with a specific data-test attribute
     const heroBlock = page.getByTestId('hero-block');
     ```

2. **Data Attributes**: Use the `testSelector` utility function for elements that need specific identification
   ```typescript
   import { testSelector } from '../../utils';
   
   // Find an element with data-test="layout-wrapper"
   const wrapper = page.locator(testSelector('layout-wrapper'));
   ```

3. **CSS Selectors**: Use only when necessary to precisely identify the scope of semantics
   ```typescript
   // Only use when semantic selectors or data attributes aren't suitable
   const element = page.locator('nav ul.toc').first();
   ```

#### Avoid Using Class Identifiers

Avoid using class identifiers directly, especially with CSS Modules where class names include generated hashes:

❌ **Avoid This**:
```typescript
// Using CSS Module class names with hashes (unstable)
const element = page.locator('[class*="ktl-quotes-slider-module_quotes-slider"]');
```

✅ **Do This Instead**:
```typescript
// Using semantic selector
const element = page.getByRole('region', { name: 'Customer Quotes' });

// Or using data-test attribute
const element = page.locator(testSelector('quotes-slider'));
```

#### Real-World Example

Here's an example from the project that demonstrates good selector usage:

```typescript
test('Hero section Get started button', async ({ page }) => {
    // Using getByTestId to find the container
    // Using getByRole to find the link by its role and text
    const getStartedButton = page.getByTestId('hero-block').getByRole('link', { name: 'Get started' });
    await expect(getStartedButton).toBeVisible();
    await getStartedButton.click();
    await expect(page.url()).toContain('/docs/getting-started.html');
    
    // Using semantic locator for the page title
    const pageTitle = page.locator('h1').first();
    await expect(pageTitle).toContainText('Get started with Kotlin');
});
```

### Visual Regression Testing

The project uses Playwright's snapshot testing for visual regression testing:

1. Take a screenshot of an element:
   ```typescript
   const screenshot = await page.locator('selector').screenshot();
   ```

2. Compare with a baseline:
   ```typescript
   expect(screenshot).toMatchSnapshot('name.png');
   ```

3. Update snapshots when needed:
   ```bash
   yarn test:e2e:update
   ```

## Additional Development Information

### Project Architecture

The Kotlin Website uses a hybrid architecture that combines modern frontend frameworks with a Python backend:

#### Component Structure

1. **Web Application Core (Python/Flask)**:
   - Core server-side application that handles routing, page generation, and content processing
   - Key files: `kotlin-website.py` (main Flask application), `src/` (Python modules)
   - Technologies: Python 3, Flask, Flask-Frozen, BeautifulSoup, YAML processing

2. **Frontend Framework (Next.js/React)**:
   - Modern frontend framework that provides interactive UI components
   - Key directories: `blocks/` (page-specific section components), `components/` (reusable UI components), `pages/` (Next.js pages)
   - Technologies: Next.js, React, TypeScript, CSS Modules

3. **Templates and Layouts (Jinja2)**:
   - Server-side templates that define the structure and layout of pages
   - Key directory: `templates/` (Jinja2 templates)
   - Technologies: Jinja2 templating, HTML, CSS

4. **Documentation System**:
   - Comprehensive documentation for the Kotlin language
   - Key directory: `docs/` (documentation files), `dokka-templates/` (API documentation templates)
   - Technologies: Markdown, JetBrains Writerside, Dokka

5. **Configuration and Data**:
   - Configuration files and data that define the website's structure and content
   - Key directory: `data/` (data files in YAML and JSON formats)
   - Technologies: YAML, JSON

#### Hybrid Architecture: Next.js and Flask Freeze

The Kotlin Website employs a hybrid architecture that combines two different approaches for page generation:

1. **Next.js-based Pages**:
   - Modern, interactive pages built with Next.js and React
   - Written in TypeScript (.tsx files)
   - Located in `pages/` directory (e.g., `index.tsx`, `404.tsx`)
   - UI components located in `components/` directory (reusable UI elements)
   - Page sections located in `blocks/` directory (larger page components)
   - Styled with CSS Modules
   - Key pages: Home page (`/`), Community section (`/community/`), 404 error page
   - Asset management: CSS Modules, Global CSS, React components, Static assets
   - Build process: `next dev` for development, `next build && next export` for production
   - Client-side rendered with static generation for production
   - Components are imported directly in Next.js pages

2. **Flask-based Pages**:
   - Traditional server-rendered pages built with Flask and Jinja2
   - Located in `templates/` directory
   - Processed by the Flask application in `kotlin-website.py`
   - Key pages: Documentation (`/docs/`), API Reference (`/api/`), Education section (`/education/`)
   - Asset management: Webpack-bundled JavaScript, SCSS styles, Jinja2 templates
   - Build process: Flask development server for development, Flask-Frozen for production

3. **Flask Pages with React Components**:
   - Some Flask-based pages use React components for enhanced interactivity
   - React components for Flask are written in JavaScript (.jsx files)
   - React components for Flask are located in `static/js/ktl-component/` directory (e.g., `header/index.jsx`, `footer/index.jsx`, `teach/index.jsx`)
   - The `/education/` page is a prime example of this approach
   - Flask handles routing and data preparation
   - React components are server-side rendered using Node.js via `scripts/react-renderer/compile.mjs`
   - Components are integrated into Flask templates using a custom Jinja2 extension (`KTLComponentExtension`)
   - Integration is done using a custom Jinja2 tag: `{% ktl_component "componentName" prop1="value1" prop2=value2 %}`
   - Data is passed from Flask to React through props
   - The rendered HTML is included in the Flask template
   - This approach combines the benefits of server-side rendering with React's component model

4. **React Components for Dokka Templates**:
   - API documentation uses custom Dokka templates with React components
   - React components for Dokka are located in `static/js/page/dokka-template/` directory (e.g., `header/index.jsx`, `footer/index.jsx`)
   - Server-side rendered using the same Node.js renderer as Flask components
   - Used to provide consistent UI elements across API documentation pages

5. **Integration Between Approaches**:
   - Webpack dev server (port 9000) proxies requests to both Next.js server (port 3000) and Flask server (port 8080)
   - Requests to `/community/**` and `/_next/**` are proxied to the Next.js server
   - All other requests are proxied to the Flask server
   - Both Next.js and Flask Freeze generate static HTML files for production
   - Flask application configures routes to serve Next.js-generated content

#### Next.js Component Organization: Blocks vs Components

The Next.js part of the Kotlin Website follows a specific organizational pattern for React components, dividing them into two main directories:

1. **`blocks/` Directory**:
   - Contains **page-specific section components** that represent major sections of a page
   - Organized by page or section (e.g., `main/`, `community/`, `404/`)
   - Each block typically represents a complete, self-contained section of a page
   - Blocks are larger, more complex components that often contain multiple nested elements
   - They may import data from YAML files or other sources
   - Examples: `HeroSection`, `LatestNews`, `KotlinUsageHighlights`, `WhyKotlin`
   - Usage pattern: Imported and used directly in page components (in the `pages/` directory)

2. **`components/` Directory**:
   - Contains **reusable UI components** that can be used across different pages
   - Not tied to specific pages or sections
   - Smaller, focused components with specific functionality
   - Designed for reusability and composability
   - Often used by multiple blocks or pages
   - Examples: `Layout`, `StickyHeader`, `CodeBlock`
   - Usage pattern: Imported and used in both page components and block components

**When to use which directory:**

- Use `blocks/` for:
  - Major sections of a page (hero sections, feature highlights, etc.)
  - Components that are specific to a particular page or section
  - Components that represent a complete piece of content or functionality
  - Components that are unlikely to be reused elsewhere

- Use `components/` for:
  - UI elements that can be reused across multiple pages
  - Generic functionality that isn't tied to specific content
  - Building blocks for larger components
  - Components that provide common layout or behavior patterns

This organization helps maintain a clear separation between page-specific sections and reusable UI elements, making the codebase more maintainable and easier to navigate.

### Code Style

- TypeScript for Next.js/React components
- Python for Flask backend
- ESLint and Prettier for JavaScript/TypeScript linting and formatting
- Follow existing patterns for consistency

To lint the code:

```bash
yarn lint
```

### Documentation System

The project uses multiple documentation systems:

1. Markdown files in `docs/` directory
2. JetBrains Writerside for structured documentation
3. Dokka for API documentation generation

### CI/CD Pipeline

The project uses:
- GitHub Actions for continuous integration
- TeamCity for deployment automation

The TeamCity configuration is defined in the `.teamcity/` directory using Kotlin DSL.

### Common Issues and Solutions

1. **Missing dependencies**: Ensure both Node.js and Python dependencies are installed.
2. **Port conflicts**: The development server uses port 9000. Ensure it's available.
3. **Test failures**: Visual regression tests may fail due to minor UI changes. Update snapshots if needed.
4. **Build errors**: Check webpack and Next.js configurations if build fails.

### Performance Considerations

- The website uses static site generation for performance
- Use code splitting and lazy loading for large components
- Optimize images and assets for web delivery

### CSS Modules in React Components

The Kotlin Website uses CSS Modules for styling React components. CSS Modules provide local scoping of CSS by automatically creating unique class names when styles are imported into JavaScript/TypeScript files.

#### How CSS Modules Work

1. **File Naming**: CSS Module files use the `.module.css` extension (e.g., `layout.module.css`)
2. **Importing Styles**: Components import styles from CSS Module files:
   ```typescript
   import styles from './layout.module.css';
   ```
3. **Using Styles**: Components apply styles using the imported object:
   ```tsx
   <div className={styles.wrapper}>
     {children}
   </div>
   ```
4. **Generated Class Names**: During build time, CSS Modules generate unique class names by adding a hash to the original class name:
   ```html
   <!-- Original class in CSS file: .wrapper -->
   <!-- Generated class in HTML: -->
   <div class="layout_wrapper_SNPG7">
     <!-- content -->
   </div>
   ```

The hash (e.g., `_SNPG7`) ensures that class names are unique across the application, preventing style conflicts between components.

#### Testing with CSS Modules

When writing tests for components that use CSS Modules, avoid using the generated class names with hashes as selectors, as these hashes can change between builds. Instead:

1. **Use Data Attributes**: Add data attributes to elements for testing purposes:
   ```tsx
   <div className={styles.wrapper} data-test="layout-wrapper">
     {children}
   </div>
   ```

2. **Use the `testSelector` Utility**: The project provides a utility function for selecting elements with data-test attributes:
   ```typescript
   import { testSelector } from '../../utils';
   
   // In your test:
   const wrapper = page.locator(testSelector('layout-wrapper'));
   ```

3. **Use Stable Selectors**: If data attributes aren't available, use other stable selectors like element types, IDs, or non-hashed class names.

❌ **Avoid This**:
```typescript
// Using CSS Module class names with hashes (unstable)
const element = page.locator('[class*="ktl-quotes-slider-module_quotes-slider"]');
```

✅ **Do This Instead**:
```typescript
// Using data-test attributes (stable)
const element = page.locator(testSelector('quotes-slider'));
```

This approach ensures that tests remain stable even when the CSS Module hashes change between builds.

### File Structure

The repository is organized with the following top-level directories:

- `_assets/` - Asset files for development
- `.github/` - GitHub Actions workflows and configurations
- `.idea/` - JetBrains IDE configuration files
- `.teamcity/` - TeamCity DSL configuration files for CI/CD pipelines
- `assets/` - Additional assets for the website
- `blocks/` - Block components for page sections
- `build/` - Build output directory
- `components/` - UI components for the website
- `data/` - Data files for website content
- `dist/` - Distribution files for production
- `docs/` - Documentation content and configuration
- `dokka-templates/` - Templates for API documentation generation
- `pages/` - Next.js page components
- `pdf/` - PDF generation assets and templates
- `public/` - Public assets served directly by Next.js
- `scripts/` - Utility scripts for development and deployment
- `src/` - Source code (Python) for the backend
- `static/` - Static assets for the website
- `templates/` - Jinja2 templates for server-side rendering
- `test/` - Test files for automated testing

### Integration Points

The project integrates several systems and services:

1. **Content Integration**:
   - Documentation from separate repositories (coroutines, lincheck, Dokka, etc.)
   - API reference generated from Kotlin source code using Dokka
   - Grammar reference generated from grammar definition
   - External blog posts and articles referenced in the content

2. **External Services**:
   - GitHub for source code management and issue tracking
   - Google Maps API for displaying community events and Kotlin User Groups
   - Algolia for search functionality
   - Google Analytics for usage tracking
   - YouTube for embedded video content
   - Twitter/X for social media integration

### PDF Generator System

The project includes a specialized system for generating PDF documentation:

- Core implementation in `src/pdf.py`
- PDF-related assets and templates in `pdf/` directory
- Workflow:
  1. HTML content is generated from Markdown documentation
  2. PDF generation is triggered via command-line argument (`reference-pdf`)
  3. Cover page is prepared with the current Kotlin version
  4. HTML content is processed to fix image links and remove unnecessary sections
  5. `wkhtmltopdf` tool converts the processed HTML to PDF
  6. The resulting PDF is saved as `kotlin-docs.pdf`
- The PDF is accessible on the website at `/docs/kotlin-docs.pdf`

### TeamCity DSL Pipelines

The project uses TeamCity for CI/CD with Kotlin DSL configuration:

- Configuration in `.teamcity/` directory
- Main components:
  - `settings.kts` - Main TeamCity project configuration
  - `BuildParams.kt` - Central configuration with version information
  - `kotlinlang/` - Main website build configurations
  - `references/` - API reference build configurations
  - `tests/` - Test configurations
- Build configurations for different website components (JS assets, grammar, docs, etc.)
- Automated testing with end-to-end tests

### GitHub Workflows

The project uses GitHub Actions for continuous integration and automation:

- Workflows defined in `.github/workflows/` directory
- Key workflows:
  - `autoupdate.yml` - Automatically updating dependencies or content
  - `close-stale-pr.yml` - Automatically closing stale pull requests
  - `qodana-code-quality-check.yml` - Running Qodana code quality checks
  - `validate-events-data.yml` - Validating events data
  - `validate-user-groups-data.yml` - Validating user groups data
  - `verify-samples.yml` - Verifying code samples

### TeamCity Build System

The project uses TeamCity for CI/CD with Kotlin DSL configuration. The TeamCity builds are responsible for building, testing, and deploying the website, as well as generating API references and search indexes.

#### Main TeamCity Components

- Configuration in `.teamcity/` directory
- Main components:
  - `settings.kts` - Main TeamCity project configuration
  - `BuildParams.kt` - Central configuration with version information
  - `kotlinlang/` - Main website build configurations
  - `references/` - API reference build configurations
  - `tests/` - Test configurations
  - `templates/` - Build templates

#### Key Build Configurations

- **BuildJsAssets**: Builds JavaScript assets for the website
- **BuildKotlinGrammar**: Generates the Kotlin grammar reference
- **BuildKotlinSpec**: Builds the Kotlin language specification
- **BuildReferenceDocs**: Generates reference documentation
- **BuildSearchIndex**: Builds the Algolia search index
- **BuildSitePages**: Builds the main site pages
- **FetchBlogNews**: Fetches blog news from external sources
- **PageViews**: Collects page view statistics
- **PdfGenerator**: Generates PDF documentation

#### Build Triggers

TeamCity builds are triggered by:
- VCS changes (when code is pushed to the repository)
- Scheduled triggers (e.g., the search index is rebuilt every 2 days)
- Dependencies (when a dependent build completes)

#### Build Artifacts

Each build produces artifacts that can be used by other builds or deployed to production:
- HTML pages
- JavaScript and CSS assets
- API reference documentation
- Search indexes
- PDF documentation

### Algolia Search Index Generation System

The project includes a specialized system for generating and updating the Algolia search index, which powers the search functionality across the website. This system also generates a sitemap.xml file and produces statistics about the website content.

#### Search Index Generation Process

1. **Data Collection**: The system collects data from the built website pages in the `dist/` directory
2. **Metadata Extraction**: For each page, metadata is extracted including title, content, and other relevant information
3. **Index Generation**: The metadata is processed and formatted into search records
4. **Algolia Upload**: The search records are uploaded to Algolia using the Algolia API
5. **Sitemap Generation**: A sitemap.xml file is generated with URLs, priorities, and last modified dates
6. **Statistics Generation**: Reports are generated with statistics about file types and content

#### Key Components

- **Node.js Scripts**: Located in `scripts/dist/` directory
  - `analyzer/index.ts` - Main entry point for the analyzer
  - `analyzer/reports/write.ts` - Generates reports including the search index, sitemap, and statistics
  - `analyzer/reports/utils.ts` - Utility functions for generating sitemap items and statistics reports
  - `lib/search/algolia.ts` - Handles uploading the index to Algolia
  - `lib/search/records.ts` - Processes and formats search records
  - `lib/files/index.ts` - Defines folder locations for input and output

#### Generated Outputs

1. **Search Index**: Uploaded to Algolia for powering the website's search functionality
2. **Sitemap.xml**: Generated in the `dist/` directory, containing:
   - URLs for all pages on the website
   - Priority values based on page type (home page and documentation have highest priority)
   - Last modified dates when available
3. **Statistics Reports**: Generated in the `reports/` directory, including:
   - `files-list.json5` - A list of all files processed
   - `files-unknown.txt` - A list of files with unknown types
   - `files-redirects.txt` - A list of redirect files
   - `file-types.csv` - Statistics about file types and their counts

#### TeamCity Integration

The search index generation is integrated into the TeamCity CI/CD pipeline:

1. **Build Configuration**: `BuildSearchIndex` in `.teamcity/kotlinlang/builds/BuildSearchIndex.kt`
2. **Template**: `TemplateSearchIndex` in `.teamcity/templates/TemplateSearchIndex.kt`
3. **Build Steps**:
   - Install Node.js dependencies
   - Run the `generate-metadata` script to analyze the website and generate the search index, sitemap, and statistics
4. **Environment Variables**:
   - `ALGOLIA_INDEX_NAME` - The name of the Algolia index
   - `WH_SEARCH_USER` - Algolia application ID
   - `WH_SEARCH_WRITE_KEY` - Algolia write API key

#### Scheduled Execution

The search index, sitemap, and statistics are automatically rebuilt from time to time to ensure they stay up-to-date with the website content.

### Flask-React Integration System

The project includes a specialized system for integrating React components with Flask templates. This system allows for enhanced interactivity in Flask-rendered pages while maintaining the benefits of server-side rendering.

#### Integration Process

1. **Flask Template**: A Flask template includes a React component using a custom Jinja2 tag:
   ```html
   {% ktl_component "componentName" prop1=value1 prop2=value2 %}
   ```

2. **Jinja2 Extension**: The `KTLComponentExtension` class in `src/ktl_components.py` processes the tag
   - Parses the component name and props
   - Calls Node.js to render the React component
   - Returns the rendered HTML to be included in the template

3. **Server-Side Rendering**: Node.js renders the React component using:
   - `scripts/react-renderer/compile.js` - Sets up Babel configuration
   - `scripts/react-renderer/compile.mjs` - Imports and renders the component
   - React's `renderToString` function to convert the component to HTML

4. **Client-Side Hydration**: After the page loads, JavaScript initializes the React components:
   - `static/js/ktl-component/index.js` finds component placeholders in the DOM
   - It initializes the appropriate React component with the same props
   - This enables interactivity after the initial server-side render

#### Education Page Example

The `/education/` page is a prime example of this integration:

1. **Flask Route**: Defined in `kotlin-website.py`:
   ```python
   @app.route('/education/')
   def education_page():
       return render_template(
           'pages/education/index.html',
           universities_count=len(site_data['universities']),
           countries_count=get_countries_size()
       )
   ```

2. **Template**: Located at `templates/pages/education/index.html`:
   ```html
   {% extends 'base.html' %}
   {% block page_outer_content %}
       {% ktl_component "teach" path=request.path countriesCount=countries_count universitiesCount=universities_count %}
   {% endblock %}
   ```

3. **React Component**: Located at `static/js/ktl-component/teach/index.jsx`:
   - Receives props: `path`, `countriesCount`, `universitiesCount`
   - Renders various sections including an interactive map
   - Uses sub-components for different parts of the page

This approach allows for complex, interactive UI components within Flask-rendered pages, combining the benefits of both frameworks.

### Dokka Template Generator System

The project includes a custom template generator for Dokka, which is used to create personalized HTML templates for API documentation. This system allows the Kotlin website to maintain a consistent look and feel across all API documentation pages while providing library-specific customizations.

#### Template Structure

- **Base Template**: Located in `dokka-templates/base.ftl`, this Freemarker template defines the overall HTML structure for API documentation pages
- **Include Templates**: Located in `dokka-templates/includes/`, these templates provide reusable components for headers, footers, metadata, and source set selectors
- **React Components**: Located in `static/js/page/dokka-template/`, these components provide interactive UI elements that are rendered into the templates

#### Template Generation Process

The template generation process uses Node.js to render React components into HTML:

1. The `scripts/dokka/generate-templates.js` script walks through the `dokka-templates` directory
2. It finds Freemarker template files (`.ftl` extension)
3. It parses the content of these files looking for special `ktl_component` tags
4. For each component found, it calls a Node.js script to render the component
5. The component is rendered using React's server-side rendering capabilities
6. The rendered HTML replaces the component tag in the template
7. The updated template is saved back to the file system

#### React Component Rendering

The React component rendering is handled by:

1. `scripts/react-renderer/compile.js` - Sets up Babel configuration for server-side rendering
2. `scripts/react-renderer/compile.mjs` - Imports and renders React components to HTML strings
3. Components are imported from `static/js/page/dokka-template/` directory
4. React's `renderToString` function is used to convert components to HTML

#### Key Components

- **Header**: Customized version of the global Kotlin website header with search functionality
- **Footer**: Customized version of the global Kotlin website footer with theme support
- **Feedback System**: Interactive feedback form for users to provide feedback on documentation

#### TeamCity Integration

The Dokka template generator is integrated into the TeamCity CI/CD pipeline:

1. **Template Definition**: `PrepareDokkaTemplate` in `.teamcity/references/templates/PrepareDokkaTemplate.kt` defines the build steps
2. **Build Steps**:
   - Fix npm sharp platform-related issues
   - Install dependencies using yarn
   - Build templates by running the `generate-templates.js` script using Node.js
3. **Library-Specific Configurations**: Each library (e.g., kotlinx.coroutines, kotlinx.serialization) has its own build configuration that:
   - Uses the `PrepareDokkaTemplate` template
   - Sets environment variables for customization (e.g., Algolia index name, API reference name)
4. **Artifact Publishing**: The generated templates are published as build artifacts and used in subsequent API documentation generation steps

#### Environment Variables

The template generation process uses several environment variables for customization:

- `ALGOLIA_INDEX_NAME` - The Algolia search index name for the library
- `API_REFERENCE_NAME` - The display name of the API reference
- `DOKKA_CUSTOM_BODY` - Custom CSS classes for the body element
- `DOKKA_FEEDBACK` - Flag to enable/disable the feedback form

#### Usage in Development

To generate templates locally:

```bash
node ./scripts/dokka/generate-templates.js
```

This will process all templates in the `dokka-templates` directory and update them with rendered components.

### Grammar Reference Generation System

The project includes a specialized system for generating and rendering the Kotlin grammar reference page. This system transforms the formal Kotlin grammar definition into a user-friendly HTML page that documents the language syntax. The grammar reference is accessible at `/docs/reference/grammar.html` and is an important resource for developers who need to understand Kotlin's syntax in detail.

#### Generation Workflow

The grammar reference generation involves multiple components across different repositories and follows a multi-stage process:

1. **Grammar Definition**: The Kotlin grammar is defined in ANTLR format in the [kotlin-spec repository](https://github.com/Kotlin/kotlin-spec/tree/release/grammar/src/main/antlr). This is the authoritative source for Kotlin's formal grammar.
2. **Grammar Generator**: The [website-grammar-generator](https://github.com/Kotlin/website-grammar-generator) tool processes the ANTLR grammar to generate `grammar.xml`, which contains a structured representation of the grammar that can be processed by the website.
3. **XML Processing**: The Flask application reads and processes `grammar.xml` to create a structured data representation that can be rendered by the templates.
4. **HTML Rendering**: The processed data is passed to a Jinja2 template that renders it as HTML with proper formatting, styling, and navigation elements.
5. **Client-Side Enhancement**: JavaScript adds interactive navigation features to the rendered page, including a table of contents and navigation tree.

#### Key Components

1. **Grammar XML File**:
   - Generated by the website-grammar-generator tool during the build process
   - Expected to be in the project root directory as `grammar.xml`
   - Contains a structured representation of the Kotlin grammar with declarations, descriptions, and relationships between grammar elements
   - This file is the bridge between the formal grammar definition and the website's rendering system

2. **Flask Route and Processing**:
   - Route defined in `kotlin-website.py` that handles requests to the grammar reference page:
     ```python
     @app.route('/docs/reference/grammar.html')
     def grammar():
         grammar = get_grammar(build_mode)
         if grammar is None:
             return "Grammar file not found", 404
         return render_template('pages/grammar.html', kotlinGrammar=grammar)
     ```
   - Processing logic in `src/grammar.py` that transforms the XML into a structured format:
     - Parses the XML file using ElementTree for efficient XML processing
     - Transforms XML nodes into a structured data format with proper typing and relationships
     - Handles different types of grammar elements (declarations, descriptions, identifiers, symbols, etc.)
     - Creates a hierarchical representation that preserves the grammar's structure

3. **HTML Template**:
   - Located at `templates/pages/grammar.html`
   - Renders the grammar data as HTML with proper formatting and styling
   - Creates links between related grammar elements for easy navigation
   - Includes a table of contents for quick access to different sections
   - Uses Jinja2 templating features to iterate through the grammar structure

4. **Client-Side JavaScript**:
   - Located at `static/js/page/grammar.js`
   - Initializes a navigation tree and table of contents when the page loads
   - Enhances the user experience with better navigation and interactive features
   - Integrates with the site's global navigation system

#### TeamCity Integration

The grammar reference generation is integrated into the TeamCity CI/CD pipeline:

1. **Build Configuration**: `BuildKotlinGrammar` in the TeamCity configuration
2. **Build Steps**:
   - Clone the kotlin-spec repository to access the grammar definition
   - Run the website-grammar-generator tool to generate grammar.xml
   - Place the generated file in the project root
3. **Dependencies**: This build is a dependency for the main website build

#### Usage in Development

During local development, the grammar.xml file needs to be present in the project root for the grammar page to render correctly. If the file is missing, the page will display an error message.

### Data Files System

The Kotlin Website uses a centralized data files system to manage content and configuration across the website. This system provides a structured way to store and access data that is used by various components of the website, including Flask routes, Jinja2 templates, and Next.js components. This approach separates content from presentation, making it easier to update website content without changing code.

The data files are stored in the `data/` directory at the project root. These files are primarily in YAML format (with some JSON files for specific purposes) and contain structured data that defines various aspects of the website:

1. **Configuration Files**:
   - `releases.yml` - Information about Kotlin releases, including the latest version
   - `_nav.yml` - Navigation structure for the website
   - `release-banner.yml` - Configuration for release announcement banners

2. **Content Files**:
   - `events.yml` - List of Kotlin community events with details like dates, locations, and speakers
   - `universities.yml` - List of universities teaching Kotlin, with courses and geographical information
   - `user-groups.yml` - List of Kotlin User Groups worldwide with contact information
   - `videos.yml` - Collection of Kotlin-related videos
   - `testimonials.yml` - User testimonials about Kotlin

3. **API Data**:
   - `cities.json` - Geographical data for cities
   - `kotlinconf.yml` - Information about KotlinConf events
   - `api.yml` - API-related configuration

#### Data Loading and Processing

The data files are loaded and processed in two different ways, depending on which part of the system uses them. This dual approach allows both the Flask backend and Next.js frontend to access the same data sources while using their native data loading mechanisms:

1. **Flask Application**:
   - The `get_site_data()` function in `kotlin-website.py` loads all YAML files from the `data/` directory
   - Files starting with `_` are excluded from the general loading process (these are typically configuration files used for specific purposes)
   - Each file is loaded into a dictionary with the filename (without extension) as the key
   - The loaded data is stored in the `site_data` variable, which is made available to the entire application
   - The data is also made available to Jinja2 templates through the context processor `add_data_to_context()`, which makes it accessible via the `data` variable in templates
   - Special handling is provided for the Standard Library redirects, which are loaded into `site_data["core"]`

2. **Next.js Components**:
   - Next.js components directly import data files using ES6 import syntax
   - For example: `import releasesDataRaw from '../data/releases.yml'`
   - This is possible because the Next.js configuration includes loaders for YAML files
   - The imported data can be used directly in React components as JavaScript objects
   - This approach allows for static site generation with the data embedded in the built pages

#### Data Usage Examples

The data files are used throughout the website for various purposes:

1. **Flask Routes**:
   - The `/education/` route uses university data to display the number of universities and countries
   - The `/data/universities.json` endpoint serves university data as JSON
   - The `/data/cities.json` endpoint serves city data as JSON
   - The `/data/kotlinconf.json` endpoint serves KotlinConf data as JSON

2. **Jinja2 Templates**:
   - Templates access data through the `data` variable in the template context
   - For example, `base.html` uses `data.releases.latest.url` to set the product URL in the header
   - Navigation templates use data to build the site navigation structure

3. **Next.js Components**:
   - The homepage imports `releases.yml` to display the latest Kotlin version
   - The user groups page imports `user-groups.yml` to display Kotlin User Groups on a map
   - The 404 page imports `releases.yml` to provide links to the latest Kotlin version

#### Data Validation

Some data files have associated JSON Schema files in the `data/schemas/` directory that define the expected structure of the data. These schemas are used for validation in GitHub Actions workflows to ensure that the data files conform to the expected format.

For example, the `user-groups.yml` file has a corresponding schema in `data/schemas/user-groups.json` that defines the expected structure of user group entries.

#### Adding or Updating Data

To add or update data in the website:

1. **Identify the appropriate data file** based on the type of content you want to add or update
2. **Follow the existing structure** of the file to ensure consistency
3. **Validate your changes** against any associated JSON Schema if available
4. **Test your changes** locally to ensure they appear correctly on the website
5. **Submit a pull request** with your changes

For some data files, there are specific instructions in the README.md file for adding or updating content, such as the process for adding a Kotlin User Group or a community event.

#### Data Files in CI/CD

The data files are an integral part of the CI/CD pipeline:

1. **Validation Workflows**:
   - GitHub Actions workflows validate data files against their schemas
   - For example, the `validate-user-groups-data.yml` workflow validates the user-groups.yml file
   - The `validate-events-data.yml` workflow validates the events.yml file

2. **Build Process**:
   - The data files are included in the build process and deployed with the website
   - Some data files may be transformed or processed during the build
   - For example, YAML files may be converted to JSON for consumption by client-side JavaScript

### Redirect System

The Kotlin Website includes a comprehensive redirect system that handles URL redirects for deprecated or moved pages. This system is particularly important for maintaining backward compatibility with external links and bookmarks. It ensures that users and search engines can still find content that has been moved or reorganized, providing a seamless user experience and preserving SEO value.

#### Redirect Files Structure

Redirect files are stored in the `redirects/` directory at the project root. These files are organized by topic or section (e.g., `api.yml`, `stdlib-redirects.yml`) and are in YAML format. Each file contains mappings from source URLs (old paths) to target URLs (new paths):

```yaml
- from: /old/path.html
  to: /new/path.html
- from: /another/old/path.html
  to: /another/new/path.html
```

Each entry in a redirect file contains:
- `from`: The source URL path that should be redirected
- `to`: The target URL path where the user should be redirected to

The `from` field can also be a list of URLs, all of which will redirect to the same target:

```yaml
- from: 
  - /old/path1.html
  - /old/path2.html
  to: /new/path.html
```

#### Redirect Processing

The redirect system works through several components that work together to handle redirects efficiently:

1. **Redirect Loading**:
   - The `generate_redirect_pages()` function in `kotlin-website.py` loads all YAML files from the `redirects/` directory
   - Each file is parsed to extract the redirect mappings using the YAML parser
   - The function is called during application initialization to ensure all redirects are available when the server starts

2. **URL Rule Creation**:
   - For each redirect mapping, a Flask URL rule is created using `app.add_url_rule()`
   - The rule maps the source URL to a `RedirectTemplateView` class that renders the redirect.html template
   - This approach allows for dynamic creation of routes without hardcoding each redirect
   - Special handling is provided for API redirects to avoid conflicts with existing files

3. **Redirect Rendering**:
   - When a user accesses a redirected URL, the `RedirectTemplateView` renders the `redirect.html` template
   - The template includes three fallback mechanisms for maximum compatibility:
     - A JavaScript redirect that preserves hash fragments (for modern browsers)
     - A meta refresh tag for browsers with JavaScript disabled
     - A fallback meta refresh with a 1-second delay as a last resort
   - This multi-layered approach ensures redirects work across all browsers and client configurations

4. **Standard Library Redirects**:
   - The `stdlib-redirects.yml` file contains thousands of redirects for the Kotlin Standard Library API
   - These redirects ensure that links to older API documentation versions still work
   - The redirects are loaded into the `site_data["core"]` variable for use in templates
   - This special handling allows for efficient lookup of API redirects without creating thousands of individual routes

#### Redirect Generation

For some parts of the website, redirects are generated automatically rather than being manually defined:

1. **Standard Library Redirects**:
   - The `scripts/stdlib/generate-redirects.js` script generates redirects for the Standard Library API
   - It uses the `redirect-collector.js` module to collect and process redirects from the API documentation
   - The script analyzes the structure of the API documentation to create mappings from old URL patterns to new ones
   - The generated redirects are written to `redirects/stdlib-redirects.yml`
   - This automated approach ensures that all

#### Redirect Tracking

The build process includes tracking and reporting of redirects:

1. **Redirect Reports**:
   - The `scripts/dist/analyzer/reports/write.ts` script generates a report of all redirect files
   - The report is saved as `files-redirects.txt` in the `reports/` directory

2. **File Type Statistics**:
   - Redirects are counted as a separate file type in the `file-types.csv` report
   - This helps track the number of redirects in the website

#### Usage in Development

When developing the website, you may need to add or modify redirects:

1. **Adding a New Redirect**:
   - Identify the appropriate redirect file or create a new one
   - Add an entry with the `from` and `to` URLs
   - Ensure the paths start with a forward slash (`/`)

2. **Testing Redirects**:
   - Start the development server
   - Access the source URL to verify that it redirects correctly
   - Check that hash fragments are preserved in the redirect

3. **Debugging Redirects**:
   - If a redirect isn't working, check that the URL rule was created correctly
   - Verify that the redirect file was loaded and parsed correctly
   - Check for conflicting routes or URL patterns