#!/usr/bin/env node

/**
 * PDF Generation - Step 2: Convert HTML to PDF
 *
 * This script takes the pre-generated pdf.html file (created by scripts/dist/pdf/index.ts)
 * and converts it to a final PDF using Vivliostyle CLI.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const YAML = require('yaml');

// Import PDF modules
const { initPrism, applyCodeHighlighting } = require('./highlight');
const { copyCoverAssets, transformBookCover } = require('./cover');
const { generateTocHtml } = require('./toc');
const { addTitleLabels } = require('./labels');
const { convertTabTitlesToElements } = require('./tab-titles');

const rootFolder = path.join(__dirname, '..', '..');
const pdfFolder = path.join(rootFolder, 'pdf');
const pdfSourcePath = path.join(rootFolder, 'dist', 'docs');
const dataFolder = path.join(rootFolder, 'data');
const assetsFolder = path.join(rootFolder, 'assets');
const pdfFontsFolder = path.join(pdfFolder, 'fonts');

/**
 * Load site data from YAML files
 */
function loadSiteData() {
  const data = {};
  const files = fs.readdirSync(dataFolder);

  for (const file of files) {
    if (file.startsWith('_') || !file.endsWith('.yml')) {
      continue;
    }

    const filePath = path.join(dataFolder, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(file, '.yml');
    data[fileName] = YAML.parse(content);
  }

  return data;
}

/**
 * Read CSS file content
 */
function readCssFile(filename) {
  const filePath = path.join(pdfFolder, filename);
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Copy fonts to the output directory for Vivliostyle
 * Returns a cleanup function to remove the copied fonts
 */
function copyFonts(targetDir) {
  const targetFontsDir = path.join(targetDir, 'fonts');

  // Copy fonts directory recursively
  fs.cpSync(pdfFontsFolder, targetFontsDir, { recursive: true });
  console.log(`Copied fonts to ${targetFontsDir}`);

  // Return cleanup function
  return () => {
    if (fs.existsSync(targetFontsDir)) {
      fs.rmSync(targetFontsDir, { recursive: true });
      console.log('Cleaned up fonts directory');
    }
  };
}

/**
 * Fix broken image links in HTML content
 */
function fixImageLinks(content) {
  // Fix image links that start with images/https://
  content = content.replace(
    /src="images\/(https?:\/\/[^"]+)"/g,
    (match, url) => {
      console.log(`Fix image link "images/${url}"`);
      return `src="${url}"`;
    }
  );
  content = content.replace(
    /data-dark-src="images\/(https?:\/\/[^"]+)"/g,
    (match, url) => `data-dark-src="${url}"`
  );
  return content;
}

/**
 * Generate PDF using Vivliostyle CLI
 */
async function generatePDF(outputName, data) {
  console.log('Starting PDF generation (Step 2)...');

  const sourceFilePath = path.join(pdfSourcePath, 'pdf.html');
  const outputFilePath = path.join(assetsFolder, outputName);
  const coverPath = path.join(pdfFolder, 'book-cover.html');

  // Ensure assets folder exists
  if (!fs.existsSync(assetsFolder)) {
    fs.mkdirSync(assetsFolder, { recursive: true });
  }

  // Check if source file exists (should be created by Step 1)
  if (!fs.existsSync(sourceFilePath)) {
    throw new Error(
      `Source file not found: ${sourceFilePath}\n` +
      `Please run step 1 first: yarn generate-pdf:html`
    );
  }

  // Copy cover assets (like logo) to the output directory
  console.log('Copying cover assets...');
  const cleanupAssets = copyCoverAssets(pdfSourcePath);

  // Copy fonts to the output directory for Vivliostyle
  console.log('Copying fonts...');
  const cleanupFonts = copyFonts(pdfSourcePath);

  // Initialize Prism for server-side syntax highlighting
  console.log('Initializing Prism for syntax highlighting...');
  const Prism = initPrism();
  const languages = Object.keys(Prism.languages || {})
    .filter(k => k !== 'extend' && k !== 'insertBefore' && k !== 'DFS');
  console.log(`Prism loaded with languages: ${languages.join(', ')}`);

  // Transform cover (with inlined styles)
  console.log('Preparing cover...');
  const coverHtml = transformBookCover(coverPath, data);

  // Read raw content for ToC extraction and transformation
  console.log('Reading source content...');
  let rawContent = fs.readFileSync(sourceFilePath, 'utf8');

  // Apply syntax highlighting to code blocks server-side
  console.log('Applying syntax highlighting to code blocks...');
  rawContent = applyCodeHighlighting(rawContent, Prism);

  // Fix broken image links
  rawContent = fixImageLinks(rawContent);

  // Convert tab titles from pseudo-elements to real elements for better page breaking
  console.log('Converting tab titles to DOM elements...');
  rawContent = convertTabTitlesToElements(rawContent);

  // Add title labels (EAP, Beta, Experimental, etc.) based on data-label-id attributes
  console.log('Adding title labels...');
  rawContent = addTitleLabels(rawContent);

  // Generate Table of Contents from H1 and H2 headings in the HTML
  console.log('Generating Table of Contents from HTML headings...');
  const tocHtml = generateTocHtml(rawContent);

  // Read all CSS files to inline them
  const pageSetupCss = readCssFile('page-setup.css');
  const tocCss = readCssFile('toc.css');
  const prismCss = readCssFile('prism.css');
  const webhelpCss = readCssFile('webhelp.css');

  // Read fonts CSS (uses relative paths to fonts/ directory)
  const fontsCss = readCssFile('fonts.css');

  // Combine cover, ToC, and content with all styles inlined
  const combinedHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
${fontsCss}
  </style>
  <style>
${pageSetupCss}
  </style>
  <style>
${tocCss}
  </style>
  <style>
${prismCss}
  </style>
  <style>
${webhelpCss}
  </style>
</head>
<body>
  <div class="cover-page">${coverHtml}</div>
  ${tocHtml}
  ${rawContent}
</body>
</html>`;

  // Write combined HTML to a temporary file in dist/docs/ folder
  const tempHtmlPath = path.join(pdfSourcePath, '_combined-pdf.html');
  fs.writeFileSync(tempHtmlPath, combinedHtml, 'utf8');

  console.log('Running Vivliostyle CLI to generate PDF...');
  console.log(`Input: ${tempHtmlPath}`);
  console.log(`Output: ${outputFilePath}`);

  try {
    const vivliostylePath = path.join(rootFolder, 'node_modules', '.bin', 'vivliostyle');

    // Use extended timeout for large documents (2500+ pages)
    // -t/--timeout: timeout in seconds (default 300, using 1800 = 30 minutes)
    const cmd = `"${vivliostylePath}" build "${tempHtmlPath}" -o "${outputFilePath}" -s A4 -t 1800`;

    execSync(cmd, {
      stdio: 'inherit',
      cwd: pdfSourcePath,
      env: {
        ...process.env,
        NODE_OPTIONS: '--max-old-space-size=8192'
      }
    });

    console.log(`PDF generated successfully: ${outputFilePath}`);
  } finally {
    // Cleanup temporary file
    if (fs.existsSync(tempHtmlPath)) {
      fs.unlinkSync(tempHtmlPath);
    }
    // Cleanup copied assets and fonts
    cleanupAssets();
    cleanupFonts();
  }

  return outputFilePath;
}

/**
 * Main execution
 */
async function main() {
  try {
    const siteData = loadSiteData();
    await generatePDF('kotlin-reference.pdf', siteData);
    console.log('PDF generation completed successfully!');
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generatePDF, loadSiteData };
