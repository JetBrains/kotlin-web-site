# CLAUDE.md - AI Assistant Guidelines for Kotlin Website Project

This document provides guidelines for AI assistants (like Claude) working on the Kotlin website codebase.

## Project Overview

This is the source repository for [kotlinlang.org](https://kotlinlang.org), the official Kotlin programming language website. The project includes:

- Documentation for Kotlin language
- Marketing pages (multiplatform, server-side, case studies, community)
- API reference documentation
- Community resources (events, user groups)

## Technology Stack

- **Frontend**: Next.js with React components
- **Build Tools**: Yarn, Webpack
- **Testing**: Playwright for e2e and screenshot tests
- **Styling**: CSS/SCSS with Next.js optimization

## Project Structure

```
kotlin-web-site/
├── pages/              # Next.js pages (multiplatform, server-side, case studies, community)
├── docs/               # Kotlin documentation (topics, kr.tree navigation, v.list variables)
├── templates/          # Jinja2 templates for page generation
├── data/               # Configuration files (events.yml, user-groups.yml, case-studies.yml)
├── public/             # Static assets (images, fonts)
├── components/         # React components
├── blocks/             # Complex UI sections composed of components
├── scripts/            # Build and utility scripts
├── test/e2e/           # Playwright e2e tests
└── dist/               # Build output (not in repo)
```

## Important Configuration Files

- `docs/kr.tree` - Navigation and structure for documentation
- `docs/v.list` - Variables including release versions
- `data/releases.yml` - Release information for other pages
- `data/events.yml` - Community events
- `data/user-groups.yml` - Kotlin User Groups
- `data/case-studies/case-studies.yml` - Case study configurations

## Development Workflow

### Local Setup

1. **Install frontend dependencies**:
   ```bash
   yarn install
   ```

2. **Build static files** (first time only):
   ```bash
   yarn run next-build-static
   ```

3. **Run Next.js dev server**:
   ```bash
   yarn run next-dev
   ```

4. **Run webpack dev server** (for other pages):
   ```bash
   yarn start
   ```

5. **Access local site**: http://localhost:9000

### Environment Variables

For frontend development, you need to set up WebTeam registry access:
- Generate a personal token from [WebTeam Registry](https://jetbrains.team/p/wt/packages/npm/npm)
- Add to `~/.zshenv`: `export WEBTEAM_UI_NPM_TOKEN=yourtoken`

## Testing

### Running Tests

- `yarn test` - All tests in headless mode
- `yarn test:e2e` - E2E tests including visual tests
- `yarn test:e2e:skip-visual` - E2E tests without visual tests
- `yarn test:production` - Production-focused tests
- `yarn test:e2e:headed` - Tests in headed mode (with browser UI)
- `yarn test:e2e:debug` - Tests with debugging
- `yarn test:e2e:new` - Generate tests for user interactions
- `yarn test:e2e:update` - Update screenshots after intentional changes

### Test Prerequisites

1. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

2. Start dev server before running tests

### WebHelp Tests

For documentation component tests:
1. Create `dist/` folder
2. Download artifacts from [Reference Docs CI](https://buildserver.labs.intellij.net/buildConfiguration/Kotlin_KotlinSites_KotlinlangTeamcityDsl_BuildReferenceDocs)
3. Place in `dist/` folder
4. Run tests: `yarn run test:e2e`

## Content Guidelines

### Documentation

- Follow [Kotlin documentation style guide](https://docs.google.com/document/d/1mUuxK4xwzs3jtDGoJ5_zwYLaSEl13g_SuhODdFuh2Dc/edit?usp=sharing)
- Use Markdown for documentation content

## Adding Content

### Kotlin User Groups

Edit `data/user-groups.yml` with:
- `name` - Group name
- `country` - Country (or "International" for virtual)
- `url` - Group webpage
- `isVirtual` - `true` for online-only groups
- `position` - `lat` and `lng` coordinates (for non-virtual groups)

Validated by: `.github/workflows/validate-user-groups-data.yml`
Schema: `data/schemas/user-groups.json`

### Community Events

Edit `data/events.yml` with:
- `lang` - ISO 639-1 two-letter code
- `startDate` / `endDate` - Format: 'yyyy-mm-dd'
- `location` - 'City, Country' (omit for online)
- `online` - `true` for online events
- `speaker` - Speaker name
- `title` - Event title
- `subject` - Talk title
- `url` - Event webpage

Validated by: `.github/workflows/validate-events-data.yml`
Schema: `data/schemas/events.json`

### Case Studies

Edit `data/case-studies/case-studies.yml` with:
- `id` - Unique identifier
- `type` - Either `multiplatform` or `server-side`
- `description` - Markdown text (supports headers, bold, links)
- `logo` - Array of 0-2 image paths (relative to `/public/`)
- `signature` - Object with `name` and `position` for quote author
- `isExternal` - Boolean for external sources
- `link` - URL to full case story
- `linkText` - Custom link text
- `linkStyle` - Either `button` or `text`
- `platforms` - Array: `android`, `ios`, `desktop`, `frontend`, `backend`, `compose-multiplatform`
- `media` - Object with `type` (`youtube` or `image`)
- `featuredOnMainPage` - Boolean for main page feature

Validated by: `.github/workflows/validate-case-studies-data.yml`
Schema: `data/schemas/case-studies.json`
Example: `data/case-studies/_case-study.example.yaml`

## Important Notes for AI Assistants

### Images in Next.js

- Prefer using `Img` and `Svg` components from "next-optimized-images" for better optimization
- `next/image` can be used but may have SSG limitations

### External Content

Some documentation is stored in separate repositories:
- Kotlin Multiplatform docs → [kotlin-multiplatform-dev-docs](https://github.com/JetBrains/kotlin-multiplatform-dev-docs)
- Coroutines docs → [kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines/)
- Lincheck docs → [kotlinx.lincheck](https://github.com/Kotlin/kotlinx-lincheck/)
- Dokka docs → [dokka](https://github.com/Kotlin/dokka/)
- API guidelines → [api-guidelines](https://github.com/Kotlin/api-guidelines)
- Language spec → [kotlin-spec](https://github.com/Kotlin/kotlin-spec)

### Auto-generated Content

- API reference → Generated from Kotlin code comments
- Grammar reference → Generated from [kotlin-spec grammar](https://github.com/Kotlin/kotlin-spec/tree/release/grammar/src/main/antlr)

### Git Workflow

- Main branch: `master`
- Create pull requests for contributions
- CI validates configuration changes (events, user groups, case studies)

### PDF Generation

To generate PDF documentation:
1. Download artifacts from [Reference Docs CI](https://buildserver.labs.intellij.net/buildConfiguration/Kotlin_KotlinSites_KotlinlangTeamcityDsl_BuildReferenceDocs)
2. Place in `dist/` folder
3. Run:
   ```bash
   yarn install
   yarn generate-pdf
   ```
4. Output: `assets/kotlin-reference.pdf`

See: `scripts/pdf/README.md`

## Common Tasks

### Modifying Navigation

Edit `docs/kr.tree` for documentation structure changes.

### Updating Kotlin Version

Edit `docs/v.list` and `data/releases.yml` to update version numbers across the site.

### Adding New Pages

1. Create page in appropriate directory (`pages/` for Next.js routes)
2. Use existing components from `components/` and `blocks/`
3. Follow established patterns for similar pages
4. Add tests in `test/e2e/`

### Making Style Changes

- Use existing CSS/SCSS patterns
- Test responsiveness across breakpoints
- Run screenshot tests to verify: `yarn test:e2e:screenshots`
- Update screenshots if intentional: `yarn test:e2e:update`

## Feedback and Issues

- Report issues: [YouTrack KT project](https://youtrack.jetbrains.com/newIssue?project=KT)
- Discuss in Slack: [#kotlin-website](https://kotlinlang.slack.com/archives/C02B3PECK6E)
- Get Slack invite: https://surveys.jetbrains.com/s3/kotlin-slack-sign-up

## Known Limitations

- No full local deployment available yet (tracked: [KT-47049](https://youtrack.jetbrains.com/issue/KT-47049))
- Some tests require downloaded artifacts from CI builds

## Security and Code of Conduct

- Security policy: See [SECURITY.md](SECURITY.md)
- Code of conduct: See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
