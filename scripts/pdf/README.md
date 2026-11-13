# PDF Generation

Generates a PDF version of the Kotlin documentation using Node.js and Vivliostyle CLI.

## Quick Start

```bash
# Full pipeline
npm run generate-pdf

# Individual steps
npm run generate-pdf:html     # Step 1: Generate combined HTML
npm run generate-pdf:convert  # Step 2: Convert to PDF
```

### Fast Testing Mode

For quick iteration, you can generate PDF from a single page using the `TEST_FILE` environment variable:

```bash
TEST_FILE=docs/your-page.html npm run generate-pdf
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

**"Source file not found"**: Run `npm run generate-pdf:html` first.

**Blank PDF**: Ensure `npm run build` completed and `dist/docs/` has content.
