# Education Section Tests

This directory contains end-to-end tests for the education section of the Kotlin website. These tests use Playwright to verify both the functionality and visual appearance of the education pages.

## Test Files

- `education.spec.ts`: Tests for the main education page (`/education/`)
- `why.spec.ts`: Tests for the "Why Teach Kotlin" page (`/education/why-teach-kotlin.html`)
- `courses.spec.ts`: Tests for the courses page (`/education/courses.html`)

## Page Objects

The tests use page objects to encapsulate page-specific logic:

- `test/page/education.ts`: Page object for the main education page
- `test/page/why-page.ts`: Page object for the "Why Teach Kotlin" page
- `test/page/courses-page.ts`: Page object for the courses page

## Test Types

Each test file includes several types of tests:

1. **Functional Tests**: Verify that the page loads correctly, that navigation elements work, and that interactive components function as expected.

2. **Visual Regression Tests**: Take screenshots of various components and compare them with baseline screenshots to detect visual changes. These tests are run for different screen sizes (desktop, tablet, mobile).

3. **Interactive Tests**: Verify that interactive elements like tooltips and navigation menus work correctly.

## Running the Tests

Before running the tests, make sure the development server is running:

```bash
yarn start
```

To run all education tests with a headed browser:

```bash
yarn test:education
```

To run all e2e tests:

```bash
yarn test:e2e
```

To run e2e tests with a headed browser:

```bash
yarn test:e2e:headed
```

To run e2e tests in debug mode:

```bash
yarn test:e2e:debug
```

To update the snapshots for e2e tests:

```bash
yarn test:e2e:update
```

## Test Coverage

The tests cover the following aspects of the education section:

### Main Education Page (`/education/`)

- Page loading
- Navigation buttons
- University statistics display
- Interactive map
- University logos display
- Resource links
- YouTube player
- Subscription form
- Visual appearance of all sections
- Map tooltip interaction

### Why Teach Kotlin Page (`/education/why-teach-kotlin.html`)

- Page loading
- Navigation menu
- Section navigation
- Quotes slider display
- External links
- Visual appearance of all sections
- Navigation menu highlighting
- Quotes slider hover behavior

### Courses Page (`/education/courses.html`)

- Page loading
- Tab navigation
- University list display in table view
- Map display in map view
- Visual appearance of all sections
- Map tooltip interaction

## Adding New Tests

To add new tests for the education section:

1. Create a new test file in the `test/e2e` directory
2. Create a new page object in the `test/page` directory if needed
3. Follow the patterns in the existing test files
4. Run the tests to verify that they work correctly
5. Update the snapshots if necessary