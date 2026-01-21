# Redirect Generation

## Description

The `generate-redirect-pages.js` script generates static HTML files for redirects based on YAML files from the `redirects/` folder.

## Usage

### Automatic during build
The script automatically runs as part of the build process:
```bash
yarn build
```

### Manual run
```bash
yarn generate-redirects
# or
node scripts/generate-redirect-pages.js
```

## How it works

1. The script reads all `.yml` files from the `redirects/` folder
2. For each redirect, it creates an HTML file with a triple redirect mechanism:
   - `<noscript>` with meta refresh (for cases without JavaScript)
   - JavaScript redirect preserving the URL hash part
   - Meta refresh with 1-second delay (fallback option)

3. File placement:
   - `/old-page` → `out/old-page/index.html`
   - `/old-page/` → `out/old-page/index.html`
   - `/old-page.html` → `out/old-page.html`

4. The script does NOT overwrite files created by Next.js

## YAML file format

```yaml
# Single redirect
- from: /old-url
  to: /new-url

# Multiple sources
- from:
    - /old-url-1
    - /old-url-2
  to: /target-url
```
