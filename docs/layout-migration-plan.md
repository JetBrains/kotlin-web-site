# Layout Migration Plan

This document outlines the plan for migrating pages to the new unified layout architecture. The migration will be done in phases, starting with the simplest pages and moving to more complex ones.

## Migration Priority Order

### Phase 1: Core Pages
1. **Main Layout Pages**
   - Homepage (`/pages/page-metadata.tsx`)
   - 404 Page (`/pages/404.tsx`)

   These pages currently use the simplest layout (`Layout` from `/components/layout/page-metadata.tsx`) and will be the easiest to migrate to the new system.

### Phase 2: Education Section
1. **Education Overview Page**
   - Education Index (`/pages/education/page-metadata.tsx`)

2. **Education Content Pages**
   - Why Teach Kotlin (`/pages/education/why-teach-kotlin.tsx`)
   - Courses (`/pages/education/courses.tsx`)

   The education section uses a consistent layout across all pages, making it a good candidate for early migration.

### Phase 3: Community Section
1. **Community Overview Page**
   - Community Index (`/pages/community/page-metadata.tsx`)

2. **Community Content Pages**
   - User Groups (`/pages/community/user-groups/page-metadata.tsx`)
   - Events (`/pages/community/events/page-metadata.tsx`)

   The community section has more complex navigation and interactive elements, so it will be migrated after the education section.

## Migration Approach for Each Page

### Step 1: Create a New Layout Implementation
For each page, we'll create a new implementation using the new layout components while keeping the existing implementation:

```tsx
// Example: Migrating the homepage
import { SectionLayout } from '../components/layout/section-layout/section-layout';

// ... existing imports and code

export default function HomePage() {
  // Use the new layout system
  return (
    <SectionLayout
      title="Kotlin Programming Language"
      description="Kotlin is a modern programming language that makes developers happier."
      section="main"
      // ... other props
    >
      {/* Existing page content */}
    </SectionLayout>
  );
}
```

### Step 2: Test the New Implementation
- Verify that the page renders correctly with the new layout
- Check that all functionality works as expected
- Ensure responsive behavior across different screen sizes
- Validate SEO metadata

### Step 3: Switch to the New Implementation
Once testing is complete, update the page to use only the new layout implementation:

```tsx
// Example: Final homepage implementation
import { SectionLayout } from '../components/layout/section-layout/section-layout';

// ... other imports

export default function HomePage() {
  return (
    <SectionLayout
      title="Kotlin Programming Language"
      description="Kotlin is a modern programming language that makes developers happier."
      section="main"
      // ... other props
    >
      {/* Page content */}
    </SectionLayout>
  );
}
```

### Step 4: Remove the Old Layout Component
After all pages have been migrated, remove the old layout components:
- `/components/layout/page-metadata.tsx`
- `/blocks/education/layout/page-metadata.tsx`
- `/blocks/community/layout/community-page-metadata.tsx`

## Rollback Plan

If issues are encountered during migration, we can easily roll back to the previous implementation:

1. Revert the changes to the page component
2. Keep the new layout components in place for future migration attempts
3. Document the issues encountered for future resolution

## Timeline

- **Phase 1 (Core Pages)**: 1-2 days
- **Phase 2 (Education Section)**: 2-3 days
- **Phase 3 (Community Section)**: 2-3 days
- **Testing and Validation**: 1-2 days
- **Cleanup**: 1 day

Total estimated time: 7-11 days