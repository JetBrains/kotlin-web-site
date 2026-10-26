# What to use for what · kotlinlang.org

The component catalog of this project as an agent needs it while mapping a
mock instance to code: the installed design-system packages, the project's own
shared components, usage counts from the repository, the lint checklist and the
interaction references designers annotate. Existence and props come from
`artifacts/INDEX.md` and `artifacts/contracts.json` (extracted from this
repository's `node_modules` by `project-setup.mjs`); this file says which of
them the project actually uses and how. Inlined verbatim into every section
brief (Appendix B).

Counts are files importing the package under `pages blocks components shared
hooks utils`, read 8 Oct 2026 at `38512ffcb9`. Priority: **project component →
installed library → vendored asset**.

## Design-system packages

Versions from `artifacts/INDEX.md` (installed). Never write a prop from memory.

| package (version) | what it is used for here | files | example path |
|---|---|---|---|
| `@rescui/typography` 0.24.2 | `useTextStyles()` → `textCn('rs-*')`; `createTextCn('dark')` only in hook-less data files | 91 | `blocks/state-of-kotlin-2026/questions/questions.tsx`; `blocks/compose-multiplatform/hero/hero-data.tsx` |
| `@rescui/button` 0.18.0 | every CTA: `Button href mode="rock\|outline\|classic" size="l\|m\|s\|xs"`; mode rock 20 / outline 14 / classic 2, size l 29 / s 6 / m 4 / xs 2 | 46 | `blocks/state-of-kotlin-2026/hero/hero.tsx` |
| `@rescui/ui-contexts` 0.5.8 | `ThemeProvider theme` (island of the other theme), `Theme` type | 16 | `components/landing-layout/landing-layout.tsx` |
| `@rescui/icons` 1.7.1 | arrows, GitHub, info icons (351 exported) | 26 | `blocks/benchmark/cta/index.tsx` (`GitHubIcon`), `components/snap-carousel/snap-carousel.tsx` (`ArrowLeftIcon`) |
| `@rescui/tag` 0.11.3 | chips with `presets` | 6 | `blocks/compose-multiplatform/platforms-block/platform-item.tsx` |
| `@rescui/card` 0.8.3 | `cardCn({ paddings, isClickable })` class helper — not a component; most cards are plain divs | 4 | `blocks/community/keep-in-touch-card/keep-in-touch-card.tsx` |
| `@rescui/collapse` 0.7.1 | FAQ: `Accordion` > `Collapse title borderBottom` | 2 | `blocks/state-of-kotlin-2026/faq/faq.tsx` |
| `@rescui/switcher` 0.12.3 | segmented switch / section nav / filter | 3 | `blocks/state-of-kotlin-2026/section-nav/section-nav.tsx`, `blocks/case-studies/filter/case-studies-filter.tsx` |
| `@rescui/tab-list` 0.11.12 | tabs | 3 | `pages/index.tsx`, `pages/education/index.tsx` |
| `@jetbrains/kotlin-web-site-ui` 4.14.9 | the site kit; each part imported by its `out/components/<name>` path: `layout-v2` (column css, side-effect import), `breakpoints-v2` (`media.pcss`, hooks `useMS`/`useML`...: 21 files), `header` / `footer` / `top-menu` (only inside `LandingLayout`), `cta-block-v2` (3), `quotes-slider` (2), `youtube-player` (5 files), `typography`, `grid`, older `layout` / `breakpoints` | — | `blocks/community/layout/community-layout.tsx` (`CtaBlock`), `blocks/education/teach-quotes/teach-quotes.tsx` (`QuotesSlider`) |
| `@webteam/layout` 3.1.1 | installed, **not this project's grid** (one file) | 1 | — |
| `classnames` | class joining, imported as `cn` | 118 | any block |

Text roles used (count of `textCn('…')` calls): `rs-link` 91, `rs-text-2` 81,
`rs-h3` 43, `rs-text-1` 40, `rs-h1` 31, `rs-subtitle-2` 22, `rs-text-3` 18,
`rs-h2` 13, `rs-h4` 10, `rs-hero` 8, `rs-ul` 7, `rs-h5` 4, `rs-subtitle-1` 3,
`rs-middle-hero` 2, `rs-super-hero` 1 (`state-of-kotlin-2026` hero h1). Option in
use: `textCn('rs-text-1', { hardness: 'hard' })` (`questions.tsx`). The `ktl-*`
typography classes (`ktl-hero`, `ktl-text-*`) exist but are rare — the rescui
role wins when both could express a style.

Declared but unused in blocks: `@rescui/checkbox`, `dropdown`, `dropdown-menu`,
`input`, `radio-button`, `rate`, `select`, `textarea` (installed for the docs
side and as transitive deps in `next.config.js` `transpiledPackages`).

## Project-shared components

`components/` (one line each). A page extends one through optional props with
backward-compatible defaults, or extracts a new one when a second page needs a
pattern (`rules.md` R9); it never re-implements one locally:

| folder | what it exports | used by |
|---|---|---|
| `landing-layout/` | `LandingLayout` — header, SEO head, optional sticky top menu, footer, theme | every landing; emitted shell |
| `layout/` | `Layout` — older page shell (community) | `pages/index.tsx`, `pages/404.tsx` |
| `sticky-header/` | `StickyHeader` — sticky wrapper | `landing-layout.tsx`, `section-nav.tsx` |
| `marquee/` | `Marquee` (`pauseOnHover`, `hasFadingEdges`) — moving strip | `blocks/state-of-kotlin-2026/organizations/organizations.tsx` |
| `customer-logo-marquee/` | `CustomerLogoMarqueeSection` + logo lists (`multiplatform-logos.ts`, `server-side-logos.ts`) | `pages/backend/index.tsx`, `blocks/multiplatform/case-studies/customers.tsx` |
| `snap-carousel/` | `SnapCarousel` (react-snap-carousel, prev/next buttons, `n/N` counter; KTL-4742 added `navigationAlign` `center\|right`, `adaptiveHeight`, `fadeSlides` and SSR-safe `initialPages`) | `blocks/server-side/features-carousel/index.tsx`, `blocks/compose-multiplatform/quote-section/quote-section.tsx`† |
| `columned-faq/`† | `ColumnedFaq` (`items: { question, answer }[]`, `title`, `columnsCount` = 2) — `Accordion` + `Collapse` split into columns, stacked under `--ktl-ts-down`, FAQPage JSON-LD in `Head` | `blocks/compose-multiplatform/faq/faq.tsx`†, `blocks/multiplatform/faq-block/faq-block.tsx`† |
| `custom-carousel/` | `CustomCarousel` — image + caption slides | `blocks/compose-multiplatform/hero/index.tsx` |
| `masonry-grid/` | `MasonryGrid` (`items`, `columnCount`, `gap`, `renderItem`, `getKey`) | `blocks/case-studies/grid/case-studies-grid.tsx` |
| `code-block/` | `CodeBlock` — Kotlin Playground (client only, `ssr: false`) | `blocks/main/why-kotlin/why-kotlin.tsx` |
| `code-highlight/` | `CodeHighlight` (`code`, `language`) — static highlighted code | `blocks/server-side/how-to-start/how-to-start.tsx` |
| `social-share/` | `SocialShare` (networks `facebook twitter linkedin reddit email`, `theme`, `size`) | `blocks/state-of-kotlin-2026/hero/hero.tsx` |
| `desktop-break/` | `DesktopBreak` — line break visible on desktop | `pages/community/index.tsx` |
| `empty-state/`, `favicon/`, `hydration-event.tsx` | not for pages (`hydration-event` sets `html.hydrated`) | `_app.jsx` |

Also shared: `utils/mdToHtml.tsx` (`Markdown`), `utils/event-logger.ts`
(`trackEvent`), `blocks/<page>/shared/` for one page's own pieces
(`blocks/state-of-kotlin-2026/shared/`: `section-heading`, `stat-card`,
`quote-card`, `chart-figure`, `floating-shape`, `go-deeper-banner`).
Blocks are not imported across `blocks/<page>` folders; a pattern two pages
need moves into `components/` (`columned-faq`†, extracted from
`blocks/multiplatform/faq-block` for the Compose FAQ) instead of being copied.

† lands with KTL-4742 (branch `KTL-4742-fixes`, PR #5868).

## What to use for what

| mock shows | use | example path |
|---|---|---|
| hero (h1 + lead + CTA) | `section` > `h1` `rs-super-hero` + `p` `rs-subtitle-1` + `Button mode="rock" size="l"` (`useMS() ? 'm' : 'l'`) | `blocks/state-of-kotlin-2026/hero/hero.tsx` |
| section heading (+ lead) | `h2` `rs-h1` + `p` `rs-subtitle-2`; the page's `SectionHeading` is page-local — copy it, do not import across pages | `blocks/state-of-kotlin-2026/shared/section-heading/section-heading.tsx` |
| body, caption, small text | `rs-text-1` (`hardness: 'hard'`), `rs-text-2`, `rs-text-3` | `questions.tsx`; `rs-text-2` 81 uses |
| card grid | CSS grid in the module css, plain `div` cards, `grid-auto-rows: 1fr` | `blocks/state-of-kotlin-2026/questions/questions.module.css` |
| clickable/rescui card | `cardCn({ isClickable })` + module css | `blocks/community/keep-in-touch-card/keep-in-touch-card.tsx` |
| big number / stat | `p` + `rs-hero` | `blocks/state-of-kotlin-2026/shared/stat-card/stat-card.tsx` |
| FAQ / accordion | in columns: `ColumnedFaq`†; one column: `Accordion` + `Collapse` (`borderBottom`), answers via `Markdown`; FAQPage JSON-LD in `Head` when copy is real FAQ; answers from the FAQ doc the ticket links (R13) | `blocks/compose-multiplatform/faq/faq.tsx`†; `blocks/state-of-kotlin-2026/faq/faq.tsx` |
| logo strip | static: `<img>` row; moving: `Marquee`; shipped lists: `CustomerLogoMarqueeSection` | `blocks/state-of-kotlin-2026/organizations/organizations.tsx`; `components/customer-logo-marquee/index.tsx` |
| carousel | `SnapCarousel` (mobile swipe, quote gallery with `fadeSlides adaptiveHeight`) or `CustomCarousel`; no autoplay on long text | `blocks/server-side/features-carousel/index.tsx`; `blocks/compose-multiplatform/quote-section/quote-section.tsx`† |
| tabs / segmented switch | `@rescui/switcher` `Switcher`, `@rescui/tab-list` | `blocks/state-of-kotlin-2026/section-nav/section-nav.tsx` |
| sticky sub-nav | `StickyHeader` wrapping a `Switcher` | same file |
| quote | `QuotesSlider` from the kit, or a page-local quote card | `blocks/education/teach-quotes/teach-quotes.tsx`; `blocks/state-of-kotlin-2026/shared/quote-card/` |
| CTA banner | page-local block with `Button`; the kit's `CtaBlock` for the education/community look | `blocks/state-of-kotlin-2026/download-cta/download-cta.tsx`; `blocks/community/layout/community-layout.tsx` |
| code sample | `CodeHighlight` (static) / `CodeBlock` (Playground, client only) | `components/code-highlight/`, `components/code-block/` |
| code card with Run / open buttons ("Try …") | a live Kotlin Playground, never a screenshot: client-only `import('kotlin-playground')`, `getInstance` → Run `execute()`, open `generateCrosslink(getCode(), { targetPlatform })`; `compose-wasm` for Compose | `blocks/compose-multiplatform/playground-block/index.tsx`† |
| tag / chip | `Tag` with `presets` | `blocks/compose-multiplatform/platforms-block/platform-item.tsx` |
| icon | `@rescui/icons` (a missing icon: check newer versions first, R6); brand marks as `<img>` svg under `public/images` | `blocks/benchmark/cta/index.tsx` |
| share buttons | `SocialShare` | `blocks/state-of-kotlin-2026/hero/hero.tsx` |
| video | YouTube: kit `youtube-player`; a short product clip: self-hosted muted `<video>` with in-view play/pause | `blocks/kotlin-effect/card-stack/card-stack.tsx`; `blocks/compose-multiplatform/platform-benefits-block/phone-video.tsx`† |
| decor shapes / renders | `<img>` + absolute module css, `aria-hidden`; parallax only if stated | `blocks/state-of-kotlin-2026/shared/floating-shape/floating-shape.tsx` |
| chart | a static chart is an image in a figure: `ChartFigure` (`src alt width height caption`); a live bar chart is `@webteam/horizontal-barchart` (`organizations.tsx`, `backend.tsx`, `ai.tsx`); a chart drawn only in the mock is an image asset or a designer question (R12) | `blocks/state-of-kotlin-2026/shared/chart-figure/chart-figure.tsx` |

## Interaction references

Behaviours designers point at by name. The referenced code is the spec. A
`kotlinlang.org` URL or quoted heading in an annotation resolves to these via
`artifacts/sections-index.json` (`project-index.mjs`, roots `pages blocks components`).

| annotation / mock signal | implementation in the project | notes |
|---|---|---|
| in-page link scrolls smoothly to a section | `<a href="#id">` + `onClick` → `scrollIntoView({ behavior: 'smooth' })` | `blocks/state-of-kotlin-2026/questions/questions.tsx`; `html { scroll-behavior: smooth }` in `pages/global.css` |
| sticky bar whose active option follows scroll | `StickyHeader` + `Switcher`, active section by an intersection/scroll line (`ACTIVATION_LINE_RATIO`), clicking scrolls | `blocks/state-of-kotlin-2026/section-nav/section-nav.tsx`; hidden up to `--ktl-tl-down` (the e2e spec checks it) |
| logos / cards moving sideways | `Marquee` (CSS), `pauseOnHover`, `hasFadingEdges`, children duplicated by the component | `organizations.tsx`; spec asserts the duplicate (`marqueeDuplicate`) |
| floating shapes with depth | `FloatingShape` + `useParallax(depth, anchor)` | `blocks/state-of-kotlin-2026/shared/floating-shape/` |
| swipe cards on mobile | `SnapCarousel` | `blocks/server-side/features-carousel/index.tsx` |
| hover state on a card | CSS `&:hover` background change with `transition` in the module | `questions.module.css` `.card` |
| expand / collapse answers | `Accordion` / `Collapse` | `faq.tsx` |
| video poster with a play button | self-hosted `<video muted loop playsInline>`: plays at 50 % in view (`useInView`), pauses off-screen, skips autoplay under `prefers-reduced-motion`, a user pause sticks, `Button` play/pause with `aria-label` | `blocks/compose-multiplatform/platform-benefits-block/phone-video.tsx`†; the e2e checks every transition |
| "Run" / "Open in Playground" on code | Kotlin Playground instance | `blocks/compose-multiplatform/playground-block/index.tsx`† |
| quote / testimonial gallery | `SnapCarousel navigationAlign="right" adaptiveHeight fadeSlides`, no autoplay | `blocks/compose-multiplatform/quote-section/quote-section.tsx`† |
| hero video loop / scripted scene | gsap + `<video>` | `blocks/kotlin-effect/hero-screen/` (heavy; a designer question first) |
| copy-to-clipboard / share | `SocialShare`, `trackEvent` | `hero.tsx` |

## Lint checklist

What `yarn lint` (`next lint` over `blocks components pages` per `next.config.js` `eslint.dirs`; `.eslintrc.json`
= `next/core-web-vitals` + `prettier`) and the project guidelines reject:

- `react-hooks/rules-of-hooks` (error) and `exhaustive-deps` (warning), both from `next/core-web-vitals` — hooks at the top level; list effect/callback dependencies.
- Internal links: the newest landing writes `<a href>` for anchors, external URLs and non-Next paths (`/lp/kotlin-for-business/` in `organizations.tsx`); for a link to another Next page route use `next/link` (15 files). **Unverified:** whether `@next/next/no-html-link-for-pages` fires on this repo (it is in `next/core-web-vitals`); run `yarn lint` and read the message.
- `@next/next/no-sync-scripts`, `no-head-element`, `no-img-element` (off), `no-page-custom-font` (off) — no `<head>` tag, no scripts in a block.
- `react/no-unescaped-entities` is off (quotes in JSX text are fine); `jsx-a11y` rules in core-web-vitals: `alt` on every `<img>`, valid anchors.
- `react/jsx-key` — `key` on mapped elements (the project passes `index` in `questions.tsx`; prefer the `id` from the data file).
- TypeScript: `strict: false`, but `yarn exec tsc -- --noEmit -p tsconfig.json` must pass; declare props types; `*.module.css` and image imports are typed by `global.d.ts`/Next.
- Not enforced by lint but by review and `.ai/guidelines.md`: prettier style (4 spaces, 120, single quotes), a Playwright spec for the page (`test/e2e/<page>.spec.ts` + `test/page/<page>-page.ts`, selectors role > text > testid, no hashed class names), semantic selectors.
- No stylelint: the CSS rules in `rules.md` R4 are not machine-checked; the toolkit's lint/adherence gate is not run here.
- ESLint scope is `blocks`, `components`, `pages` — a file under `public/` or `test/` is not linted.
