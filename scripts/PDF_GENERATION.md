# PDF Generation

This document describes the PDF generation process for the Kotlin documentation.

## Overview

The PDF generation is a **two-step process** implemented in Node.js:

1. **Step 1**: Generate `pdf.html` from documentation files (TypeScript)
2. **Step 2**: Convert `pdf.html` to final PDF (Node.js + Vivliostyle CLI)

## Quick Start

```bash
# Run the complete pipeline (both steps)
yarn generate-pdf

# Or run individual steps:
yarn generate-pdf:html     # Step 1 only
yarn generate-pdf:convert  # Step 2 only (requires pdf.html from step 1)
```

## Project Structure

```
scripts/
├── pdf/                    # Step 2: PDF conversion modules
│   ├── toc.js             # ToC generation using cheerio
│   ├── highlight.js       # Server-side Prism syntax highlighting
│   └── cover.js           # Cover page handling
├── dist/
│   ├── pdf/               # Step 1: HTML generation (TypeScript)
│   │   ├── index.ts       # Main orchestration
│   │   ├── task.ts        # HTML transformation logic
│   │   └── lib.ts         # Helper functions
│   └── lib/               # Shared libraries (used by multiple tools)
└── generate-pdf.js        # Step 2: Main entry point

pdf/                        # CSS and assets
├── page-setup.css         # Page size, margins, footer
├── toc.css                # ToC styling with page numbers
├── prism.css              # Syntax highlighting colors
├── webhelp.css            # Content styling
├── book-cover.html        # Cover page template
├── styles.css             # Cover styles
└── kotlin-logo.png        # Logo for cover
```

## How It Works

### Step 1: HTML Generation (`scripts/dist/pdf/`)

- Reads the documentation table of contents from `HelpTOC.json`
- Processes each documentation page in parallel using worker threads
- Transforms the HTML content:
  - Fixes internal links to work within a single document
  - Converts YouTube embeds to static images
  - Adjusts IDs for proper anchoring
  - Cleans up navigation elements
- Combines all pages into a single `dist/docs/pdf.html` file

### Step 2: PDF Conversion (`scripts/generate-pdf.js`)

The main script coordinates several modules:

1. **Syntax highlighting** - Prism.js runs server-side to highlight code blocks
2. **ToC generation** - Extracts H1/H2 headings using cheerio
3. **Cover preparation** - Transforms cover HTML with current Kotlin version
4. **PDF generation** - Uses Vivliostyle CLI with external stylesheets

Vivliostyle CLI is invoked with:
- `-s A4` for page size
- `-t 1800` for 30-minute timeout (large documents)
- CSS is inlined in the HTML `<head>` for reliability

## Output

The final PDF is generated at: **`assets/kotlin-reference.pdf`**

## Requirements

- Node.js 18+
- Yarn
- Dev dependencies (automatically installed):
  - `@vivliostyle/cli` - PDF generation with CSS Paged Media support
  - `cheerio` - HTML parsing for ToC generation
  - `js-yaml` - Reading YAML data files

## Key Features

1. **Native CSS Paged Media** - Vivliostyle supports CSS Paged Media spec
2. **ToC with page numbers** - Via `target-counter()` and `leader()` CSS functions
3. **Automatic ToC** - Generated from H1 and H2 headings in the HTML
4. **Server-side syntax highlighting** - Prism.js runs in Node.js (avoids browser memory issues)
5. **Large document support** - 30-minute timeout for 2500+ page documents

## CSS Architecture

Stylesheets are inlined in the HTML `<head>` for reliable rendering:

| File | Purpose |
|------|---------|
| `page-setup.css` | @page rules, margins, footer page numbers |
| `toc.css` | ToC styling with `target-counter()` for page numbers |
| `prism.css` | Syntax highlighting colors |
| `webhelp.css` | Main content styling |

## Troubleshooting

### Error: Source file not found

If you see: `Source file not found: dist/docs/pdf.html`

**Solution**: Run step 1 first:
```bash
yarn generate-pdf:html
```

### PDF is blank or incomplete

**Solution**: Check that:
1. The build completed successfully (`yarn build`)
2. Documentation files exist in `dist/docs/`

### Fonts don't look right

**Solution**:
- On macOS: System fonts should work automatically
- On Linux CI: Playwright includes its own fonts

### CSS styles missing

If the PDF is missing styles:
1. Ensure CSS files exist in `pdf/` folder
2. Check that paths are correct in `generate-pdf.js`
