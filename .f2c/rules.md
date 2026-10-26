# Generator rules · kotlinlang.org

The rules an agent follows when it writes code into this project's pages root.
Each rule names the project fact behind it and an example path in the
repository; a rule without an example is a guess. This file is inlined verbatim
into every section brief (`section-brief.mjs`, Appendix A), so write it for the
agent, not for the reader of this directory.

Derived 8 Oct 2026 at HEAD `38512ffcb9` from `CLAUDE.md`, `.ai/guidelines.md`,
`.eslintrc.json` and the newest shipped landings (`state-of-kotlin-2026`,
`benchmark`; older: `compose-multiplatform`, `multiplatform`). Where pages
disagree, the newest landing wins — **for a new page**. When the work changes a
shipped page, that page's own blocks are the convention (R1a). Paths are
relative to the project root.

Revised 26 Oct 2026 after comparing the agentic `compose-multiplatform-redesign`
run with the hand-guided KTL-4742 page (R1a, R13, R14 and edits marked
"KTL-4742" below). Paths marked † land with KTL-4742 (branch `KTL-4742-fixes`,
PR #5868) and exist in the project once it is merged.

Numbering is stable once a rule is cited by a brief or a note: retire a rule
by marking it, never by renumbering.

## R1 — the route shell

- A page is `pages/<slug>/index.tsx` with a **default export** component; the
  folder name is the URL (`/<slug>/`, `trailingSlash`). Nothing registers it
  (`pages/state-of-kotlin-2026/index.tsx`).
- The body is `<LandingLayout …>` (`components/landing-layout/landing-layout.tsx`)
  with `title`, `description`, `theme`, `hideTopMenu`, `currentTitle`,
  `currentUrl`, `ogImageName`, `dataTestId="<slug>-page"`; then one wrapper
  `div.wrapper` (`overflow-x: clip; position: relative` in
  `pages/<slug>/index.module.css`) → `div.ktl-layout-v2.ktl-layout--center`
  → the blocks. The emitter writes exactly this; do not edit the shell.
- `export const <X>_TITLE` and `<X>_URL` live in the route module
  (`STATE_OF_KOTLIN_2026_URL = '/state-of-kotlin-2026/'`).
- The older shell (`pages/compose-multiplatform/index.tsx`: `ktl-layout-to-2`,
  inner `ThemeProvider theme="dark"`, `topMenuItems`/`topMenuButton`) is **not**
  copied for a new landing. A redesign of a shipped page keeps that page's
  `topMenu*` props and `currentUrl`: read them off its route module and tell
  the orchestrator.
- `ogImageName` is a file name in `assets/images/open-graph/`
  (`state-of-kotlin-2026.jpg`, `benchmark.jpg`, `compose-multiplatform.png`; the
  URL is `/assets/images/open-graph/<name>` in `landing-layout.tsx`). If the mock
  has no share image leave the prop out (falls back to `general.png`) and list
  it as a designer question; never point at a file that does not exist.
- Nothing at render time may touch `window`/`document` (static export):
  DOM access in `useEffect`/handlers only (`questions.tsx` scrolls in `onClick`).
- Title and description never ship as a placeholder, a ticket id or a toolkit
  name (the redesign run shipped `'TODO: meta description…'` and
  `Compose Multiplatform | Kotlin AI Pages (KTL-5170 / KTL-4742)`): a redesign
  keeps the shipped route's values; a new page takes them per R5, or the gap is
  a question in the reply.

## R1a — redesign of a shipped page (KTL-4742)

A mock that redesigns a page which already exists on kotlinlang.org changes
that page **in place**; it is not a new page next to it.

- **The route module is edited, not emitted.** `pages/<slug>/index.tsx` keeps
  its shell as it is: `ktl-layout-to-2`, the inner `ThemeProvider`, `title`,
  `description`, `ogImageName`, `currentTitle`/`currentUrl` and every
  `topMenu*` prop (`pages/compose-multiplatform/index.tsx`). The template's
  `hideTopMenu` shell is for new pages only.
- **Every mock section gets a block decision** in the manifest before markup:
  `keep` (the shipped block already matches), `modify:<path>`, `replace:<path>`
  (a new block takes the place of an old one) or `new`. Match by identity first
  — the same route's blocks under `blocks/<slug>/`, including the ones landed
  for sibling tickets on the same branch — and by pixels only for the rest.
  The redesign run regenerated `hero` and `benefits` although
  `blocks/compose-multiplatform/hero` and `benefits-block` already existed;
  the final page kept them and replaced `features-block` with
  `platform-benefits-block`† + `playground-block`†.
- **Dead code goes in the same change**: a block no section maps to is
  deleted with its images (`public/images/<slug>/<block>/`) and its e2e tests
  (KTL-4742 removed `features-block/*` and `features-block/code-*.svg`).
- **The page's conventions win over the newest landing** inside its blocks:
  file shape (`index.tsx` + `<block>.module.css` + `<block>-data.tsx` in
  `blocks/compose-multiplatform/`), container class on each section
  (`ktl-layout ktl-layout--center`), text helper (`createTextCn('dark')`),
  image handling (co-located `./images/*` through `next/image`), testids
  (`<block>-block`, `<block>-block-title`, `platform-benefits-item`†). Read two
  of the page's blocks before writing the first line; R3, R4, R6, R8 and R10
  describe the new-page default where they differ.
- A review route next to the shipped one (`/<slug>-redesign/`) is the
  owner's call only. Even then the deliverable is the diff on the shipped
  route; the review route is deleted before the PR.

## R2 — the composition layer

- Blocks are listed in the mock's order in the route module, nothing between
  them. Every block is `<section>` at its root.
- **Rhythm is the block's own padding:** `.wrapper { padding: 72px 0 }` is the
  newest convention (`blocks/state-of-kotlin-2026/questions/questions.module.css`,
  `numbers`, `growth`, `faq`, `methodology`). The emitter writes the mock's gap
  above the block as `padding-top` (the bottom is the next block's top);
  the toolkit gate reads it as the section's own rhythm. No external
  vertical margins on the root. A different gap is written as the number the
  mock shows, never rounded to 72.
- Block root: `<section className={styles.wrapper} data-testid="<page>-<slug>" id="<slug>">`.
  `id` is the anchor the page links to (`faq`, `growth`); the e2e spec finds
  sections by `section[data-testid]` inside the page's layout and expects their
  count and order (`test/e2e/state-of-kotlin-2026.spec.ts`), so **no nested
  `<section>` carrying a `data-testid`** — inner groups are `div`.
- **The slug names the section's role, never its copy** (KTL-4742): `hero`,
  `benefits`, `platforms`, `playground`, `quotes`, `faq`, `cta`. Not the first
  words of a heading (`android-skills-every`, `build-your-first`), not a
  person on the first slide (`alex-askerov` for a testimonial carousel), not
  one card's title for a block of six (`native-experiences`). The slug becomes
  the folder, the `id` and every testid; set `manifest.sections[].slug` when
  the derived one reads like copy.
- A block whose mock fills the width (background plate) puts the plate on an
  inner element, not on the route wrapper; the wrapper's `overflow-x: clip` stays.
  Page-level ground/decor lives on the page wrapper
  (`pages/state-of-kotlin-2026/index.module.css`, `HeroDecoration` sibling).
- Chrome (header, footer, sticky top menu) is `LandingLayout`; it is never
  generated and never measured.

## R3 — grid and cards

- The container is `ktl-layout-v2 ktl-layout--center`: content width 1144 /
  952 / 760 / 568 / 424 / 312 (`node_modules/@jetbrains/kotlin-web-site-ui/out/components/layout-v2/index.css`).
  A block never sets its own `max-width`/`margin: auto` to fake the container;
  it fills it (the toolkit's "content stretches"). `@webteam/layout` (`Row`/`colCn`)
  is **not** this project's grid (one file uses it) — do not import it.
- Section grids are CSS grid/flex in the block's module css
  (`questions.module.css`: `grid-template-columns: repeat(2, minmax(0, 1fr))`,
  stacked `minmax(0, 1fr)` under `--ktl-tl-down`). Write the collapse where the
  mock's frames collapse; the frames' dumps say where.
- Cards: `@rescui/card` `cardCn` only where a rescui card is meant
  (`blocks/compose-multiplatform/quote-section/quote-section.tsx`, 4 files); the
  newest landing builds cards as plain `div` + module css (`.card` in
  `questions.module.css`: padding 24, radius 8, `#fff`). Follow the mock; a card
  that is a link/clickable is an `<a>` or has one inside, never a click-only `div`.
- **No mock-derived fixed card height** — `min-height` only, and only when the
  mock keeps a card taller than its content at every width; rows equalize with
  `grid-auto-rows: 1fr` / `align-items: stretch` (`questions.module.css`).
- Card contents that sit at the bottom of an equal-height row are pinned with
  `justify-content: space-between` (same file); at the stacked width the pin is
  dropped (the file's comment explains why).

## R4 — styles

- One `<block>.module.css` per block; imported as `styles`. Classes are
  **camelCase** (`styles.downloadButton`). No global selectors except
  `:global(...)` for a third-party node (`pages/state-of-kotlin-2026/index.module.css`).
- Line 1 of every module that uses a breakpoint:
  `@import "@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2/media.pcss";`
  — an unknown `--ktl-*` custom media fails the PostCSS build.
- Breakpoints: `@media (--ktl-ds-down)` 1190, `--ktl-tl-down` 1000,
  `--ktl-ts-down` 808, `--ktl-ml-down` 640, `--ktl-ms-down` 472 (also `-up`,
  `-min`, `-only`: `.../breakpoints-v2/media.pcss`). Order is **desktop-first,
  wide → narrow**: base rules = the widest frame, then `ds`, `tl`, `ts`, `ml`, `ms`
  (`questions.module.css`). The toolkit's 1276 frame → `--ktl-ds-down`, 768 →
  `--ktl-ts-down`, 360 → `--ktl-ml-down` / `--ktl-ms-down`; pick the one at which
  the dump's structure changes, not the frame width.
- CSS nesting is allowed (`&:hover` in `questions.module.css`).
- **Raw px and hex are this project's norm** (`state-of-kotlin-2026` module css:
  64 hex hits); the toolkit's "no raw px/hex" is not enforced by the reviewer.
  Still: use a rescui/ktl token where one exists —
  `var(--ktl-box-section-s|m|l)` = 24/32/48, `var(--ktl-box-page-s|m|l)` =
  64/72/96, `var(--ktl-box-block-s|m|l)` = 4/8/16 (`blocks/benchmark/cta/cta.module.css`;
  values from `@jetbrains/kotlin-web-site-ui/out/components`); otherwise the
  mock's hex/px written literally, light value for a light page. `--rs-*`
  appear only as card vars (`--rs-card-background-color`, `--rs-card-border-color`)
  and as text-size overrides (`--rs-h1-font-size-mobile`,
  `--rs-text-1-font-size` in `questions.module.css`, `pages/state-of-kotlin-2026/index.module.css`).
- Typography is the rescui role, never a hand-set `font-size`/`line-height` for
  system text. A frame that keeps a desktop size at a narrow width is overridden
  through the role's own variable (`--rs-h1-font-size-mobile: 28px` under
  `--ktl-ms-down`, `questions.module.css`) and recorded as a deviation. Plain
  `font-size: 14px` on a link exists (`questions.module.css` `.link`) — avoid it.
- Text-bearing blocks: `min-height`, never `height` + `overflow: hidden`.
- Gradients/backgrounds as in the mock (`radial-gradient(...)` on `.panel`,
  `questions.module.css`); the brand gradient is not invented.
- `ktl-*` global utility classes (`ktl-offset-top-m`, `ktl-hero`) exist and are
  used by older pages; the newest landing does not use them — write padding in
  the module.

## R5 — copy

- **Copy verbatim from the mock; no i18n, no Lingui, no `t` macros.** Plain
  strings in JSX, in an array at the top of the block file, or in
  `<slug>-data.tsx` (`blocks/compose-multiplatform/hero/hero-data.tsx`). The
  emitter's data file exports `{ id, text: ReactNode }[]`; the markup step
  regroups it into headings/leads/cards and never rewrites a character.
- Non-breaking spaces: `&nbsp;` in JSX text (`hero.tsx`: `in&nbsp;2026`). In a
  **string** constant `&nbsp;` is rendered only through `dangerouslySetInnerHTML`
  (the newest landing does this for heading strings: `questions.tsx`, 8 files);
  prefer a `ReactNode` entry (JSX) so no raw HTML is needed.
- Long rich text (FAQ answers) is Markdown through `Markdown` from
  `@/utils/mdToHtml` with link overrides (`blocks/state-of-kotlin-2026/faq/faq.tsx`).
- Page `<title>` and description are the `LandingLayout` props, copied from the
  mock's metadata if present; if the mock has none, take the page title and
  record "no description in the mock" — never invent marketing copy.
- Numbers, product names, years exactly as in the mock (`rs-hero` stat figures
  `15–20%`, `backend.tsx`).

## R6 — images, logos, diagrams

- Raster in a page: `<img src="/images/<slug>/<name>.webp" alt="" width height>`
  with the file under `public/images/<slug>/`
  (`blocks/state-of-kotlin-2026/numbers/numbers.tsx`; the files are
  `public/images/state-of-kotlin-2026/*.webp`). A co-located import is also
  used (`blocks/compose-multiplatform/hero/index.tsx` imports
  `./images/compose-hero-desktop-graphics.webp`); pick `public/images/<slug>/`
  for new work, it matches the newest landing; in a redesign, the page's own
  way (R1a). The toolkit's `.f2c/pages/<page>/assets/` stays the source of
  truth and the file is copied.
- **Reuse before vendoring** (KTL-4742): an image the page already ships (the
  hero gallery's case-study shots under `blocks/compose-multiplatform/hero/`)
  is imported from where it is, never vendored again from the mock under a new
  name (the redesign run added `hero/gallery-img-*.png` beside the shipped
  `.webp` set).
- **Size budget**: a raster is exported at 2× its largest displayed size, WebP
  (PNG only for a cut-out that needs it), about 500 KB at most; decor never
  ships at the Figma original (the redesign run shipped
  `decor-hero-render.png` 7.1 MB, `decor-footer-graphic.png` 5.8 MB,
  `android-skills-phone.png` 5.5 MB). A file over budget is named in the reply.
- `next/image` is **not** used by the newest landing (12 older files import it;
  `images.unoptimized: true`); write a plain `<img>`
  (`@next/next/no-img-element` is off in `.eslintrc.json`). Give `width`/`height`
  and meaningful `alt` (`alt=""` for decor).
- SVG: a file under `public/images/<slug>/` used by `<img src>`, an inline
  `<svg>`, or a static import — `import x from './x.svg'` gives an object, use
  `x.src` (`blocks/education/subscription-form/subscription-form.tsx`:
  `<img src={MailIcon.src} />`). **Unverified:** `next.config.js` has no svg rule,
  so this is Next's built-in static-image import (and the `url-loader`/`svgo`
  devDependencies are for the docs webpack side); the newest landing only uses
  `/images/...` URLs, so prefer those.
- Company logos: `public/images/companies/*.svg` and `public/images/case-studies/*-logo.svg`
  (`adobe.svg`, `google.svg`, `ing-logo.svg`, ...), strip components
  `components/customer-logo-marquee` and `components/marquee`
  (`organizations.tsx` uses `Marquee`). Check these before vendoring a logo
  from the mock; a brand missing there is vendored into `public/images/<slug>/`.
- Icons: `@rescui/icons` (`GitHubIcon`, `ArrowRightIcon`; 26 files). An icon
  the installed version lacks is first looked up in the package's newer
  versions (KTL-4742 bumped it to 1.8.0 for `ExternalOutlineIcon`; the
  redesign run vendored `external-outline.svg`, `code-outline.svg` and
  `play.svg` instead). A bump is a question to the orchestrator (R9); a
  library icon is never vendored as an svg.
- Decor (shapes, renders) is `<img>` + absolutely positioned module css, `aria-hidden`
  or `alt=""` (`blocks/state-of-kotlin-2026/shared/floating-shape/`, `hero-decoration/`).
  A parallax is `useParallax` there — do not add motion the mock does not state.
- Video: `@jetbrains/kotlin-web-site-ui/out/components/youtube-player`
  (6 files) for YouTube. A short product clip is a self-hosted muted `<video>`
  co-located with its block: `blocks/compose-multiplatform/platform-benefits-block/phone-video.tsx`†
  (plays while in view, pauses off-screen, respects `prefers-reduced-motion`,
  a pause by the user sticks, labelled play/pause `Button`, `#t=0.001` so
  Safari paints the first frame); the heavy scripted case is
  `blocks/kotlin-effect/hero-screen/hero-video/`. A mock node named `*-h264`,
  `*.mp4` or "video" is a video: get the file through the ticket (R13) before
  falling back to an R12 placeholder.

## R7 — interactive patterns

- Prefer what the project has; see `components.md` ("Interaction references").
  FAQ: `Accordion` + `Collapse title borderBottom` from `@rescui/collapse`
  (`blocks/state-of-kotlin-2026/faq/faq.tsx`). Logo strip with motion:
  `components/marquee` (`organizations.tsx`). Mobile carousel:
  `components/snap-carousel`. Sticky switcher: `@rescui/switcher` inside
  `components/sticky-header` (`section-nav.tsx`). Tabs: `@rescui/tab-list`.
- **A control the mock draws is never shipped inert** (KTL-4742). A button
  with no handler and no `href` is not a deliverable: build the behaviour it
  implies, or leave the control out and ask. The redesign run shipped the
  "Try" section as a static `showcase.png` under three `Button`s with no
  `onClick`; the page shipped a live Kotlin Playground
  (`blocks/compose-multiplatform/playground-block/index.tsx`†: client-only
  `import('kotlin-playground')`, `compose-wasm` target, Run →
  `instance.execute()`, open → `generateCrosslink(instance.getCode())`,
  the code in `code-sample.md`).
- Carousels of long text (quotes, testimonials) have **no autoplay** — the
  agreed decision on KTL-4742; prev/next and the counter only.
- Smooth in-page scroll is `scrollIntoView({ behavior: 'smooth' })` in an
  `onClick` with `preventDefault` on a real `<a href="#id">` (`questions.tsx`).
- Analytics: `trackEvent({ eventAction, eventLabel })` from `@/utils/event-logger`
  on tracked CTAs (`hero.tsx`) — only when the mock/designer asks; never invent
  an event name.
- State/motion beyond the above is a designer question (R11), not a guess.

## R8 — accessibility and links

- One `h1` per page (the hero: `<h1 className={textCn('rs-super-hero')}>`,
  `hero.tsx`; `rs-hero` also appears on h1: `blocks/benchmark/hero/index.tsx`);
  section titles are `h2` with `textCn('rs-h1')` (`section-heading.tsx`,
  `questions.tsx`); lower levels `h3`/`h4`. The e2e spec counts `h1` = 1.
- Links: `<a className={textCn('rs-link')} href>`; CTAs are
  `@rescui/button` `<Button href mode="rock" size="l">` (`mode` rock 20 /
  outline 14 / classic 2 across the project; `size` l 29 / s 6 / m 4 / xs 2);
  a narrow-width size switch is `useMS() ? 'm' : 'l'` (`hero.tsx`).
- External links: `target="_blank" rel="noopener noreferrer"` (`hero.tsx`,
  `faq.tsx` Markdown override); in a link style, `textCn('rs-link', { external: true })`
  draws the arrow (`platform-benefits-data.tsx`†). Internal: `<a href="/x/">`
  (newest) or `next/link` (15 files) — keep the trailing slash.
- **A `kotlinlang.org` URL is internal** (KTL-4742): write the path
  (`/case-studies/?type=multiplatform`), same tab, no `target="_blank"`. The
  redesign run wrote `https://kotlinlang.org/case-studies/…` with
  `target="_blank"`. `/docs/…` is internal too.
- Decorative images `alt=""`; interactive things reachable by keyboard; a
  clickable card has a real link inside.
- Test hooks: `data-testid="<page>-<slug>"` on the root, and
  `data-testid="<page>-<slug>-<part>"` on the title/CTAs the spec needs
  (`sok-hero-title`, `sok-hero-download`, `sok-faq-title`). The emitter writes
  the root's; add part ids only for what the page's spec will query.
- Every `data-testid` is the e2e contract, so it is written before the spec is.

## R9 — what never goes into a page

- No `@webteam/layout` `Row`/`colCn`/`Section`/`Container`, no `wt-*` classes
  (one legacy block uses them).
- No edits to `pages/_app.jsx`, `pages/_document.jsx`,
  `pages/global.css`, `next.config.js`, `postcss.config.js`, `redirects/`,
  `data/releases.yml`, `docs/` (code-owned or shared, `CODEOWNERS`). A need
  there is a question to the orchestrator.
- `package.json` / `yarn.lock`: no new dependency. A version bump of an
  installed one (a missing icon, a needed feature) is proposed to the
  orchestrator with the reason, never made silently.
- **Shared components are extended, not re-implemented** (KTL-4742; this
  replaces "no edits to `components/`"). A mock behaviour that a component in
  `components/` almost covers gets an **optional prop whose default keeps
  today's behaviour** (`components/snap-carousel`: `navigationAlign`,
  `adaptiveHeight`, `fadeSlides`† for the quotes gallery). A pattern a
  second page needs is extracted into `components/` and the first page is
  switched to it (`components/columned-faq`†, out of
  `blocks/multiplatform/faq-block`). Never a local copy of a hook the
  component wraps (the redesign run hand-rolled `useSnapCarousel` and an
  accordion). Section agents running in parallel propose the change in their
  reply; the orchestrator makes it once, lists it as a shared change and runs
  the e2e of every page that uses the component.
- In a new page: no `next/image` (in a redesign, the page's way, R1a), no Tailwind/utility classes, no inline
  `style={{}}` except a CSS custom property
  (`section-heading.tsx`: `--sok-heading-title-max-width`).
- No GTM/Optimizely/analytics code, no cookie logic, no `dangerouslySetInnerHTML`
  for anything but a static copy string with `&nbsp;`.
- No hand-written `.f2c/`-style provenance in the code: Figma node ids, frame
  names, `design/…` paths stay in `.f2c/pages/<page>/` (`finalize-project-page.mjs`
  strips them before the PR).
- No fixed heights on text, no `!important`, no fake lorem — missing content is R12.

## R10 — theme

- One theme per landing: the mock's. `theme="light"` on `LandingLayout` for a
  light mock (`pages/state-of-kotlin-2026/index.tsx`, page ground `#ffffff` is
  `.contentWrapperLight` in `landing-layout.module.css`), default `'dark'` for a
  dark mock (`pages/compose-multiplatform/index.tsx`). The emitter passes
  `{{theme}}` from `page.json.theme`.
- Colors are written for that theme directly. No `ThemeProvider` inside a block
  unless the mock draws an island of the other theme (then wrap that island:
  `ThemeProvider theme="dark"` from `@rescui/ui-contexts`).
- Dark-theme text: `useTextStyles()` follows the provider; `createTextCn('dark')`
  is used only in data files that have no hook (`hero-data.tsx`) — in a new
  page. The shipped `compose-multiplatform` blocks call `createTextCn('dark')`
  in the component too; a redesign follows the page (R1a).
- No theme switcher exists in this project; do not build one.

## R11 — designer annotations

- Annotation sources, in order: a Figma Dev Mode annotation on the node
  (`data-interaction-annotations="…"` in `get_design_context`; recorded in
  `manifest.sections[].annotations`); a library behaviour implied by the
  instance (`@rescui/collapse`, `@rescui/switcher`, `components/snap-carousel`);
  a convention already in the project. If none applies and the element looks
  animated (video-like frame, layered states, hidden variant) it is a designer
  question in the reply — never a guess.
- An annotation that names a jetbrains page ("as on kotlinlang.org/…") or a quoted
  heading resolves through `components.md` → "Interaction references" and the
  section index; the referenced implementation is the spec, the mock its drawn
  state. Hosts the resolver matches: `kotlinlang.org`, `www.kotlinlang.org`
  (`project.json.annotations.hosts`).
- The emitted code never carries the attribute.

## R12 — missing content

Content is missing only after R13's sources were read: the redesign run
shipped three FAQ questions with placeholder answers while the ticket linked
the FAQ doc with six questions and answers.

A repeated block whose mock draws one item (a slider with one slide of four, an
accordion with one answer open, a card list with one logo) is **built with the
full mechanism and the available content repeated**, so a reviewer can operate
it: the FAQ with every question and a placeholder answer
(`Answer copy to follow — the mock carries only the question.`), the carousel
with its track and controls. Never a cut-down mechanism, never invented copy.

A mock element the project has **no asset for** — a product UI or IDE screenshot,
a video, a photo, a logo not in `public/images/companies` — is **recorded, never
faked**: keep the box at the mock's proportions with `min-height`/`aspect-ratio`
and the mock's ground, `alt` naming it, no drawn imitation; list it as a designer
question and in the page notes. When the asset arrives it replaces the placeholder
and nothing else changes. (Shape from the first consumer's R12; here the example
is a shipped placeholder-free page, so there is no repository path — this is the
toolkit's convention, unverified against a reviewer.)

## R13 — sources of truth beyond the mock (KTL-4742)

The mock is one input, and not the newest one. A page is built from, in
order of precedence:

1. **Agreed deviations**: the YouTrack ticket, its subtasks and the comments
   of the design ticket it links (`DSGN-…`). On KTL-4742: the Blue-block copy
   changed per a DSGN-26627 comment, the "Stable" tag removed from the
   platform cards, no autoplay on the quotes gallery, a live Playground
   instead of the drawn picture.
2. **Content documents the ticket links**: copy docs, FAQ docs, sample code.
   KTL-4742's FAQ (six questions with answers) came from a Google doc, not
   from the mock's three questions.
3. **The canonical design file** the ticket names. `page.json.figma.fileKey`
   is that file; a working copy (the redesign run used `JlQuhpF5pdBIhdmBWFr5N6`
   "Kotlin AI Pages" instead of `0GtKD7idOxWPoqXfZpnite`) is recorded as
   `page.json.figma.copyOf` and every difference found is a deviation.
4. **The mock's drawn state**.

Intake writes (1) and (2) into the record before any brief is generated:
`manifest.sections[].agreedDeviations` (what changes against the mock, with
the comment link) and `manifest.sections[].contentSources` (doc link and the
part of it that feeds the section). The briefs carry both. A designer question
in a reply first names the ticket comment or doc that was checked; a question
the ticket already answers is not asked (the redesign run's `notes.md` carried
about a dozen such questions).

## R14 — e2e for a changed page (KTL-4742)

`.ai/guidelines.md` asks for a test per feature; for a redesign that means the
page's **existing** spec and page object are changed, not a new spec for a
new route (`test/e2e/compose-multiplatform.spec.ts`,
`test/page/compose-multiplatform-page.ts`†):

- Tests of deleted blocks are deleted; every new block gets a test.
- Expectations come from the block's data module, not retyped strings
  (`import { FAQ_ITEMS } from '@/blocks/compose-multiplatform/faq/faq-data'`†,
  `platformsData`).
- **One behaviour test per interactive element**, not only presence: carousel
  prev/next, the counter and the disabled ends; accordion opens one answer
  and closes the other; video plays in view, pauses off-screen, a user pause
  sticks; Playground Run starts the app and "open" builds the crosslink of
  the edited code (`context.route('https://play.kotlinlang.org/**', …)` so the
  external editor is not loaded; `test.slow()` for the remote compile).
- Screenshots (`checkScreenshot`) mask what is not deterministic (`mask`: the
  video and its fading button) and hide the sticky top menu over tall blocks
  (`stylePath: ['test/e2e/compose-multiplatform/hide-top-menu.css']`†).
