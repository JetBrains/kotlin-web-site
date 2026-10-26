# Project layer · kotlinlang.org

The Figma-to-code toolkit's **project layer** for this repository, created
2026-10-08 by `project-setup.mjs`. Everything the toolkit must know about *this*
project to write a page its reviewers accept, and the text record of every page
it generated here. The project owns this directory; the toolkit reads it and
generates into the project (toolkit PLAN decision 25). Layout contract:
`projects/F2C-LAYOUT.md` in the toolkit.

| file | what it is | who reads it |
|---|---|---|
| `project.json` | the machine-readable facts: paths, commands, dev server, shot policy, versions, grid, output conventions | every toolkit script that touches this project (`measure --live`, `shot`, the emitter, `finalize`, `project-check`, `project-index`) |
| `profile.md` | facts read from the repository, dated: stack, versions, grid, page anatomy, review process | a human before the first page; the source of the other files |
| `rules.md` | the generator's rules for code written into the pages root, each with an example path in the project | the agent before the first line of page code (inlined into every section brief) |
| `components.md` | what to use for what: the component catalog with usage counts, the lint checklist, the interaction references | the agent while mapping a mock instance to code (inlined into every section brief) |
| `setup.md` | install, run one page, shoot it deterministically, run the project's checks on it; §5 is the log of engine changes the project forced | the operator on day one |
| `prompts/section-markup.md` | the body of the per-section markup brief, a `{{page}}` / `{{route}}` template | `section-brief.mjs` |
| `template/` | the emitter's templates (`*.tpl`, `{{placeholder}}` substitution): the route page, the composition, the page css, the section quartet, the preview route | `emit-project-page.mjs` |
| `artifacts/` | generated, gitignored: `contracts.json` + `INDEX.md` (prop contracts from this repository's `node_modules`), `sections-index.json` (section units for reuse matching) | the agent for existence and props; `reuse-match.mjs` |
| `pages/<page>/` | one record per page generated here: `page.json`, segmentation, manifest, layout, reuse verdicts, provenance, notes, briefs (text, committed); dumps, crops, assets, renders (gitignored, cached locally) | every toolkit script, by path: `node scripts/<x>.mjs <root>/.f2c/pages/<page>` |

## Precedence

0. The ticket: deviations agreed in the YouTrack ticket and its linked design
   ticket, and the content documents it links (`rules.md` R13). They outrank
   the mock; the mock outranks nothing on this list.
1. The project's own instructions: `CLAUDE.md` → `.ai/guidelines.md` ("MUST be
   followed at all times": a Playwright test per feature, semantic selectors
   role > text > testid, CSS Modules) and its lint config (`.eslintrc.json`,
   `.prettierrc.json`) — they are executable and they are what the reviewer sees.
2. The project's shipped landings, **newest first**: `pages/state-of-kotlin-2026`
   + `blocks/state-of-kotlin-2026` (Sep 2026), then `pages/benchmark`, then
   `pages/compose-multiplatform` / `multiplatform`. When prose and a shipped page
   disagree, the page wins; when two pages disagree, the newer wins. **Except
   when the work changes a shipped page**: then that page's own blocks are the
   convention, and the change is made in place (`rules.md` R1a).
3. `rules.md` / `components.md` here — a distillation of 1 and 2, dated 8 Oct 2026
   at `38512ffcb9`.
4. The toolkit's own rules (`.claude/skills/rescui-design/`) — they apply to
   what the project leaves open (text roles, `min-height` on text, no hand-set
   system text sizes), and they are the toolkit's discipline, not the project's
   acceptance bar. In particular this project accepts raw px and hex in module
   css and has no i18n; the toolkit's no-raw-px and Lingui-like habits do not
   transfer.

## This project in four lines

Next.js 14 pages router, static export, CSS Modules + PostCSS custom-media,
React 18, yarn 1, no i18n. A landing = `pages/<slug>/index.tsx` (LandingLayout
+ `ktl-layout-v2`) + `blocks/<slug>/<block>/{<block>.tsx, <block>.module.css,
<block>-data.tsx}` + `test/e2e/<slug>.spec.ts`. Grid and breakpoints are the
site kit's (`@jetbrains/kotlin-web-site-ui`, `--ktl-*-down`), not
`@webteam/layout`. Branch `figma-to-code` is the toolkit's experiment; the
project's own branches are `ktl-<ticket>-<slug>`.

## What this layer is not

Not a universal adapter. It is one project, read once, dated. Facts here go
stale with the project's commits; `profile.md` and `project.json.readAt` state
the commit they were read at, and a second `project-setup.mjs` run reports the
drift.
