#!/usr/bin/env bash
#
# Air cloud environment startup for kotlinlang.org (kotlin-web-site).
#
# Runs on every environment launch:
#   * WARMUP run (env-setup companion) - the resulting filesystem is snapshotted,
#     so all expensive, cacheable work below lands in the snapshot and the user's
#     first real task boots warm. The script blocks on `healthcheck` at the end.
#   * TASK run - the same steps are cheap no-ops thanks to the snapshot, the dev
#     server is started in the background and the script returns promptly.
#
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_DIR"

# Node version comes from .nvmrc, yarn version from package.json "packageManager".
NODE_VERSION="$(tr -d ' \tv\r\n' < .nvmrc)"
YARN_VERSION="1.22.22"
NODE_HOME="$HOME/.local/node-v${NODE_VERSION}"
NEXT_PORT=3000
NEXT_LOG=/tmp/next-dev.log

log() { printf '[startup %s] %s\n' "$(date -u +%H:%M:%S)" "$*"; }
fail() { printf '[startup %s] ERROR: %s\n' "$(date -u +%H:%M:%S)" "$*" >&2; exit 1; }

# A real TASK run boots the environment under `dind.sh air-workspace-start.sh`;
# the snapshot-baking WARMUP run in the env-setup companion does not.
_ps="$(ps -ax -o args= 2>/dev/null || true)"
if grep -q 'dind.sh air-workspace-start.sh' <<<"$_ps"; then WARMUP=; else WARMUP=1; fi
log "mode: ${WARMUP:+WARMUP}${WARMUP:-TASK}, repo: $REPO_DIR"

# ---------------------------------------------------------------------------
# 1. Node.js (pinned by .nvmrc) + yarn, installed in userspace (no sudo here).
# ---------------------------------------------------------------------------
if [ ! -x "$NODE_HOME/bin/node" ]; then
    log "installing Node v${NODE_VERSION} into $NODE_HOME"
    tarball="node-v${NODE_VERSION}-linux-x64.tar.gz"   # .tar.gz: xz is not installed
    curl -fsSL --retry 3 --retry-delay 5 \
        -o "/tmp/$tarball" "https://nodejs.org/dist/v${NODE_VERSION}/$tarball" \
        || fail "could not download Node v${NODE_VERSION} from nodejs.org"
    mkdir -p "$NODE_HOME"
    tar -xzf "/tmp/$tarball" -C "$NODE_HOME" --strip-components=1
    rm -f "/tmp/$tarball"
else
    log "Node v${NODE_VERSION} already installed"
fi
export PATH="$NODE_HOME/bin:$PATH"

# Make the pinned toolchain the default for interactive/agent shells too.
PROFILE_MARK='# >>> air kotlin-web-site node toolchain >>>'
for profile in "$HOME/.bashrc" "$HOME/.profile"; do
    [ -e "$profile" ] || : > "$profile"
    if ! grep -qF "$PROFILE_MARK" "$profile"; then
        {
            echo ""
            echo "$PROFILE_MARK"
            echo "export PATH=\"$NODE_HOME/bin:\$PATH\""
            echo '# <<< air kotlin-web-site node toolchain <<<'
        } >> "$profile"
        log "added Node to PATH in $profile"
    fi
done

if [ "$(yarn --version 2>/dev/null || true)" != "$YARN_VERSION" ]; then
    log "installing yarn@${YARN_VERSION}"
    npm install -g "yarn@${YARN_VERSION}" --no-audit --no-fund \
        || fail "could not install yarn@${YARN_VERSION}"
fi
log "node $(node --version), npm $(npm --version), yarn $(yarn --version)"

# ---------------------------------------------------------------------------
# 2. Frontend dependencies.
#
# .npmrc maps the @webteam/* scope to the private JetBrains Space registry
# (packages.jetbrains.team) and authenticates with ${WEBTEAM_UI_NPM_TOKEN};
# yarn refuses to start at all when that variable is unset.
# ---------------------------------------------------------------------------
if [ -z "${WEBTEAM_UI_NPM_TOKEN:-}" ]; then
    fail "WEBTEAM_UI_NPM_TOKEN is not set. It is required by .npmrc to install the
       @webteam/* packages from https://packages.jetbrains.team/npm/p/wt/npm/.
       Add it as a secret to this environment configuration: open
       https://jetbrains.team/p/wt/packages/npm/npm -> Connect -> Generate personal token."
fi

log "yarn install --frozen-lockfile (warms $HOME/.cache/yarn and node_modules)"
if ! yarn install --frozen-lockfile --network-timeout 600000; then
    fail "yarn install failed - see the output above. A 401/403 against
       packages.jetbrains.team means WEBTEAM_UI_NPM_TOKEN is invalid or expired."
fi

# ---------------------------------------------------------------------------
# 3. Generated data + warm build caches (all of this lands in the snapshot).
# ---------------------------------------------------------------------------
log "yarn generate-data"
yarn generate-data

log "priming the Next.js build cache (yarn next-build-static)"
if ! yarn next-build-static; then
    fail "the Next.js static build failed - the environment would not be usable for
       page/component work. See the output above."
fi

log "priming the webpack production build cache (yarn build:production)"
if ! yarn build:production; then
    fail "the webpack production build failed - see the output above."
fi

# Playwright browsers for the e2e/screenshot suites. Best effort: the browser
# download or its system libraries may be unavailable, which must not block
# ordinary page/component development.
if [ ! -d "$HOME/.cache/ms-playwright" ]; then
    log "downloading Playwright chromium (for yarn test:e2e)"
    npx --yes playwright install chromium || log "WARN: playwright browser download failed; run 'npx playwright install' manually before yarn test:e2e"
else
    log "Playwright browsers already cached"
fi

# ---------------------------------------------------------------------------
# 4. Next.js dev server - the UI a task actually looks at, on exposed port 3000.
#    Nothing runtime survives the snapshot, so it is (re)started on every boot.
# ---------------------------------------------------------------------------
start_next_dev() {
    if curl -fsS -o /dev/null --max-time 5 "http://127.0.0.1:${NEXT_PORT}/"; then
        log "something already answers on port ${NEXT_PORT}; not starting another server"
        return 0
    fi
    log "starting 'next dev' on 0.0.0.0:${NEXT_PORT} (log: $NEXT_LOG)"
    # Bind 0.0.0.0 so the exposed port actually serves the app.
    nohup node_modules/.bin/next dev --hostname 0.0.0.0 --port "$NEXT_PORT" \
        > "$NEXT_LOG" 2>&1 &
    NEXT_PID=$!
    log "next dev pid $NEXT_PID"
}

# ---------------------------------------------------------------------------
# 5. Health check: assert the environment really works the way a task needs it
#    to - the pinned toolchain resolves, dependencies are installed, and the dev
#    server actually serves the Kotlin home page. Polls until ready; the outer
#    setup system owns the timeout.
# ---------------------------------------------------------------------------
healthcheck() {
    log "healthcheck: verifying the toolchain"
    [ "$(node --version)" = "v${NODE_VERSION}" ] || { log "healthcheck: node is $(node --version), expected v${NODE_VERSION}"; return 1; }
    [ -x node_modules/.bin/next ] || { log "healthcheck: node_modules/.bin/next is missing"; return 1; }
    [ -x node_modules/.bin/playwright ] || { log "healthcheck: node_modules/.bin/playwright is missing"; return 1; }
    [ -f public/data/universities.json ] || { log "healthcheck: generated data (public/data/universities.json) is missing"; return 1; }
    [ -f out/index.html ] || { log "healthcheck: the Next.js static export (out/index.html) is missing"; return 1; }

    log "healthcheck: waiting for 'next dev' to serve http://127.0.0.1:${NEXT_PORT}/"
    local waited=0 body
    while true; do
        if [ -n "${NEXT_PID:-}" ] && ! kill -0 "$NEXT_PID" 2>/dev/null; then
            log "healthcheck: the next dev process exited. Last lines of $NEXT_LOG:"
            tail -40 "$NEXT_LOG" >&2 || true
            return 1
        fi
        body="$(curl -fsS --max-time 20 "http://127.0.0.1:${NEXT_PORT}/" 2>/dev/null || true)"
        if grep -qi 'kotlin' <<<"$body"; then
            log "healthcheck: home page served after ${waited}s"
            break
        fi
        if [ -n "$body" ]; then
            log "healthcheck: port ${NEXT_PORT} answered but the page does not mention Kotlin yet (${waited}s)"
        else
            log "healthcheck: still compiling / not answering yet (${waited}s)"
        fi
        sleep 10
        waited=$((waited + 10))
    done

    # A second route, so we know routing and not just the root page works.
    if ! curl -fsS -o /dev/null --max-time 60 "http://127.0.0.1:${NEXT_PORT}/community/"; then
        log "healthcheck: /community/ did not render. Last lines of $NEXT_LOG:"
        tail -40 "$NEXT_LOG" >&2 || true
        return 1
    fi
    log "healthcheck: OK - dev server serves / and /community/ on port ${NEXT_PORT}"
}

start_next_dev

if [ -n "${WARMUP:-}" ]; then
    healthcheck
else
    log "task mode: dev server is warming up in the background on port ${NEXT_PORT}"
fi

log "startup complete"
