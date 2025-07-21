# Kotlin Website Layout Architecture

## Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        PageMetadata                           │
│                                                             │
│  - Common Head metadata handling                            │
│  - SEO tags (title, description, Open Graph, Twitter)       │
│  - Theme context provider                                   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ extends
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        PageLayout                           │
│                                                             │
│  - Global header                                            │
│  - Content area                                             │
│  - Global footer                                            │
│  - Sticky header support                                    │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ extends
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      SectionLayout                          │
│                                                             │
│  - Section-specific navigation                              │
│  - Section-specific CTA blocks                              │
│  - Section-specific styling                                 │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy and Composition Strategy

### PageMetadata

The `PageMetadata` component serves as the foundation for all layouts in the Kotlin website. It handles common functionality that every page needs:

- **Responsibilities**:
  - Managing document head metadata (title, description)
  - Setting up SEO tags (Open Graph, Twitter)
  - Providing theme context
  - Basic page structure

- **Props Interface**:
  ```typescript
  interface PageMetadataProps {
    title: string;
    description?: string;
    ogImage?: string | ImgSrc;
    ogImageName?: string;
    children: React.ReactNode;
    theme?: 'light' | 'dark';
  }
  ```

### PageLayout

The `PageLayout` component extends `PageMetadata` and adds the standard page structure with header and footer:

- **Responsibilities**:
  - Including global header
  - Providing content area
  - Including global footer
  - Supporting sticky header functionality

- **Props Interface**:
  ```typescript
  interface PageLayoutProps extends PageMetadataProps {
    showHeader?: boolean;
    showFooter?: boolean;
    hasSticky?: boolean;
  }
  ```

### SectionLayout

The `SectionLayout` component extends `PageLayout` and adds section-specific functionality:

- **Responsibilities**:
  - Providing section-specific navigation
  - Including section-specific CTA blocks
  - Applying section-specific styling

- **Props Interface**:
  ```typescript
  interface SectionLayoutProps extends PageLayoutProps {
    section: 'main' | 'education' | 'community';
    items?: NavigationItem[];
    ctaBlock?: {
      title: string;
      subtitle?: string;
      buttonText: string;
      buttonLink: string;
    };
  }
  ```

## Usage Examples

### Basic Page

```tsx
<PageMetadata title="Page Title" description="Page description">
  <main>Page content</main>
</PageMetadata>
```

### Standard Page with Header and Footer

```tsx
<PageLayout 
  title="Page Title" 
  description="Page description"
  showHeader={true}
  showFooter={true}
>
  <main>Page content</main>
</PageLayout>
```

### Section-Specific Page

```tsx
<SectionLayout
  title="Education Overview"
  description="Learn about Kotlin education resources"
  section="education"
  items={EDUCATION_NAV_ITEMS}
  ctaBlock={{
    title: "Help us improve",
    subtitle: "Give us your feedback about teaching Kotlin",
    buttonText: "Write to us",
    buttonLink: "mailto:education@kotlinlang.org"
  }}
>
  <EducationContent />
</SectionLayout>
```

## Naming Conventions

- **Component Names**: PascalCase, descriptive of the component's purpose
  - `PageMetadata`
  - `PageLayout`
  - `SectionLayout`

- **Props Interfaces**: PascalCase with "Props" suffix
  - `PageMetadataProps`
  - `PageLayoutProps`
  - `SectionLayoutProps`

- **CSS Module Files**: kebab-case matching the component name
  - `base-layout.module.css`
  - `page-layout.module.css`
  - `section-layout.module.css`

- **Utility Functions**: camelCase, descriptive of the function's purpose
  - `addTrailingSlash`
  - `generateMetaTags`
  - `createSectionConfig`

## Directory Structure

```
/components
  /layout
    /base-layout
      base-page-metadata.tsx
      base-layout.module.css
    /page-layout
      page-page-metadata.tsx
      page-layout.module.css
    /section-layout
      section-page-metadata.tsx
      section-layout.module.css
    /utils
      url-utils.ts
      meta-utils.ts
    /types
      layout-types.ts
    /context
      theme-context.tsx
```

This architecture provides a clear hierarchy of layout components with proper separation of concerns, allowing for consistent user experience across the website while enabling section-specific customization where needed.