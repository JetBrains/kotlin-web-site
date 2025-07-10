# Education Pages Migration Tasks

This document outlines the tasks required to migrate the `/education/` pages from Flask with React to NextJS.

## Migration Tasks

1. [ ] Create directory structure for education pages in NextJS
   - [ ] Create `/pages/education/index.tsx` for the main education page
   - [ ] Create `/pages/education/why-teach-kotlin.tsx` for the Why Teach Kotlin page
   - [ ] Create `/pages/education/courses.tsx` for the Courses page
   - [ ] Create `/blocks/education/` directory for education-specific components

2. [ ] Create layout component for education pages
   - [ ] Create `/blocks/education/layout/education-layout.tsx` based on the community layout
   - [ ] Create `/blocks/education/layout/education-layout.module.css` for layout styles
   - [ ] Define education-specific navigation menu items
   - [ ] Set up SEO metadata and Open Graph tags

3. [ ] Migrate React components from Flask to NextJS
   - [ ] Create `/blocks/education/teach/teach.tsx` based on the current teach component
   - [ ] Create `/blocks/education/why-teach/why-teach.tsx` based on the current why-teach component
   - [ ] Create `/blocks/education/courses/courses.tsx` based on the current courses component
   - [ ] Migrate sub-components to appropriate directories in `/blocks/education/`

4. [ ] Convert SCSS to CSS Modules
   - [ ] Convert `/static/js/ktl-component/teach/style.scss` to `/blocks/education/teach/teach.module.css`
   - [ ] Convert component-specific SCSS files to CSS Modules
   - [ ] Update class references in components to use CSS Modules syntax
   - [ ] Handle nested SCSS selectors and variables

5. [ ] Update data loading mechanism
   - [ ] Import universities data directly from YAML in NextJS components
   - [ ] Implement functions to process universities data (count countries, format courses)
   - [ ] Use NextJS data fetching methods (getStaticProps) where appropriate
   - [ ] Ensure data is properly typed with TypeScript interfaces

6. [ ] Update navigation and links
   - [ ] Update internal links to use NextJS Link component
   - [ ] Ensure navigation menu highlights the correct active page
   - [ ] Update any hardcoded URLs to use relative paths

7. [ ] Update Flask routes to serve NextJS pages
   - [ ] Modify `/education/` route in Flask to serve the NextJS page
   - [ ] Modify `/education/why-teach-kotlin.html` route in Flask to serve the NextJS page
   - [ ] Modify `/education/courses.html` route in Flask to serve the NextJS page
   - [ ] Update any API endpoints needed by the education pages

8. [ ] Test the migrated pages
   - [ ] Run existing tests to ensure functionality is preserved
   - [ ] Manually test all pages and features
   - [ ] Test responsive design on different screen sizes
   - [ ] Test navigation between pages
   - [ ] Test external links

9. [ ] First review of the implementation
   - [ ] Check code quality and consistency
   - [ ] Ensure all components are properly typed with TypeScript
   - [ ] Verify that all features from the original pages are implemented
   - [ ] Check for any performance issues

10. [ ] Second review and improvements
    - [ ] Address any issues found in the first review
    - [ ] Optimize performance if needed
    - [ ] Improve code organization and documentation
    - [ ] Ensure accessibility standards are met

11. [ ] Final testing and documentation
    - [ ] Run all tests again to ensure everything works
    - [ ] Document any changes to the codebase
    - [ ] Update README or other documentation as needed
    - [ ] Create pull request with detailed description of changes

## Implementation Details

### Component Structure

The migrated education pages will follow this component structure:

```
pages/
  education/
    index.tsx             # Main education page
    why-teach-kotlin.tsx  # Why Teach Kotlin page
    courses.tsx           # Courses page

blocks/
  education/
    layout/               # Layout components
      education-layout.tsx
      education-layout.module.css
    teach/                # Main education page components
      teach.tsx
      teach.module.css
    why-teach/            # Why Teach Kotlin page components
      why-teach.tsx
      why-teach.module.css
    courses/              # Courses page components
      courses.tsx
      courses.module.css
    components/           # Shared components
      teach-top-menu/
      teach-map/
      teach-numbers/
      etc.
```

### Data Loading

Data will be loaded directly from YAML files in the NextJS components:

```typescript
// Example for the main education page
import universitiesDataRaw from '../../data/universities.yml';

// Process the data
const universitiesData = universitiesDataRaw as UniversitiesData;
const universitiesCount = universitiesData.length;
const countriesCount = getCountriesCount(universitiesData);

// Function to count unique countries
function getCountriesCount(universities: UniversitiesData): number {
  const countries = new Set<string>();
  universities.forEach(university => {
    const location = university.location;
    const country = location.split(',').pop()?.trim();
    if (country) {
      countries.add(country);
    }
  });
  return countries.size;
}
```

### CSS Modules Conversion

SCSS will be converted to CSS Modules following this pattern:

```scss
// Original SCSS
.teach-feature {
  &__icon {
    img {
      display: block;
    }
  }
}
```

```css
/* Converted CSS Module */
.featureIcon img {
  display: block;
}
```

```tsx
// Usage in component
import styles from './teach.module.css';

<div className={styles.featureIcon}>
  <img src="/path/to/image.svg" alt="Icon" />
</div>
```

### Flask Route Updates

The Flask routes in `kotlin-website.py` will need to be updated to serve the NextJS pages instead of rendering templates. This follows the pattern used for other NextJS pages in the project, such as the community pages.

For each education page route:

1. **Main Education Page (`/education/`)**:
   - Modify the existing route to serve the static HTML file generated by NextJS
   - The file will be located at `out/education/index.html` after the NextJS build

2. **Why Teach Kotlin Page (`/education/why-teach-kotlin.html`)**:
   - Modify the existing route to serve the static HTML file generated by NextJS
   - The file will be located at `out/education/why-teach-kotlin.html` after the NextJS build

3. **Courses Page (`/education/courses.html`)**:
   - Modify the existing route to serve the static HTML file generated by NextJS
   - The file will be located at `out/education/courses.html` after the NextJS build

The implementation should follow the pattern used for the community pages in `kotlin-website.py`, which use the `send_file` function to serve static HTML files from the `out/` directory.

Note: The NextJS build process will generate static HTML files in the `out/` directory, which is the case for the existing NextJS pages in the project.