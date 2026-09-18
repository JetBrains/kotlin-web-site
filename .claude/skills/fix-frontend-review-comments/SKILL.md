---
name: fix-frontend-review-comments
description: Apply pull-request review comments to the frontend of kotlinlang.org (Next.js, React,
  TypeScript, CSS Modules under blocks/, components/, pages/, hooks/, utils/, test/). Use when asked
  to fix, address, or apply reviewer comments on a PR, or when an automation feeds in review threads
  to resolve. Covers fetching unresolved threads with gh, the in-scope/out-of-scope path fence,
  the project conventions from .ai/guidelines.md, the lint / tsc / Playwright gates, committing, and
  the machine-readable report the automation parses. Not for docs/, data/, or .teamcity/ comments.
---

# Fix frontend review comments

The full instructions live in [`.ai/prompts/fix-frontend-review-comments.md`](../../../.ai/prompts/fix-frontend-review-comments.md).
That file is the source of truth and is also injected verbatim by CI automation, so this skill and
the automated runs behave identically.

**Read that file now and follow it exactly.** Do not paraphrase it from memory.

Inputs it expects (pass whatever the user gave you; the rest have safe defaults):

- `PR_NUMBER` or `PR_URL` — required.
- `REVIEW_COMMENTS` — pre-supplied threads; if absent, the prompt fetches unresolved threads via
  `gh api graphql`.
- `COMMENT_IDS` — restrict the run to specific threads.
- `ALLOW_PUSH`, `ALLOW_REPLY` — default `false`. When a human invokes this skill interactively,
  leave them off unless they explicitly ask you to push or to reply on GitHub.

Two things worth restating because they are the usual failure modes:

- `.ai/guidelines.md` is binding for every edit.
- Out-of-scope paths (`docs/`, `data/**`, `redirects/`, `.teamcity/`, `.github/`, `scripts/`,
  dependency versions) are escalated in the report, never edited.
