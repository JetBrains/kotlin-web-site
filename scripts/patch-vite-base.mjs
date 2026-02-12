#!/usr/bin/env node

/**
 * Patches Vite config to add the correct base path for deployment.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const landingName = process.argv[2];

if (!landingName) {
  console.error('Error: Landing name is required');
  process.exit(1);
}

const configFiles = ['vite.config.ts', 'vite.config.js', 'vite.config.mjs'];
let viteConfigPath = null;

for (const configFile of configFiles) {
  if (existsSync(configFile)) {
    viteConfigPath = resolve(configFile);
    break;
  }
}

if (!viteConfigPath) {
  console.error('Error: No vite config file found (checked: vite.config.ts, vite.config.js, vite.config.mjs)');
  process.exit(1);
}

console.log(`Found Vite config: ${viteConfigPath}`);

let content = readFileSync(viteConfigPath, 'utf-8');

const basePath = `/lp/${landingName}/`;

if (content.includes('base:')) {
  console.log('Base path already exists, replacing...');
  content = content.replace(
    /base\s*:\s*['"`][^'"`]*['"`]/g,
    `base: '${basePath}'`
  );
} else {
  console.log('Adding base path to config...');
  content = content.replace(
    /defineConfig\s*\(\s*\{/,
    `defineConfig({\n  base: '${basePath}',`
  );
}

writeFileSync(viteConfigPath, content, 'utf-8');

console.log(`Successfully patched ${viteConfigPath} with base: '${basePath}'`);

