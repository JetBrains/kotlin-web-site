#!/usr/bin/env bash
#
# JetBrains Air runs this script in the cloud environment after it clones the
# repository and before the agent starts working on the task:
# https://www.jetbrains.com/help/air/configure-environments.html#cloud_startup_script
#
# Air re-runs it on *every* environment launch — the first start, every resume,
# and every start from a snapshot — so each step below is guarded and safe to
# repeat. A non-zero exit does not stop the task, so the script never aborts on
# a failed step either: a partially provisioned environment beats none.
#
# The following cannot be provided by this script and must be set in
# Settings | Environments at https://air.jetbrains.cloud:
#
#   WEBTEAM_UI_NPM_TOKEN   Space token for packages.jetbrains.team, required by
#                          .npmrc for the @webteam/* dependencies
#   Internet access        Trusted domains, plus these additional domains:
#                          packages.jetbrains.team, cdn.playwright.dev, *.azureedge.net
#   VM size                Medium (4 CPU / 16 GB) or larger
#
# Optional flags:
#   AIR_SKIP_PLAYWRIGHT=1  skip the Playwright browser download
#
# See .air/cloud/README.md for details.

set -u

AGENT_ENV_FILE="$HOME/.air-kotlinlang-env.sh"

log() { printf '[air-startup] %s\n' "$*"; }
warn() { printf '[air-startup][warn] %s\n' "$*" >&2; }

# Air starts the script in the project root; resolve it anyway so the script
# also works when invoked by hand from somewhere else.
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT" || exit 0

NODE_VERSION="$(tr -d '[:space:]' < .nvmrc 2>/dev/null)"
NODE_VERSION="${NODE_VERSION:-v22.9.0}"

find_nvm_sh() {
    local dir
    for dir in "${NVM_DIR:-}" /usr/local/nvm "$HOME/.nvm"; do
        if [ -n "$dir" ] && [ -s "$dir/nvm.sh" ]; then
            printf '%s' "$dir/nvm.sh"
            return 0
        fi
    done
    return 1
}

# Pin Node to the version in .nvmrc, matching the node:22 image used by CI.
setup_node() {
    local nvm_sh nvm_root

    if ! nvm_sh="$(find_nvm_sh)"; then
        log "nvm not found, installing it into $HOME/.nvm"
        curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh |
            PROFILE=/dev/null bash >/dev/null 2>&1
        nvm_sh="$(find_nvm_sh)" || {
            warn "nvm unavailable, keeping system node $(node -v 2>/dev/null || echo 'not found')"
            return 1
        }
    fi

    # Install versions under $HOME when the shared nvm directory is not ours to
    # write to; nvm.sh itself can still be sourced from there.
    nvm_root="$(dirname "$nvm_sh")"
    if [ -w "$nvm_root" ]; then
        NVM_DIR="$nvm_root"
    else
        NVM_DIR="$HOME/.nvm"
        mkdir -p "$NVM_DIR"
    fi
    export NVM_DIR

    # nvm.sh exits non-zero when it has no default version to activate, so check
    # that the function is defined instead of trusting its exit code.
    # shellcheck disable=SC1090
    . "$nvm_sh" >/dev/null 2>&1
    if ! command -v nvm >/dev/null 2>&1; then
        warn "could not load nvm from $nvm_sh"
        return 1
    fi

    if nvm ls "$NODE_VERSION" >/dev/null 2>&1; then
        log "node $NODE_VERSION already installed"
    else
        log "installing node $NODE_VERSION"
        nvm install "$NODE_VERSION" >/dev/null || {
            warn "could not install node $NODE_VERSION"
            return 1
        }
    fi

    nvm use "$NODE_VERSION" >/dev/null || return 1
    nvm alias default "$NODE_VERSION" >/dev/null 2>&1
    log "node $(node -v), npm $(npm -v)"
}

# Activate the yarn release pinned by the packageManager field in package.json.
setup_yarn() {
    local spec version

    spec="$(node -p "require('./package.json').packageManager || ''" 2>/dev/null)"
    spec="${spec%%+*}"
    [ -n "$spec" ] || spec='yarn@1.22.22'
    version="${spec#*@}"

    if [ "$(yarn --version 2>/dev/null)" = "$version" ]; then
        log "yarn $version already active"
        return 0
    fi

    if command -v corepack >/dev/null 2>&1; then
        corepack enable >/dev/null 2>&1
        corepack prepare "$spec" --activate >/dev/null 2>&1
        if [ "$(yarn --version 2>/dev/null)" = "$version" ]; then
            log "yarn $version activated via corepack"
            return 0
        fi
        # Corepack installs yarn lazily from registry.yarnpkg.com, so its shims
        # are useless when that host is unreachable. Remove them before falling
        # back, otherwise they shadow the yarn npm is about to install.
        corepack disable >/dev/null 2>&1
        warn "corepack could not activate $spec, falling back to npm"
    fi

    npm install -g "$spec" >/dev/null 2>&1
    if [ "$(yarn --version 2>/dev/null)" = "$version" ]; then
        log "yarn $version installed via npm"
        return 0
    fi

    warn "could not provide yarn $version"
    return 1
}

# The script runs in its own process, so exports here never reach the agent.
# Everything the agent session needs goes into a file sourced from ~/.bashrc.
write_agent_env() {
    local node_bin
    node_bin="$(command -v node 2>/dev/null)"
    node_bin="${node_bin:+$(dirname "$node_bin")}"

    {
        echo '# Generated by .air/cloud/startup.sh - rewritten on every environment launch.'
        echo "export NVM_DIR=\"${NVM_DIR:-$HOME/.nvm}\""
        echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" --no-use'
        if [ -n "$node_bin" ]; then
            # A plain PATH export, so non-interactive shells get the right node
            # too, without having to call the nvm function.
            echo "case \":\$PATH:\" in"
            echo "    *\":$node_bin:\"*) ;;"
            echo "    *) export PATH=\"$node_bin:\$PATH\" ;;"
            echo "esac"
        fi
        echo 'export NEXT_TELEMETRY_DISABLED=1'
    } > "$AGENT_ENV_FILE"

    # ~/.bashrc is the channel the Air documentation prescribes, but the stock
    # Ubuntu one returns early for non-interactive shells, so hook ~/.profile
    # too when it exists. Both hooks are appended only when they are not there
    # yet, so resuming a task does not pile up duplicate entries.
    local rc_file
    for rc_file in "$HOME/.bashrc" "$HOME/.profile"; do
        [ -f "$rc_file" ] || [ "$rc_file" = "$HOME/.bashrc" ] || continue
        grep -qF "$AGENT_ENV_FILE" "$rc_file" 2>/dev/null && continue
        printf '\n# Added by .air/cloud/startup.sh\n. "%s"\n' "$AGENT_ENV_FILE" >> "$rc_file"
    done
    log "agent environment written to $AGENT_ENV_FILE"
}

# yarn skips the work when node_modules is already up to date, which covers
# resumed tasks and snapshots.
install_dependencies() {
    local rc

    log "installing dependencies"
    yarn install --frozen-lockfile
    rc=$?
    if [ $rc -eq 0 ]; then
        log "dependencies are up to date"
        return 0
    fi

    warn "yarn install failed with exit code $rc"
    warn "'Failed to replace env in config' means WEBTEAM_UI_NPM_TOKEN is not set in the environment configuration; a 401 from packages.jetbrains.team means its value is no longer valid"
    return $rc
}

# Produces the gitignored public/data/*.json the site reads at runtime.
generate_data() {
    if yarn generate-data >/dev/null; then
        log "site data generated"
    else
        warn "yarn generate-data failed"
    fi
}

# Chromium is the default project in playwright.config.ts and the only browser
# the e2e suite needs by default.
install_playwright_browsers() {
    if [ "${AIR_SKIP_PLAYWRIGHT:-0}" = "1" ]; then
        log "AIR_SKIP_PLAYWRIGHT=1, skipping browser download"
        return 0
    fi

    if compgen -G "$HOME/.cache/ms-playwright/chromium-*" >/dev/null 2>&1; then
        log "playwright chromium already installed"
        return 0
    fi

    log "installing playwright chromium"
    if sudo -n true 2>/dev/null; then
        yarn playwright install --with-deps chromium >/dev/null && return 0
    else
        yarn playwright install chromium >/dev/null && return 0
    fi

    warn "could not install playwright browsers; run 'yarn playwright install chromium' when a task needs them"
}

main() {
    log "setting up $PROJECT_ROOT"

    setup_node || warn "continuing with the node version provided by the image"
    setup_yarn
    write_agent_env

    if install_dependencies; then
        generate_data
        install_playwright_browsers
    else
        warn "skipping data generation and browser install because dependencies are missing"
    fi

    log "startup finished"
}

main
exit 0
