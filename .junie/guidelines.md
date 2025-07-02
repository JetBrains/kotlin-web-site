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

### Development Build

To start the development server:

```bash
yarn start
```

This will start a webpack dev server that serves the website on http://localhost:9000.

For Next.js development:

```bash
yarn next-dev
```

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
- `test/component/` - Component tests
- `test/snapshots/` - Visual regression test snapshots

### Running Tests

Before running tests, ensure the development server is running on http://localhost:9000:

```bash
yarn start
```

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

1. Create a new test file in the appropriate directory (e.g., `test/e2e/`)
2. Use the Playwright test framework
3. Follow the page object model pattern for complex pages
4. Use descriptive test names and organize tests in describe blocks

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
    
    // Check if the main content is visible
    const mainContent = await page.locator('main');
    await expect(mainContent).toBeVisible();
    
    // Log a debug message
    console.log('[DEBUG_LOG] Homepage test completed successfully');
  });
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
   - Key directories: `blocks/` (reusable block components), `components/` (UI components), `pages/` (Next.js pages)
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
   - Located in `pages/` directory
   - Styled with CSS Modules
   - Key pages: Home page (`/`), Community section (`/community/`), 404 error page
   - Asset management: CSS Modules, Global CSS, React components, Static assets
   - Build process: `next dev` for development, `next build && next export` for production

2. **Flask-based Pages**:
   - Traditional server-rendered pages built with Flask and Jinja2
   - Located in `templates/` directory
   - Processed by the Flask application in `kotlin-website.py`
   - Key pages: Documentation (`/docs/`), API Reference (`/api/`), Education section (`/education/`)
   - Asset management: Webpack-bundled JavaScript, SCSS styles, Jinja2 templates
   - Build process: Flask development server for development, Flask-Frozen for production

3. **Integration Between Approaches**:
   - Webpack dev server proxies requests to both Next.js and Flask servers
   - Both Next.js and Flask Freeze generate static HTML files for production
   - Flask application configures routes to serve Next.js-generated content

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