# Project profile · kotlinlang.org

Facts read from the repository, dated. Read-only intake: nothing here is a
decision, every line names where in the repository it was read. `project.json`
is this file made machine-readable; `project-setup.mjs` drafted both at the
commit below and reports drift on its next run.

- **readAt:** 2026-10-08, commit `38512ffcb9`, branch `figma-to-code`

## Stack

- Next.js 14.2.35 **pages router**, React 18.3.1, TypeScript 4.9.5 with
  `"strict": false` (`tsconfig.json`), alias `@/*` → repo root. Static export:
  `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`
  (`next.config.js`). No i18n, no router config: one language, one URL per page.
- Styles: CSS Modules + PostCSS (`postcss.config.js`: custom-media, nesting).
  No Tailwind, no stylelint. `pages/global.css` is the only global sheet.
- Package manager yarn 1.22.22 (`packageManager`), node `.nvmrc` = v22.9.0
  (22.18.0 used on 8 Oct 2026, owner's call). Env: `WEBTEAM_UI_NPM_TOKEN` for
  the `@webteam/*` / `@rescui/*` registry. Install `yarn install --frozen-lockfile`
  (55 s on 8 Oct 2026; `postinstall` builds codemirror).
- Dev: `yarn start` = `next dev` on :3000 (cold first page about 10 s). A new
  URL exists as soon as `pages/<slug>/index.tsx` exists (`pageExtensions`
  ts/tsx/js/jsx). Besides Next.js the repository carries a webpack + Dokka +
  Writerside docs side (`docs/`, `dokka-templates/`, `webpack.config.js`) —
  landing pages never touch it.
- Chrome: `LandingLayout` (`components/landing-layout/landing-layout.tsx`)
  renders `GlobalHeader`, an optional sticky `TopMenu`, the children and
  `GlobalFooter` from `@jetbrains/kotlin-web-site-ui`; props are `title`,
  `description`, `ogImageName`, `dataTestId`, `canonical`, `theme` (default
  `'dark'`), `forceDarkTopMenu`, `hideTopMenu`, `mobileOverview`, `topMenuItems`,
  `topMenuButton`, `topMenuTitle`, `topMenuHomeUrl`, `currentUrl`, `currentTitle`.
  It is never generated and never measured.

## Design system versions

From `yarn.lock` / installed `node_modules` (`project.json.versions`):
`@rescui/typography` 0.24.2, `button` 0.18.0, `card` 0.8.3, `tag` 0.11.3,
`collapse` 0.7.1, `tab-list` 0.11.12, `ui-contexts` 0.5.8, `icons` 1.7.1,
`switcher` 0.12.3; `@webteam/layout` 3.1.1 (installed; one importing file only,
`@webteam/layout` grep over pages/blocks/components/shared = 1);
`@jetbrains/kotlin-web-site-ui` 4.14.9 (the site's own UI kit: `layout-v2`,
`header`, `footer`, `top-menu`, `breakpoints-v2`, `cta-block-v2`,
`quotes-slider`, `youtube-player`, `typography`, `grid`). Contracts are extracted
from `node_modules` into `artifacts/` — read props there, never from memory.
**Unverified:** `artifacts/contracts.json` carries no entry for
`@jetbrains/kotlin-web-site-ui` (grep = 0 on 8 Oct 2026) although
`project.json.contracts.scopes` lists it; read its props off
`node_modules/@jetbrains/kotlin-web-site-ui/out/components/<name>/`.

## Grid and breakpoints

- Column: `ktl-layout-v2 ktl-layout--center`, widths read off
  `node_modules/@jetbrains/kotlin-web-site-ui/out/components/layout-v2/index.css`:
  1144 (>1190), 952 (<=1190), 760 (<=1000), 568 (<=808), 424 (<=640), 312 (<=472).
- Custom media from `.../breakpoints-v2/media.pcss`: `--ktl-{ms,ml,ts,tl,ds}`
  = max-width 472 / 640 / 808 / 1000 / 1190, suffixes `-down` (width <= N),
  `-up`, `-min`, `-only`; `--ktl-dl-only`/`-up` are the desktop side.
  The toolkit's frames 1540/1276/768/360 fall into: >1190, <=1190 (ds),
  <=808 (ts) / <=1000 (tl), <=640 (ml) — `project.json.grid` has the mapping
  (container tokens base 1188/22, lg 996/22, md 612/22, sm 640/24).
- The toolkit emits **no container CSS** (`grid.containerCssFromToolkit: false`):
  the container is the kit's `ktl-layout-v2` class.
- JS hooks in `breakpoints-v2/hooks.js`: `useMS`, `useML`, ... used in 17 files
  (`blocks/state-of-kotlin-2026/hero/hero.tsx`: `useMS() ? 'm' : 'l'`).

## Page anatomy

- Route: `pages/<slug>/index.tsx`, default export a component returning
  `LandingLayout`, plus `export const <X>_TITLE/_URL` constants and optional
  `pages/<slug>/index.module.css` (newest: `pages/state-of-kotlin-2026/`).
- Blocks: `blocks/<page>/<block>/<block>.tsx` + `<block>.module.css`
  (+ `<block>-data.tsx` in older pages: `blocks/compose-multiplatform/hero/`),
  shared pieces of one page in `blocks/<page>/shared/`.
- Copy: inline JSX or string consts / data arrays in the block file or a
  `*-data.tsx`; `&nbsp;` in JSX text; no i18n, no message extraction.
- CSS: camelCase module classes; `@import ".../breakpoints-v2/media.pcss"` as
  first line; raw px and hex are the norm (state-of-kotlin-2026 module css:
  64 hex hits).
- Images: `<img>` with `/images/<page>/...` under `public/` (newest) or a
  co-located import (`blocks/compose-multiplatform/hero/index.tsx`).
- Rhythm: each block's `.wrapper { padding: 72px 0 }`
  (`blocks/state-of-kotlin-2026/questions/questions.module.css`).

## Theme

`LandingLayout` wraps everything in `ThemeProvider` from `@rescui/ui-contexts`;
prop `theme` `'dark'` (default) or `'light'`. state-of-kotlin-2026 and benchmark
are light/hideTopMenu landings; compose-multiplatform is dark and adds an inner
`ThemeProvider theme="dark"`. Tokens: `@jetbrains/kotlin-web-site-ui/out/components/common/index.css`
plus `pages/global.css`; font JetBrains Sans via
`@rescui/typography/lib/font-jb-sans-auto.css`. One theme per landing, no switcher.

## Checks and review process

- `yarn lint` = `next lint` over `blocks`, `components`, `pages`
  (`next.config.js` eslint.dirs); `.eslintrc.json` extends `next/core-web-vitals`
  + `prettier`, turns off `react/no-unescaped-entities`,
  `@next/next/no-page-custom-font`, `@next/next/no-img-element`.
- Types: `yarn exec tsc -- --noEmit -p tsconfig.json`.
- Prettier `.prettierrc.json`: single quotes, tab width 4, print width 120 —
  not enforced by lint.
- Tests: `.ai/guidelines.md` ("CRITICAL ... MUST be followed", `CLAUDE.md`)
  demands tests with each feature; Playwright e2e in `test/e2e/<page>.spec.ts`
  + page object `test/page/<page>-page.ts`; baseURL :3000
  (`playwright.config.ts`); snapshots `test/snapshots/`.
- Branch `ktl-<ticket>-<slug>` style; commits `feat:` / `chore:` / `fix:` /
  `update:` with optional `ktl-NNNN` (`git log`). `CODEOWNERS`:
  `* @JetBrains/kotlinlang-code-reviewer`; `/docs/`, `/data/releases.yml`
  belong to technical writing. **Unverified:** PR template and demo-URL
  convention (`.github/` holds `workflows` only).

## Runtime noise a screenshot must not see

- GTM inline script in `pages/_app.jsx` (GTM-5P98) and Optimizely sync script
  `cdn.optimizely.com` in `pages/_document.jsx` → blocked in
  `project.json.shot.blockRoutes`, optimizely banner hidden by `hideSelectors`.
- `html { scroll-behavior: smooth }` in `pages/global.css` → `reducedMotion` and
  the shot's animation freeze.
- Hydration marker: `components/hydration-event.tsx` adds `html.hydrated` and
  fires `react:hydrated` (the e2e tests wait for it).
- Motion: gsap/lottie/video/parallax appear in `blocks/kotlin-effect/hero-screen`,
  `blocks/main/latest-news/mascot`, `blocks/state-of-kotlin-2026/shared/floating-shape`;
  marquees (`components/marquee`) and `components/sticky-header` on specific
  blocks → `warmupScroll`, reduced motion.
- The sticky top menu (`LandingLayout`, hidden with `hideTopMenu`).
