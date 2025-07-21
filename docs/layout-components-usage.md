# Layout Components Usage Guide

This document provides guidelines and examples for using the new unified layout components in the Kotlin website project.

## Overview

The Kotlin website uses a hierarchical layout system with three main components:

1. **PageMetadata**: The foundation component that handles metadata and basic page structure
2. **PageLayout**: Extends PageMetadata and adds header and footer
3. **SectionLayout**: Extends PageLayout and adds section-specific navigation and styling

This architecture eliminates duplication, improves maintainability, and ensures a consistent user experience across the website.

## Component Hierarchy

```
PageMetadata → PageLayout → SectionLayout
```

Each component builds on the previous one, adding more functionality while maintaining a consistent interface.

## PageMetadata

The `PageMetadata` component is the foundation for all layouts. It handles common functionality that every page needs:

- Managing document head metadata (title, description)
- Setting up SEO tags (Open Graph, Twitter)
- Providing theme context
- Basic page structure

### Props

```typescript
interface PageMetadataProps {
    title: string;              // Page title
    description?: string;       // Page description
    ogImage?: ImgSrc;           // Open Graph image
    ogImageName?: string;       // Open Graph image name
    theme?: 'light' | 'dark';   // Theme
    children: React.ReactNode;  // Child components
}
```

### Usage Example

```tsx
import { PageMetadata } from '../components/layout/base-layout/base-layout';

export default function SimplePage() {
    return (
        <PageMetadata
            title="Simple Page"
            description="A simple page using PageMetadata"
            theme="light"
        >
            <main>
                <h1>Simple Page</h1>
                <p>This page uses the PageMetadata component.</p>
            </main>
        </PageMetadata>
    );
}
```

## PageLayout

The `PageLayout` component extends `PageMetadata` and adds the standard page structure with header and footer:

- Including global header
- Providing content area
- Including global footer
- Supporting sticky header functionality

### Props

```typescript
interface PageLayoutProps extends PageMetadataProps {
    showHeader?: boolean;       // Whether to show the header
    showFooter?: boolean;       // Whether to show the footer
    hasSticky?: boolean;     // Whether to enable sticky header
}
```

### Usage Example

```tsx
import { PageLayout } from '../components/layout/page-layout/page-layout';

export default function StandardPage() {
    return (
        <PageLayout
            title="Standard Page"
            description="A standard page using PageLayout"
            theme="light"
            showHeader={true}
            showFooter={true}
            hasSticky={true}
        >
            <main>
                <h1>Standard Page</h1>
                <p>This page uses the PageLayout component with header and footer.</p>
            </main>
        </PageLayout>
    );
}
```

## SectionLayout

The `SectionLayout` component extends `PageLayout` and adds section-specific functionality:

- Providing section-specific navigation
- Including section-specific CTA blocks
- Applying section-specific styling

### Props

```typescript
interface SectionLayoutProps extends PageLayoutProps {
    section: 'main' | 'education' | 'community';  // Section identifier
    sectionTitle?: string;                        // Section title
    sectionUrl?: string;                          // Section URL
    items?: NavigationItem[];           // Navigation items
    ctaBlock?: CtaBlockConfig;                    // CTA block config
    topMenuExtra?: React.ReactNode;               // Extra content for top menu
}
```

### Usage Example

```tsx
import { SectionLayout } from '../components/layout/section-layout/section-layout';
import { NavigationItem } from '../components/layout/types/layout-types';

// Define navigation items
const EDUCATION_NAV_ITEMS: NavigationItem[] = [
    {
        url: '/education/',
        title: 'Overview'
    },
    {
        url: '/education/why-teach-kotlin/',
        title: 'Why Teach Kotlin'
    },
    {
        url: '/education/courses/',
        title: 'List of Courses'
    }
];

// Define CTA block configuration
const EDUCATION_CTA = {
    topTitle: 'Help us improve',
    mainTitle: (
        <>
            Give us your feedback or ask any questions
            <br />
            you have about teaching Kotlin
        </>
    ),
    buttonText: 'Write to us',
    buttonLink: 'mailto:education@kotlinlang.org'
};

export default function EducationPage() {
    return (
        <SectionLayout
            title="Kotlin for Education"
            description="Learn about teaching Kotlin in educational settings"
            section="education"
            theme="light"
            showHeader={true}
            showFooter={true}
            hasSticky={true}
            sectionTitle="Teach"
            sectionUrl="/education/"
            items={EDUCATION_NAV_ITEMS}
            ctaBlock={EDUCATION_CTA}
        >
            <main>
                <h1>Kotlin for Education</h1>
                <p>This page uses the SectionLayout component with education-specific navigation and CTA block.</p>
            </main>
        </SectionLayout>
    );
}
```

## Migrating from Legacy Layouts

If you're updating a page that uses one of the legacy layout components, follow these steps:

### From Legacy Layout to SectionLayout

```tsx
// Before
import { Layout } from '../components/layout/layout';

export default function HomePage() {
    return (
        <Layout
            title="Kotlin Programming Language"
            description="Kotlin is a modern programming language"
        >
            <main>Page content</main>
        </Layout>
    );
}

// After
import { SectionLayout } from '../components/layout/section-layout/section-layout';

export default function HomePage() {
    return (
        <SectionLayout
            title="Kotlin Programming Language"
            description="Kotlin is a modern programming language"
            section="main"
            theme="dark"
            showHeader={true}
            showFooter={true}
            hasSticky={true}
        >
            <main>Page content</main>
        </SectionLayout>
    );
}
```

### From Education Layout to SectionLayout

```tsx
// Before
import { Index } from '../../blocks/education/layout';

export default function EducationPage() {
    return (
        <Index
            title="Kotlin for Education"
            description="Learn about teaching Kotlin"
        >
            <main>Page content</main>
        </Index>
    );
}

// After
import { SectionLayout } from '../../components/layout/section-layout/section-layout';
import { Button } from '@rescui/button';
import { SlackIcon } from '@rescui/icons';

export default function EducationPage() {
    // Create the Join Educators button for the top menu
    const topMenuExtra = (
        <Button
            icon={<SlackIcon />}
            href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators"
            target="_blank"
            rel="noopener noreferrer"
        >
            Join Educators
        </Button>
    );

    // Create the CTA block configuration
    const ctaBlock = {
        topTitle: 'Help us improve',
        mainTitle: (
            <>
                Give us your feedback or ask any questions
                <br />
                you have about teaching Kotlin
            </>
        ),
        buttonText: 'Write to us',
        buttonLink: 'mailto:education@kotlinlang.org'
    };

    return (
        <SectionLayout
            title="Kotlin for Education"
            description="Learn about teaching Kotlin"
            section="education"
            theme="light"
            showHeader={true}
            showFooter={true}
            hasSticky={true}
            sectionTitle="Teach"
            sectionUrl="/education/"
            items={EDUCATION_NAV_ITEMS}
            ctaBlock={ctaBlock}
            topMenuExtra={topMenuExtra}
        >
            <main>Page content</main>
        </SectionLayout>
    );
}
```

### From Community Layout to SectionLayout

```tsx
// Before
import { CommunityLayout } from '../../blocks/community/layout/community-layout';

export default function CommunityPage() {
    return (
        <CommunityLayout
            title="Kotlin Community"
            description="Join the Kotlin community"
        >
            <main>Page content</main>
        </CommunityLayout>
    );
}

// After
import { SectionLayout } from '../../components/layout/section-layout/section-layout';

export default function CommunityPage() {
    // Create the CTA block configuration
    const ctaBlock = {
        topTitle: 'Help us improve',
        mainTitle: (
            <>
                Give us your feedback or ask any questions
                <br />
                you have about the Kotlin community
            </>
        ),
        buttonText: 'Write to us',
        buttonLink: 'mailto:kug@jetbrains.com'
    };

    return (
        <SectionLayout
            title="Kotlin Community"
            description="Join the Kotlin community"
            section="community"
            theme="dark"
            showHeader={true}
            showFooter={true}
            hasSticky={true}
            sectionTitle="Community"
            sectionUrl="/community/"
            items={COMMUNITY_NAV_ITEMS}
            ctaBlock={ctaBlock}
        >
            <main>Page content</main>
        </SectionLayout>
    );
}
```

## Best Practices

1. **Use the most specific layout component** that meets your needs:
   - Use `PageMetadata` for simple pages without header or footer
   - Use `PageLayout` for standard pages with header and footer
   - Use `SectionLayout` for pages that belong to a specific section

2. **Reuse navigation items and CTA blocks** across pages in the same section:
   - Define section-specific constants in a shared file
   - Import and use these constants in your pages

3. **Provide meaningful titles and descriptions** for SEO:
   - Titles should be concise and descriptive
   - Descriptions should summarize the page content in 1-2 sentences

4. **Use the appropriate theme** for your page:
   - Use `theme="dark"` for the main section and community section
   - Use `theme="light"` for the education section

5. **Test your pages** after migrating to the new layout system:
   - Verify that all content is displayed correctly
   - Check that navigation works as expected
   - Ensure that the page looks good on different screen sizes