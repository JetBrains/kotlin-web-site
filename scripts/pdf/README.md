# PDF Generation

Generates a PDF version of the Kotlin documentation using Node.js and Vivliostyle CLI.

## Quick Start

```bash
# Full pipeline
yarn generate-pdf

# Individual steps
yarn generate-pdf:html     # Step 1: Generate combined HTML
yarn generate-pdf:convert  # Step 2: Convert to PDF
```

### Fast Testing Mode

For quick iteration, you can generate PDF from a single page by editing `scripts/dist/pdf/index.ts`:

```typescript
const TEST_SINGLE_FILE = true;
const TEST_FILE = 'docs/your-page.html';
```

This reduces generation time from ~5 minutes to seconds.

**Output**: `assets/kotlin-reference.pdf`

## How It Works

1. **Step 1** (`scripts/dist/pdf/`): Combines all documentation pages into `dist/docs/pdf.html`
2. **Step 2** (`scripts/pdf/generate-pdf.js`): Converts HTML to PDF with Vivliostyle

Step 2 includes:
- Server-side syntax highlighting (Prism.js)
- ToC generation from H1/H2 headings
- Title labels (EAP, Beta, Experimental)
- Cover page with Kotlin version

## Project Structure

```
scripts/pdf/
├── generate-pdf.js   # Main entry point
├── toc.js            # ToC generation
├── highlight.js      # Syntax highlighting
├── cover.js          # Cover page
└── labels.js         # Title labels (EAP, Beta, etc.)

pdf/
├── webhelp.css       # Content styling
├── toc.css           # ToC styling
├── page-setup.css    # Page size, margins
├── prism.css         # Code highlighting
├── fonts.css         # Font definitions
├── fonts/            # Local font files
└── book-cover.html   # Cover template
```

## Troubleshooting

**"Source file not found"**: Run `yarn generate-pdf:html` first.

**Blank PDF**: Ensure `yarn build` completed and `dist/docs/` has content.
