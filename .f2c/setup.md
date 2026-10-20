# Setup · kotlinlang.org

How the toolkit works beside this project: install, run one page, shoot it
deterministically, run the project's checks on it. §5 is the log of toolkit
changes this project forced — one row per change, dated, with the layer it
landed in and why.

## 1. Placement

```
<workspace>/
├── kotlin-web-site/                the project (kotlinlang.org)
│   ├── .f2c/                 this layer: project.json, rules, components, prompts, template/, pages/<page>/
│   ├── pages/<slug>/index.tsx            ← OUTPUT: the route (rules.md R1)
│   ├── blocks/<slug>/<block>/            ← OUTPUT: <block>.tsx, <block>.module.css, <block>-data.tsx
│   └── test/e2e/<slug>.spec.ts           ← OUTPUT: the page's e2e (hand-written after finalize)
└── test-stitch/              the Figma-to-code toolkit, a sibling, never inside the project
    └── app/                  engine + measurement host (Playwright lives here)
```

On this machine: project `/Users/denis.chernov/WebstormProjects/kotlin-web-site`,
toolkit `/Users/denis.chernov/WebstormProjects/test-stitch`. The toolkit's
`package.json` and its Playwright must not land inside the project: the project's
`next lint`, tsc and CODEOWNERS run over the whole tree.

Every toolkit script takes a page by path: `node scripts/<x>.mjs <project root>/.f2c/pages/<page>`
(`page.json.project` is `"../.."`). Assets the page uses are **copied** into
`public/images/<slug>/`; `.f2c/pages/<page>/assets/` is the source of truth while
the Figma revision lives (gitignored, `.f2c/.gitignore`).

## 2. Install the project

```bash
cd /Users/denis.chernov/WebstormProjects/kotlin-web-site
nvm use 22                          # .nvmrc = v22.9.0; 22.18.0 was used on 8 Oct 2026 (owner's call)
corepack enable                     # packageManager yarn@1.22.22
export WEBTEAM_UI_NPM_TOKEN=...     # in the operator's ~/.zshrc; the @webteam/* and @rescui/* registry needs it
yarn install --frozen-lockfile      # 55 s on 8 Oct 2026; postinstall builds codemirror
```

- Only the Next.js side matters for a landing; the docs side (webpack, Dokka,
  Writerside) is not built.
- The toolkit keeps its own `node_modules` (React 19, its own Playwright); the
  project's installed versions are the truth for contracts (`artifacts/INDEX.md`).
  Refresh `artifacts/` after a lock-file change:
  `node scripts/project-setup.mjs /Users/denis.chernov/WebstormProjects/kotlin-web-site`.
- **Unverified:** `.nvmrc` v22.9.0 vs 22.18.0 — install succeeded on 22.18.0;
  nothing was run on 22.9.0.

## 3. Run one page

```bash
yarn start                          # next dev, http://localhost:3000 (long-running)
open http://localhost:3000/<slug>/  # cold first page about 10 s; trailing slash (trailingSlash: true)
```

- A new URL exists as soon as `pages/<slug>/index.tsx` exists; no registry,
  no router edit. A preview route per block is `/<slug>/preview/<block>/`
  (emitted by `emit-project-page.mjs`, deleted by `finalize-project-page.mjs`).
- No Docker, no backend: the page is static. `LandingLayout` reads
  `data/releases.yml` and `search-config.json` from the repository.
- `project.json.dev.readiness`: `document.fonts.ready` and `html.hydrated`
  (`components/hydration-event.tsx`; the project's own page objects wait for it:
  `test/page/compose-multiplatform-page.ts`).
- Fast refresh is Next's standard one; **unverified:** HMR timing for a module
  css edit on this machine.

## 4. Shoot it deterministically

The toolkit's `measure.mjs --live` / `shot.mjs --base-url=http://localhost:3000
--project=<root>` shoot the dev server by `page.json.live` selectors
(`[data-testid="<page>-<slug>"]`). What the page does that breaks determinism,
and the answer in `project.json.shot`:

| noise | where it is | neutralise (`shot` key) |
|---|---|---|
| Google Tag Manager (GTM-5P98), consent/banners it injects | `pages/_app.jsx` `Script` + `<noscript>` | `blockRoutes` `**/googletagmanager.com/**` |
| Optimizely sync script and its banner | `pages/_document.jsx` (`cdn.optimizely.com`) | `blockRoutes` `**/cdn.optimizely.com/**`; `hideSelectors` `#optly-banner`, `.optly-banner` |
| resources.jetbrains.com storage requests | footer/header data | `blockRoutes` `**/resources.jetbrains.com/storage/**` |
| smooth scrolling | `html { scroll-behavior: smooth }` in `pages/global.css` | `reducedMotion: true` + the shot's animation freeze |
| hydration | `html.hydrated`, `react:hydrated` | `dev.readiness.hydrated` |
| marquee, parallax shapes, sticky switcher, gsap/lottie/video on other pages | `components/marquee`, `blocks/state-of-kotlin-2026/shared/floating-shape`, `components/sticky-header`, `blocks/kotlin-effect/hero-screen` | `warmupScroll: true` (scroll to the bottom and back so scroll-driven blocks mount), `reducedMotion` |
| the sticky top menu | `LandingLayout` unless `hideTopMenu` | `hideTopMenu` on the emitted shell; `hideForSections` is empty until a page shows a sticky overlay on a tall section |
| fonts | `@rescui/typography/lib/font-jb-sans-auto.css` (`pages/global.css`) | `document.fonts.ready` |
| lazy images | `<img>` plain, no `next/image` | none needed (**unverified** on a page with `loading="lazy"`) |

Viewports: the toolkit's 1540 / 1276 / 768 / 360 (`shot.viewports`,
`deviceScaleFactor: 1`). The project's own Playwright projects
(`playwright.config.ts` / `getProjects()`) are not the toolkit's ranges. The
header/footer come from `@jetbrains/kotlin-web-site-ui` and are outside the
measured sections.

## 5. Toolkit changes this project forced

| # | change | layer | why |
|---|---|---|---|
| 1 | the shape keys and template/files.json (output.pageEntry/sectionsRoot/importAlias/testId/copy.kind, layout.rhythm.kind, index.shared, annotations.hosts, contracts.scopes; the emitted set as data) — landed 8 Oct 2026 in the toolkit, see its pilot/kotlin-web-site-plan.md §4 | engine + adapter | the first consumer's shape was hardcoded in the emitter, finalize, project-index, the watchdog and the drafter |
| 2 | `segment.mjs`: a chrome node that is not a block (this mock's `Nav Bar Spacer` and `Footer Background` rectangles inside the content root) is excluded from the split's children — left in, it failed the all-children-are-blocks condition and glued the whole page into one section; chrome frames keep their old treatment. Neutral on the corpus (re-segmented with and without: 0 files differ); 1 test. Landed 8 Oct 2026 | engine | the first consumer's mocks carried chrome as frames only |
| 3 | `decor-inventory.mjs` / `media-inventory.mjs`: a page with `page.json.project` writes its placement css and render list into the record (`<page dir>/decor.module.css`, `decor.render.json`, `media.css`), not into the toolkit's `app/src/pages/<page>/` — a project page has no host-app page. Landed 8 Oct 2026 | engine | the first run created a stray `app/src/pages/multiplatform-builders/` in the toolkit |
| 4 | **The range model is the page's, i.e. this project's grid** (owner: their grid at every breakpoint, or the launch fails): `page.json.breakpoints` keys ordered by `media` are the ranges (`lib/constants.mjs rangesOf` & co.), every reader generalized, preflight checks each twin range against `project.json.grid.breakpoints` (here `ds 1190 / tl 1000 / ts 808 / ml 640 / ms 472`), a frame ≤ 2 px wider than its range (Desktop S 1192 for ≤1190) is shot at the bound. Corpus identical with and without. Landed 8 Oct 2026 | engine | rescui's four ranges would have left two of the designer's six frames outside the gate |
| 5 | `context-prompts.mjs`: the record path in the transcription prompt is the page dir — `design/<page>/` for a corpus page, the absolute `<project root>/.f2c/pages/<page>/` for a project page; it was the `design/<page>/` literal for every page, which would have sent this page's six dumps into a directory that does not exist. 1 test. Landed 8 Oct 2026 | engine | the first consumer's pages were dumped before decision 25 moved the record into the project |
| 6 | `reuse-match.mjs` / `lib/reuse.mjs`: a live candidate whose aligned shot covers less than half the mock crop (`COVERAGE_FLOOR` 0.5) ranks below every covered one and is never a reference or a weak candidate; the table prints it as `set aside: … a slice, not a reference`. On this dark page a 49 px strip (`kotlin-effect/meetups-block`, picked by "closest section" to a text) scored 0.824 at 3–9 % coverage and a 168 px filter bar 0.91 at 13 %, and five of six sections came out tier B with no reference; after the rule: A 0 / B 0 / C 6 (`--rerank`, no browser). A candidate without a recorded coverage counts as covered — the PyCharm verdicts rerank unchanged. 1 test. Landed 8 Oct 2026 | engine | the first consumer's pages are light: a wrong slice of a white page scores low, a slice of a black page scores like a twin |
| 7 | `section-brief.mjs`: the agent's preview route is `project.json.dev.baseUrl` + the live path (`devOrigin` in `lib/project-config.mjs`; :5173 only when no project says otherwise) — it was the literal `http://localhost:5173` and this project serves on :3000; the page-ground line no longer names the first consumer's `jb-transparent-section` class. 1 test. Landed 8 Oct 2026 | engine | the first consumer's dev server is the one the brief was written against |
| 8 | **The gate's third height reading and the live shot's offset for padded rhythm** (plan risk R2, decided on this page's dumps): with `layout.rhythm.kind` section-padding the live section box is the mock's gap above it (written as `padding-top`, rules R2) + the frame's box, and the DOM cannot tell that gap from padding the frame itself carries (03–06 here carry 72/72 inside the frame). `bp-structure` reads the gap per section and range from `layout.json`, `compareStructure` passes when the box net of it fits (`note: height … carries the mock's N px gap as padding`), and the rhythm line compares content tops (top + gap) with the frames' boxes; `measure --live` shoots the section from the gap down so the crop and the render start at the same row. Before: 19 of 30 FAIL on height alone, hero 0.4765 at y₁div 0. A project without the kind, or without `layout.json`, is byte-identical. 1 test. Landed 8 Oct 2026 | engine | the first consumer's rhythm is a margin class the gate already nets out |
| 9 | `lib/dump-structure.mjs parseDump`: the section root is the default export's return — a dump whose icons are helper components (`function Developers() { return (…) }`) declares them first and the first `return (` made a 64 px absolute icon box the root: `blocks 2 vs 0 in the frame` at four of five ranges on the features grid. 1 test. Landed 8 Oct 2026 | engine | the first consumer's dumps carried no helper components before the export |
| 10 | `lib/dump-structure.mjs orientationOf`: a deliberate overlap (stacked cards drawn with `mb-[-16px]`) within `OVERLAP_SHARE` 0.25 of the previous box is still a stack (or a row) as long as the next box starts below (right of) the previous one's start; it read as `wrapping live` at every range on the platform cards. 1 test. Landed 8 Oct 2026 | engine | — |

## 6. Run the project's checks on the page

```bash
yarn lint --dir pages/<slug> --dir blocks/<slug>   # next lint, scoped; the full yarn lint covers blocks components pages
yarn exec tsc -- --noEmit -p tsconfig.json         # whole project, not scopable
yarn test:e2e test/e2e/<slug>.spec.ts              # dev server on :3000 must be up; the page's own spec
node scripts/project-check.mjs <root>/.f2c/pages/<slug> --only=lint,types   # toolkit wrapper over project.json.checks
```

- `lint` gates ESLint (`next/core-web-vitals`, hooks, a11y, Next rules); prettier
  is not part of it. `types` gates tsc (`strict: false`). `e2e` is the
  deliverable per `.ai/guidelines.md` and is **not** run by `project-check.mjs`.
- No stylelint, no unit tests, no image-size gate in this project; `--only=style|unit|images` do not apply.
- Runtimes of `yarn lint` and `tsc` on this machine: **unverified**.
- Commit style `feat: <description>` (optional `ktl-NNNN`); no PR before the team presentation.
