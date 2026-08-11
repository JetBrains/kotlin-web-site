#!/usr/bin/env bash
#
# Air cloud environment startup for kotlinlang.org (kotlin-web-site).
#
# The same script runs in two modes:
#   * WARMUP (env-setup companion) - the resulting filesystem is snapshotted, so all
#     the expensive, cacheable work below (Node toolchain, node_modules, yarn cache,
#     Next.js build cache, Playwright browsers) lands in the snapshot. The script
#     blocks on `healthcheck` at the end so those artifacts are complete.
#   * TASK - everything above is already on disk, so the steps are near no-ops; the
#     Next.js dev server is started in the background and the script returns promptly.
#
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_DIR"

NODE_VERSION="$(tr -d ' \tv\r\n' < .nvmrc)"          # .nvmrc pins the Node version
YARN_VERSION="1.22.22"                               # package.json "packageManager"
NODE_HOME="$HOME/.local/node-v${NODE_VERSION}"
BROWSER_SYSROOT="$HOME/.local/browser-sysroot"       # userspace libs for Playwright
ENV_FILE="$HOME/.air-kotlin-web-site-env.sh"         # sourced by interactive shells
NEXT_PORT=3000
NEXT_LOG=/tmp/next-dev.log

log() { printf '[startup %s] %s\n' "$(date -u +%H:%M:%S)" "$*"; }
warn() { printf '[startup %s] WARN: %s\n' "$(date -u +%H:%M:%S)" "$*"; }
fail() { printf '[startup %s] ERROR: %s\n' "$(date -u +%H:%M:%S)" "$*" >&2; exit 1; }

# A real TASK run boots the environment under `dind.sh air-workspace-start.sh`; the
# snapshot-baking WARMUP run in the env-setup companion does not.
_ps="$(ps -ax -o args= 2>/dev/null || true)"
if grep -q 'dind.sh air-workspace-start.sh' <<<"$_ps"; then WARMUP=; else WARMUP=1; fi
log "mode: $([ -n "${WARMUP:-}" ] && echo WARMUP || echo TASK), repo: $REPO_DIR"

# ---------------------------------------------------------------------------
# 1. Node.js (pinned by .nvmrc) + yarn. sudo is password-gated here, so
#    everything is installed under $HOME.
# ---------------------------------------------------------------------------
if [ ! -x "$NODE_HOME/bin/node" ]; then
    log "installing Node v${NODE_VERSION} into $NODE_HOME"
    # .tar.gz, not .tar.xz: xz is not available in this image.
    tarball="node-v${NODE_VERSION}-linux-x64.tar.gz"
    curl -fsSL --retry 3 --retry-delay 5 -o "/tmp/$tarball" \
        "https://nodejs.org/dist/v${NODE_VERSION}/$tarball" \
        || fail "could not download Node v${NODE_VERSION} from nodejs.org"
    mkdir -p "$NODE_HOME"
    tar -xzf "/tmp/$tarball" -C "$NODE_HOME" --strip-components=1
    rm -f "/tmp/$tarball"
else
    log "Node v${NODE_VERSION} already installed"
fi
export PATH="$NODE_HOME/bin:$PATH"

if [ "$(yarn --version 2>/dev/null || true)" != "$YARN_VERSION" ]; then
    log "installing yarn@${YARN_VERSION}"
    npm install -g "yarn@${YARN_VERSION}" --no-audit --no-fund \
        || fail "could not install yarn@${YARN_VERSION}"
fi
log "node $(node --version), npm $(npm --version), yarn $(yarn --version)"

# ---------------------------------------------------------------------------
# 2. Frontend dependencies.
#
#    .npmrc maps the @webteam/* scope to the private JetBrains Space registry
#    (packages.jetbrains.team) and authenticates with ${WEBTEAM_UI_NPM_TOKEN};
#    yarn aborts immediately when that variable is not set at all.
# ---------------------------------------------------------------------------
if [ -z "${WEBTEAM_UI_NPM_TOKEN:-}" ]; then
    fail "WEBTEAM_UI_NPM_TOKEN is not set. .npmrc needs it to install the @webteam/*
       packages from https://packages.jetbrains.team/npm/p/wt/npm/. Add it as a secret
       to this environment configuration: open
       https://jetbrains.team/p/wt/packages/npm/npm -> Connect -> Generate personal token."
fi

log "yarn install --frozen-lockfile (populates node_modules and $HOME/.cache/yarn)"
if ! yarn install --frozen-lockfile --network-timeout 600000; then
    fail "yarn install failed - see the output above. A 401/403 against
       packages.jetbrains.team means WEBTEAM_UI_NPM_TOKEN is invalid or expired;
       generate a fresh token in Space and update the secret."
fi

# ---------------------------------------------------------------------------
# 3. Generated data + warm build caches. All of this ends up in the snapshot.
# ---------------------------------------------------------------------------
log "yarn generate-data"
yarn generate-data

log "yarn build:production (webpack bundles for the non-Next.js part of the site)"
if ! yarn build:production; then
    fail "the webpack production build failed - see the output above."
fi

# `next build` compiles every page (which is what warms .next/cache) and then
# statically exports them. The export of /grammar always fails locally because
# grammar.xml is a TeamCity artifact that is not in the repository, so this step
# is best effort: the compile output we care about is already cached by then.
log "priming the Next.js build cache (yarn next-build-static)"
if yarn next-build-static; then
    log "Next.js static export complete (out/)"
else
    warn "yarn next-build-static did not finish. This is expected without the external
       TeamCity artifacts (for example /grammar needs grammar.xml, and the WebHelp
       pages under /docs need dist/); the Next.js build cache is still primed and
       'next dev' serves the pages normally."
fi

# ---------------------------------------------------------------------------
# 4. Playwright (test/e2e, test/production) - browsers plus the shared libraries
#    Chromium needs. `playwright install-deps` would need root, so the .debs are
#    unpacked into a userspace sysroot and exposed via LD_LIBRARY_PATH instead.
#    Best effort: page/component development must not depend on it.
# ---------------------------------------------------------------------------
BROWSER_LIB_PKGS="libasound2t64 libatk-bridge2.0-0t64 libatk1.0-0t64 libatspi2.0-0t64
    libcairo2 libcairo-gobject2 libcups2t64 libdbus-1-3 libdrm2 libepoxy0 libfontconfig1
    libfreetype6 libgbm1 libgdk-pixbuf-2.0-0 libgl1 libgl1-mesa-dri libglib2.0-0t64
    libglvnd0 libglx0 libgtk-3-0t64 libharfbuzz0b libnotify4 libnspr4 libnss3
    libpango-1.0-0 libpangocairo-1.0-0 libvulkan1 libwayland-client0 libwayland-egl1
    libwayland-server0 libx11-6 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6
    libxfixes3 libxi6 libxinerama1 libxkbcommon0 libxrandr2 libxrender1 libxshmfence1
    libxtst6 fonts-liberation fonts-dejavu-core"

install_browser_sysroot() {
    local aptdir="$HOME/.local/aptwork" aptopts uris deb
    mkdir -p "$aptdir/lists/partial" "$aptdir/cache/archives/partial" "$aptdir/debs" "$BROWSER_SYSROOT"
    aptopts="-o Dir::State::Lists=$aptdir/lists -o Dir::Cache=$aptdir/cache
        -o Dir::Cache::Archives=$aptdir/cache/archives -o Debug::NoLocking=1
        -o APT::Sandbox::User=root"

    log "refreshing the apt index (userspace, no packages are installed system-wide)"
    apt-get $aptopts update -qq >/dev/null 2>&1 || true

    uris="$aptdir/uris.txt"
    : > "$uris"
    local pkg out
    for pkg in $BROWSER_LIB_PKGS; do
        # Per package, so one unavailable name cannot void the whole resolution.
        out="$(apt-get $aptopts install --reinstall --print-uris -y --no-install-recommends "$pkg" 2>/dev/null \
              | grep -oE "^'http[^']+'" | tr -d "'")"
        if [ -z "$out" ]; then warn "apt has no candidate for $pkg - skipped"; else printf '%s\n' "$out" >> "$uris"; fi
    done
    sort -u "$uris" -o "$uris"
    [ -s "$uris" ] || { warn "could not resolve any browser library packages"; return 1; }

    log "downloading $(wc -l < "$uris") library packages and unpacking them into $BROWSER_SYSROOT"
    ( cd "$aptdir/debs"
      while read -r u; do
          deb="$(basename "$u")"
          [ -f "$deb" ] || curl -fsSL --retry 3 --retry-delay 3 -O "$u" || warn "download failed: $deb"
      done < "$uris"
      for deb in *.deb; do dpkg-deb -x "$deb" "$BROWSER_SYSROOT" 2>/dev/null || warn "unpack failed: $deb"; done )

    # fontconfig only scans well-known font directories, so publish the fonts there;
    # without this Chromium renders pages with no text at all.
    mkdir -p "$HOME/.local/share/fonts"
    cp -rn "$BROWSER_SYSROOT/usr/share/fonts/." "$HOME/.local/share/fonts/" 2>/dev/null || true
    rm -rf "$aptdir/debs" "$aptdir/cache"
}

export LD_LIBRARY_PATH="$BROWSER_SYSROOT/usr/lib/x86_64-linux-gnu:$BROWSER_SYSROOT/lib/x86_64-linux-gnu:$BROWSER_SYSROOT/usr/lib:${LD_LIBRARY_PATH:-}"
export FONTCONFIG_PATH="$BROWSER_SYSROOT/etc/fonts"

if [ ! -d "$BROWSER_SYSROOT/usr/lib/x86_64-linux-gnu" ]; then
    install_browser_sysroot || warn "browser libraries were not installed; 'yarn test:e2e' will not be able to launch Chromium"
else
    log "browser libraries already unpacked in $BROWSER_SYSROOT"
fi

if [ ! -d "$HOME/.cache/ms-playwright" ]; then
    log "downloading the Playwright browsers (for yarn test:e2e)"
    npx --yes playwright install chromium \
        || warn "the Playwright browser download failed; run 'npx playwright install chromium' before yarn test:e2e"
else
    log "Playwright browsers already cached"
fi

# Give interactive/agent shells the same toolchain and browser environment.
cat > "$ENV_FILE" <<EOF
# Generated by .air/cloud/startup.sh - environment for kotlin-web-site.
export PATH="$NODE_HOME/bin:\$PATH"
# Playwright's Chromium needs these userspace libraries and fonts (no root available).
export LD_LIBRARY_PATH="$BROWSER_SYSROOT/usr/lib/x86_64-linux-gnu:$BROWSER_SYSROOT/lib/x86_64-linux-gnu:$BROWSER_SYSROOT/usr/lib:\${LD_LIBRARY_PATH:-}"
export FONTCONFIG_PATH="$BROWSER_SYSROOT/etc/fonts"
EOF
for profile in "$HOME/.bashrc" "$HOME/.profile"; do
    [ -e "$profile" ] || : > "$profile"
    if ! grep -qF "$ENV_FILE" "$profile"; then
        printf '\n# kotlin-web-site cloud environment (see .air/cloud/startup.sh)\n[ -f "%s" ] && . "%s"\n' \
            "$ENV_FILE" "$ENV_FILE" >> "$profile"
        log "wired $ENV_FILE into $profile"
    fi
done

# ---------------------------------------------------------------------------
# 5. The Next.js dev server - the UI a task actually looks at. Nothing runtime
#    survives the snapshot, so it is (re)started on every boot, bound to 0.0.0.0
#    so the exposed port 3000 really serves it.
# ---------------------------------------------------------------------------
NEXT_PID=
start_next_dev() {
    if curl -fsS -o /dev/null --max-time 5 "http://127.0.0.1:${NEXT_PORT}/"; then
        log "something already answers on port ${NEXT_PORT}; not starting a second server"
        return 0
    fi
    log "starting 'next dev' on 0.0.0.0:${NEXT_PORT} (log: $NEXT_LOG)"
    nohup node_modules/.bin/next dev --hostname 0.0.0.0 --port "$NEXT_PORT" > "$NEXT_LOG" 2>&1 &
    NEXT_PID=$!
    log "next dev pid $NEXT_PID"
}

# ---------------------------------------------------------------------------
# 6. Health check - assert the environment works the way a task needs it to:
#    the pinned toolchain resolves, dependencies and generated data are in place,
#    and the dev server really renders site pages. Polls until ready; the outer
#    setup system owns the timeout.
# ---------------------------------------------------------------------------
healthcheck() {
    log "healthcheck: checking the toolchain and the installed tree"
    [ "$(node --version)" = "v${NODE_VERSION}" ] \
        || { log "healthcheck: node is $(node --version), expected v${NODE_VERSION}"; return 1; }
    [ "$(yarn --version)" = "$YARN_VERSION" ] \
        || { log "healthcheck: yarn is $(yarn --version), expected $YARN_VERSION"; return 1; }
    [ -x node_modules/.bin/next ] || { log "healthcheck: node_modules/.bin/next is missing"; return 1; }
    [ -x node_modules/.bin/playwright ] || { log "healthcheck: node_modules/.bin/playwright is missing"; return 1; }
    [ -d node_modules/@webteam/article ] \
        || { log "healthcheck: @webteam/* packages are missing - the private registry install did not complete"; return 1; }
    [ -f public/data/universities.json ] \
        || { log "healthcheck: generated data (public/data/universities.json) is missing"; return 1; }
    [ -d dist ] || { log "healthcheck: the webpack output (dist/) is missing"; return 1; }

    log "healthcheck: waiting for 'next dev' to render http://127.0.0.1:${NEXT_PORT}/"
    local waited=0 body
    while true; do
        if [ -n "${NEXT_PID:-}" ] && ! kill -0 "$NEXT_PID" 2>/dev/null; then
            log "healthcheck: the 'next dev' process exited. Last lines of $NEXT_LOG:"
            tail -40 "$NEXT_LOG" >&2 || true
            return 1
        fi
        body="$(curl -fsS --max-time 120 "http://127.0.0.1:${NEXT_PORT}/" 2>/dev/null || true)"
        if grep -q '<title>Kotlin Programming Language</title>' <<<"$body"; then
            log "healthcheck: the home page rendered after ${waited}s"
            break
        fi
        if [ -n "$body" ]; then
            log "healthcheck: port ${NEXT_PORT} answers but the home page is not ready yet (${waited}s)"
        else
            log "healthcheck: still compiling / not answering yet (${waited}s)"
        fi
        sleep 10
        waited=$((waited + 10))
    done

    # A second route, so we know page routing works and not just the root page.
    log "healthcheck: rendering /community/"
    if ! curl -fsS --max-time 240 "http://127.0.0.1:${NEXT_PORT}/community/" | grep -q '<title>Community</title>'; then
        log "healthcheck: /community/ did not render. Last lines of $NEXT_LOG:"
        tail -40 "$NEXT_LOG" >&2 || true
        return 1
    fi

    # Non-fatal: report whether the e2e browser can actually start here.
    if node -e "require('playwright').chromium.launch().then(b=>b.close()).then(()=>console.log('ok'),e=>{console.error(String(e).split('\n')[0]);process.exit(1)})" >/dev/null 2>&1; then
        log "healthcheck: Playwright Chromium launches (yarn test:e2e is usable)"
    else
        warn "Playwright Chromium could not be launched; 'yarn test:e2e' may need 'npx playwright install chromium'"
    fi

    log "healthcheck: OK - dev server serves / and /community/ on port ${NEXT_PORT}"
}

start_next_dev

if [ -n "${WARMUP:-}" ]; then
    healthcheck
else
    log "task mode: 'next dev' is warming up in the background on port ${NEXT_PORT} (log: $NEXT_LOG)"
fi

log "startup complete"
