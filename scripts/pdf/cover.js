/**
 * Book cover handling for PDF generation
 */

const fs = require('fs');
const path = require('path');

const pdfFolder = path.join(__dirname, '..', '..', 'pdf');

/**
 * Copy cover assets (like logo) to the output directory
 * Returns a cleanup function to remove them after PDF generation
 */
function copyCoverAssets(targetDir) {
  const assets = ['kotlin-logo.png'];
  const copiedFiles = [];

  for (const asset of assets) {
    const src = path.join(pdfFolder, asset);
    const dest = path.join(targetDir, asset);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      copiedFiles.push(dest);
      console.log(`Copied ${asset} to ${targetDir}`);
    }
  }

  // Return cleanup function
  return () => {
    for (const file of copiedFiles) {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`Cleaned up ${path.basename(file)}`);
      }
    }
  };
}

/**
 * Transform book cover HTML with version number
 */
function transformBookCover(coverPath, data) {
  const content = fs.readFileSync(coverPath, 'utf8');
  const version = data.releases.latest.version;

  // Read and inline the cover styles
  const stylesPath = path.join(pdfFolder, 'styles.css');
  const coverStyles = fs.readFileSync(stylesPath, 'utf8');

  // Replace version placeholder and add inlined styles
  let transformed = content.replace(
    /<span class="version">.*?<\/span>/,
    `<span class="version">${version}</span>`
  );

  // Replace the external stylesheet link with inlined styles
  transformed = transformed.replace(
    /<link rel="stylesheet" href="styles.css">/,
    `<style>${coverStyles}</style>`
  );

  // Keep the logo path as-is - the file will be copied to the output directory
  return transformed;
}

module.exports = { copyCoverAssets, transformBookCover };
