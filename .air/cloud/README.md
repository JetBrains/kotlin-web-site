# JetBrains Air cloud environment

[`startup.sh`](startup.sh) prepares a cloud environment for this repository. JetBrains Air runs it
after cloning the repository and before the agent session starts, on **every** environment launch —
the first start, every resume, and every start from a snapshot. See
[Environments](https://www.jetbrains.com/help/air/configure-environments.html#cloud_startup_script)
in the Air documentation.

## What the script does

1. Installs and activates the Node version from [`.nvmrc`](../../.nvmrc) (`v22.9.0`, the same major
   version as the `node:22` image used on CI) via `nvm`.
2. Activates the yarn release pinned by the `packageManager` field in
   [`package.json`](../../package.json) (`1.22.22`).
3. Writes `~/.air-kotlinlang-env.sh` and sources it from `~/.bashrc` and `~/.profile`, so the agent
   session gets the same Node and yarn, plus `WEBTEAM_UI_NPM_TOKEN`. The script runs in a separate
   process, so exports made in it are not inherited by the agent — this file is the way across.
   `~/.profile` is hooked as well because the stock Ubuntu `~/.bashrc` returns early in
   non-interactive shells.

   The token has to be forwarded explicitly, because the agent needs to run `yarn` itself and
   [`.npmrc`](../../.npmrc) interpolates `${WEBTEAM_UI_NPM_TOKEN}` — yarn aborts with
   `Failed to replace env in config` when the variable is absent, so a token stored anywhere other
   than the environment does not help. The file is rewritten from scratch on every launch and holds
   mode `600`; because it is rewritten rather than appended to, resuming a task cannot accumulate
   duplicate entries or leave a stale token behind.
4. Runs `yarn install --frozen-lockfile`, then `yarn generate-data` to produce the gitignored
   `public/data/` JSON.
5. Downloads the Playwright Chromium browser, the default project in
   [`playwright.config.ts`](../../playwright.config.ts).

Site builds are deliberately left out: `yarn next-build-static` and `yarn build:production` take
minutes and would be paid again on every resume. Run them from the task when they are needed.

Each step is skipped when its work is already done, and a failing step never aborts the rest —
Air starts the agent even if the script exits non-zero. Look for the `[air-startup]` prefix in the
environment logs.

## Required environment configuration

The script cannot supply any of the following. Set them up in **Settings | Environments** at
[air.jetbrains.cloud](https://air.jetbrains.cloud) before running a cloud task, and note that
changes only apply to newly created cloud tasks.

### Environment variables

| Name | Type | Purpose |
|---|---|---|
| `WEBTEAM_UI_NPM_TOKEN` | Personal secret | Space token for `packages.jetbrains.team`. [`.npmrc`](../../.npmrc) points the `@webteam` scope there, and the registry rejects anonymous requests, so `yarn install` fails without it. Generate it at [jetbrains.team → Packages → npm](https://jetbrains.team/p/wt/packages/npm/npm) → **Connect** → **Generate personal token**. |
| `AIR_SKIP_PLAYWRIGHT` | Environment variable | Optional. Set to `1` to skip the Playwright browser download and start faster. |

### Internet access

Use **Trusted domains** and add these under **Additional domains** — they are not part of the
preset:

```
packages.jetbrains.team
cdn.playwright.dev
*.azureedge.net
```

The preset already covers `npmjs.com`, `yarnpkg.com`, `nodejs.org`, `github.com` and
`githubusercontent.com`, which the Node and yarn setup relies on.

### VM size

**Medium** (4 CPU / 16 GB RAM / 30 GB disk) or larger. The Next.js build is memory-hungry; pick
**Large** for tasks that build the whole site.

## Notes

- Custom Docker images are not supported for cloud environments yet, and `.air/docker.json` is not
  used by them.
- The repository checkout is shallow — it contains only the latest commit.
