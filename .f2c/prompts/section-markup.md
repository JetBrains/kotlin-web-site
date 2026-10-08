# Section markup brief · kotlinlang.org

The body of the brief an orchestrator hands a markup agent for ONE section of
a page built into this project. **Do not paste this file by itself**: run
`node scripts/section-brief.mjs <project root>/.f2c/pages/<page>` and paste
the generated `pages/<page>/briefs/NN-role.md`, which wraps this body with the
section's own facts (manifest record, per-frame dump facts, paths, commands)
and the project's rules and catalog verbatim — an agent gets complete
instructions, never "read file X".

The body below is a template. `section-brief.mjs` fills `{{page}}` (the page
name), `{{pageDir}}` (the page record's absolute path), `{{project}}` (the
project root), `{{toolkit}}` (the toolkit root), `{{route}}` (the route under
the pages root), `{{livePath}}`, `{{title}}`, and prepends a **Reference**
block from `pages/<page>/reuse.json` when the section has a tier-B reference.
Write the project's own body under the line: where things are, what to read
first, the rules that bind the agent, the loop (format → measure → fix → gate),
the reply format. `rules.md` and `components.md` are appended verbatim — do not
repeat them here.

---

You write ONE section of {{title}} inside the consumer project at `{{project}}`
(kotlinlang.org, Next.js 14 pages router, CSS Modules). The scaffold already
exists; you fill in the inside of its block, its data file and its stylesheet.
Nothing else. Model for background agents: Sonnet 5.5; one section per agent,
its own preview route.

## Where things are

- Toolkit (inputs, rules, measurement): `{{toolkit}}`
- Project (output; `.f2c/` holds the rules, the catalog and the page record): `{{project}}`
- The page record: `{{pageDir}}` (`manifest.json`, `context/<NN-role>.gen.tsx`
  and `context/<bp>/…`, `crops/<NN-role>.png`, `assets/`)
- Your block, in the project: `blocks/{{page}}/<slug>/` with
  `<slug>.tsx`, `<slug>.module.css`, `<slug>-data.tsx` (+ images under
  `public/images/{{page}}/`). The route module `pages/{{route}}/index.tsx`
  and the preview route `pages/{{route}}/preview/<slug>/index.tsx` already
  import it; do not edit them.
- The mock, verbatim: `{{pageDir}}/context/<NN-role>.gen.tsx` (a
  `get_design_context` dump: Tailwind-like classes with Figma variable refs,
  `data-node-id`s, verbatim copy, `const img… = "<url>"` assets — the vendored
  files are `{{pageDir}}/assets/<NN>-<ref>.<ext>`).
- The section record: `{{pageDir}}/manifest.json` → `sections[]` entry (copy
  list, colour deviations, asset refs, **annotations**).
- The reference render: `{{pageDir}}/crops/<NN-role>.png` (1540 wide).
- **Breakpoint frames, mandatory**: the twin DUMPS are
  `{{pageDir}}/context/lg/<NN-role>.gen.tsx` (1276), `context/md/…` (768) and
  `context/sm/…` (360) — they are the spec for every width: which blocks stack
  and in what order, what becomes a carousel, button sizes, text roles that
  switch, image sizes. Read all four dumps BEFORE writing the base markup. The
  frame widths map to this project's media like so: 1276 → `--ktl-ds-down`
  (<=1190), 768 → `--ktl-ts-down` (<=808), 360 → `--ktl-ml-down` (<=640) /
  `--ktl-ms-down` (<=472); use the query at which the dump's structure changes
  (`--ktl-tl-down` 1000 when it changes between 1276 and 768).

## Read first, in this order

1. `{{project}}/.f2c/README.md` (precedence) and `rules.md` R1–R12: the project
   wins over the toolkit; R2 (rhythm), R4 (css), R5 (copy), R6 (images), R7
   (interaction), R8 (a11y/testid), R12 (missing content).
2. `{{project}}/.f2c/components.md` — what to use for what; the "Interaction
   references" table when the manifest carries an annotation.
3. The living example of the shape: `blocks/state-of-kotlin-2026/` (newest
   landing, Sep 2026) — read `questions/questions.tsx` + `questions.module.css`
   (a block with grid, cards, hover, breakpoints), `shared/section-heading/`,
   `faq/faq.tsx` (accordion) and `hero/hero.tsx` (h1, Button, `useMS`).
   Nothing under `blocks/{{page}}/` is an example: it is the scaffold you fill in.
4. Existence and props: `{{project}}/.f2c/artifacts/INDEX.md`, then
   `contracts.json`; for `@jetbrains/kotlin-web-site-ui` read
   `{{project}}/node_modules/@jetbrains/kotlin-web-site-ui/out/components/<name>/`.
   Never write a prop from memory.

## Rules that bind you

- **Copy verbatim** from the dump — never reworded, never re-cased; plain
  strings or JSX, `&nbsp;` where the dump holds a non-breaking space, `<br />`
  where it breaks a line. No i18n.
- **Annotations first**: if the manifest entry has `annotations`, resolve the
  reference to project code (components.md → Interaction references) and build
  that behaviour; the annotated element is the spec, the crop is one state. No
  annotation and the element looks animated: a designer question, not a guess.
- **Structure from the dump, not from the crop**: the dump's flex/gap/padding
  and its `--typography/*` refs name the roles (`text1` → `rs-text-1`, `h1` →
  `rs-h1`, `sub2` → `rs-subtitle-2`, `h3` → `rs-h3`, hero → `rs-hero` /
  `rs-super-hero`); a Button/Collapse/Tag/Switcher instance is the rescui
  component, never plain markup. Button size from the dump's padding (`size="l"`
  tall, `m`, `s`) and per breakpoint where the frames differ.
- **Root**: `<section className={styles.wrapper} id="<slug>" data-testid="{{page}}-<slug>">`
  exactly as scaffolded; one `h1` per page (only if this is the hero), section
  titles `h2` + `textCn('rs-h1')`; **no nested `<section>`** carrying a
  `data-testid` (the e2e spec counts `section[data-testid]`).
- **Layout**: inside the page's `ktl-layout-v2` column (widths 1144 / 952 / 760
  / 568 / 424 / 312). Grids are CSS grid/flex in the module; the block fills the
  column, no own `max-width`/`margin: auto` for the container. Rhythm is the
  block's `.wrapper` padding (the scaffold wrote the mock's gap above it); no
  external vertical margins.
- **CSS**: camelCase module classes; line 1 `@import
  "@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2/media.pcss";`;
  media blocks wide → narrow (`--ktl-ds-down`, `--ktl-tl-down`, `--ktl-ts-down`,
  `--ktl-ml-down`, `--ktl-ms-down`). Raw px and hex are accepted here: write the
  mock's values for the page's theme; `--ktl-box-*` tokens where they match
  (24/32/48, 64/72/96); a role at a narrow width is overridden through the
  role's variable (`--rs-h1-font-size-mobile`), never a bare `font-size`.
- **Cards**: plain `div`s (or `cardCn`) in a CSS grid with `grid-auto-rows: 1fr`;
  never a mock-derived row height; `min-height` only for a card the mock keeps
  taller than its content at every width.
- **Images**: copy the vendored file from `{{pageDir}}/assets/` to
  `public/images/{{page}}/`, use `<img src="/images/{{page}}/<file>" alt width height>`;
  never `next/image`. Check `public/images/companies/` and
  `public/images/case-studies/` for a logo before vendoring one. An element the
  project has no asset for (a product screenshot, a video) is a recorded gap, not
  an imitation (R12).
- **Theme**: ONE, the page's (`LandingLayout theme` is already set by the
  scaffold). No `ThemeProvider` unless the mock draws an island of the other theme.
- **Missing content (R12)**: a repeated block the mock draws once is built with
  the full mechanism and the content repeated or a placeholder that says it is
  one; list the gaps as designer questions.
- **Decor** the mock draws behind an element is positioned relative to that
  element, `aria-hidden`/`alt=""`; no motion the mock or an annotation does not state.
- **Never** edit `page.json`, `manifest.json`, the dumps, `pages/{{route}}/index.tsx`,
  the preview route, another block's folder, `components/`, `pages/_app.jsx`,
  `pages/global.css`, `package.json`, or anything under `{{toolkit}}/app`. Never
  restart the dev server (`yarn start`, :3000; it picks your edits up).
- Toolkit discipline that still applies: `min-height`, never `height`, on
  text-bearing blocks; no hand-set `font-size`/`line-height` on system text; a
  mock value the design system cannot express is a recorded deviation in a
  comment, not a new token.

## Loop

1. Read the dump and the crop; write the data file, the tsx, the module css.
2. Format and lint your folder (node 22 via nvm):
   `source ~/.nvm/nvm.sh && nvm use 22 && cd {{project}} && yarn lint --dir blocks/{{page}}/<slug> && yarn exec prettier --write "blocks/{{page}}/<slug>/**/*.{ts,tsx,css}"`
   — prettier is not enforced by lint but the project's style is 4 spaces, 120,
   single quotes; the orchestrator's gate is `project-check.mjs --only=lint,types`
   (types are whole-project and may be red on a sibling's in-progress file).
3. Before measuring, `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000{{livePath}}`;
   if it is not 200, a sibling's half-edited block is breaking the page — wait
   30 s and retry up to 10 times, then report the file named in the error and stop.
   Measure: `cd {{toolkit}}/app && node scripts/measure.mjs {{pageDir}} --live --no-scores <NN-role>`
   (`--no-scores`: other agents measure in parallel) and read the line: `score`,
   `Δh` (render − crop height), `y₁div` (first differing row). Render and diff are
   `{{pageDir}}/renders/<NN-role>.png` / `.diff.png`.
4. Fix structure and geometry from what the diff shows: wrong role, missing
   element, wrong column count, wrong gap. Stop when what remains is glyph
   rasterization and 1–2 px line shifts (the noise floor), or after **3 measure
   rounds** — never chase pixels.
5. Check every breakpoint against its DUMP:
   `cd {{toolkit}}/app && node scripts/bp-structure.mjs {{pageDir}} --live --only=<NN-role>`
   opens your preview route at 1276 / 768 / 360 and prints `ok` or `FAIL` per
   width (section height ±3 %, blocks stacked or side by side, buttons, no
   horizontal scroll); `--expected` prints the derived structure. Fix until every
   width is `ok`; a height difference explained by text reflow alone is reported,
   not chased. Look at `shot.mjs … 768|360 '[data-testid="{{page}}-<slug>"]' --base-url=http://localhost:3000 --project={{project}}`
   next to the frame.
6. **e2e expectation** (the deliverable per `.ai/guidelines.md`, written by the
   orchestrator after finalize, but you make it possible): the section is found
   by `getByTestId('{{page}}-<slug>')`, its title/CTA by role and text; add
   `data-testid="{{page}}-<slug>-<part>"` only on a part a spec has to query
   (title, primary CTA); anchors (`id`) are unique and match the in-page links.

## Reply (nothing else)

- score, rounds used, Δh at the end
- heights at 1540 / 1276 / 768 / 360 vs the frames
- files written (paths)
- deviations recorded (colour, px, role) and where
- **questions for the designer** — an animated element with no annotation, a
  hidden variant, a missing asset (screenshot, video, logo), missing content
  repeated under R12; "none" if none
- what cost you the most time
