#!/usr/bin/env node
'use strict';

/**
 * npm `postinstall` hook.
 *
 * 1. Rebuilds the vendored codemirror bundle
 * 2. When the private `@webteam/*` optional dependencies were omitted, generates stub packages
 * 3. Generates the gitignored site data (public/data/*.json) from data/*.yml
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { STUB_VERSION } = require('./stub-version');

const ROOT = path.resolve(__dirname, '..');
const NODE_MODULES = path.join(ROOT, 'node_modules');
const WEBTEAM_SCOPE_DIR = path.join(NODE_MODULES, '@webteam');
const STUBS_SCOPE_DIR = path.join(ROOT, 'webteamui-stubs', '@webteam');
const GENERATOR = path.join(ROOT, 'scripts', 'generate-webteam-stubs.js');
const GENERATE_DATA_SCRIPT = path.join(ROOT, 'scripts', 'generate-data.mjs');

function fail(message) {
    console.error('ERROR (postinstall): ' + message);
    process.exit(1);
}

function buildCodemirror() {
    const codemirrorDir = path.join(NODE_MODULES, 'codemirror');
    if (!fs.existsSync(codemirrorDir)) {
        fail('node_modules/codemirror not found — install dependencies first.');
    }
    const rollupBin = path.join(NODE_MODULES, 'rollup', 'dist', 'bin', 'rollup');
    if (!fs.existsSync(rollupBin)) {
        fail(`rollup binary not found: ${rollupBin}`);
    }
    const result = spawnSync(process.execPath, [rollupBin, '-c'], {
        cwd: codemirrorDir,
        stdio: 'inherit',
    });
    if (result.status !== 0) {
        fail(`Building node_modules/codemirror failed with code ${result.status}.`);
    }
}

function isStubPackage(dir) {
    try {
        const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8'));
        return pkg.version === STUB_VERSION;
    } catch {
        return false;
    }
}

function realWebteamPackagesInstalled() {
    if (!fs.existsSync(WEBTEAM_SCOPE_DIR)) return false;
    return fs.readdirSync(WEBTEAM_SCOPE_DIR).some((name) => {
        const dir = path.join(WEBTEAM_SCOPE_DIR, name);
        return fs.existsSync(path.join(dir, 'package.json')) && !isStubPackage(dir);
    });
}

function installWebteamStubs() {
    const generatorResult = spawnSync(process.execPath, [GENERATOR], { stdio: 'inherit' });
    if (generatorResult.status !== 0) {
        fail(`Generating @webteam/* stubs failed with code ${generatorResult.status}.`);
    }
    if (!fs.existsSync(STUBS_SCOPE_DIR)) {
        fail('No stub packages were generated — cannot substitute @webteam/* dependencies.');
    }

    fs.mkdirSync(WEBTEAM_SCOPE_DIR, { recursive: true });
    let copied = 0;
    for (const name of fs.readdirSync(STUBS_SCOPE_DIR)) {
        const target = path.join(WEBTEAM_SCOPE_DIR, name);
        // Never overwrite a real package; always refresh a stale stub.
        if (fs.existsSync(target) && !isStubPackage(target)) continue;
        fs.rmSync(target, { recursive: true, force: true });
        fs.cpSync(path.join(STUBS_SCOPE_DIR, name), target, { recursive: true });
        copied++;
    }
    console.log(
        `Installed/refreshed ${copied} @webteam/* stub package(s) in node_modules — ` +
            'webteam-ui-backed blocks render as placeholders. ' +
            'For the full UI, JetBrains team members can run `npm ci` with WEBTEAM_UI_NPM_TOKEN set.'
    );
}

function generateSiteData() {
    const result = spawnSync(process.execPath, [GENERATE_DATA_SCRIPT], {
        cwd: ROOT,
        stdio: 'inherit',
    });
    if (result.status !== 0) {
        fail(`Generating site data failed with code ${result.status}.`);
    }
}

function main() {
    if (process.env.npm_config_package_lock_only === 'true') {
        console.log('package-lock-only mode: skipping postinstall work.');
        return;
    }

    buildCodemirror();

    if (realWebteamPackagesInstalled()) {
        console.log('Real @webteam/* packages found — skipping external stubs.');
    } else {
        installWebteamStubs();
    }

    generateSiteData();
}

main();
