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

const viteConfigPath = resolve('vite.config.ts');

if (!existsSync(viteConfigPath)) {
  console.error('Error: vite.config.ts not found');
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
  // Handle defineConfig({ ... }) pattern
  if (content.match(/defineConfig\s*\(\s*\{/)) {
    content = content.replace(
      /defineConfig\s*\(\s*\{/,
      `defineConfig({\n  base: '${basePath}',`
    );
  }
  // Handle defineConfig(() => ({ ... })) pattern
  else if (content.match(/defineConfig\s*\([^)]*\)\s*=>\s*\(\s*\{/)) {
    content = content.replace(
      /defineConfig\s*\(([^)]*)\)\s*=>\s*\(\s*\{/,
      `defineConfig($1) => ({\n  base: '${basePath}',`
    );
  }
  else {
    console.error('Error: Could not find defineConfig pattern to patch');
    process.exit(1);
  }
}

writeFileSync(viteConfigPath, content, 'utf-8');

console.log(`Successfully patched ${viteConfigPath} with base: '${basePath}'`);

// Patch BrowserRouter basename
const appFile = 'src/App.tsx';

if (existsSync(appFile)) {
  console.log(`Checking ${appFile} for BrowserRouter...`);
  let sourceContent = readFileSync(appFile, 'utf-8');

  if (sourceContent.includes('BrowserRouter')) {
    console.log(`Found BrowserRouter in ${appFile}, patching...`);
    sourceContent = sourceContent.replace(
      /<BrowserRouter\s*>/g,
      `<BrowserRouter basename="${basePath}">`
    );
    writeFileSync(appFile, sourceContent, 'utf-8');
    console.log(`Successfully patched BrowserRouter in ${appFile} with basename: '${basePath}'`);
  } else {
    console.log('Note: No BrowserRouter found in App.tsx');
  }
} else {
  console.log('Note: src/App.tsx not found');
}

