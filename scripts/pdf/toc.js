/**
 * Table of Contents generation for PDF
 *
 * Uses cheerio for HTML parsing instead of regex for better reliability.
 */

const cheerio = require('cheerio');

/**
 * Extract headings from HTML content using cheerio
 * Returns Map of h1Id -> { title, h2s: [{id, title}] }
 */
function extractHeadingsFromHtml(htmlContent) {
  const $ = cheerio.load(htmlContent);
  const h1Headings = new Map();
  const h2Headings = new Map();

  // Extract H1 headings
  $('h1[id]').each((_, el) => {
    const id = $(el).attr('id');
    const title = $(el).text().trim();

    if (title) {
      h1Headings.set(id, { title, h2s: [] });
    }
  });

  // Extract H2 headings and associate with parent H1
  $('h2[id]').each((_, el) => {
    const id = $(el).attr('id');
    const title = $(el).text().trim();

    if (!title) return;

    // Find parent H1 by checking if H2 ID starts with H1 ID prefix
    // H2 IDs look like: "getting-started.md-install-kotlin"
    // H1 IDs look like: "getting-started.md"
    for (const [h1Id, h1Data] of h1Headings) {
      if (id.startsWith(h1Id + '-')) {
        h1Data.h2s.push({ id, title });
        h2Headings.set(id, { title, parentPageId: h1Id });
        break;
      }
    }
  });

  return { h1Headings, h2Headings };
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate Table of Contents HTML from H1 and H2 headings
 * CSS styles are loaded via Vivliostyle --style option (pdf/toc.css)
 */
function generateTocHtml(htmlContent) {
  const { h1Headings, h2Headings } = extractHeadingsFromHtml(htmlContent);

  console.log(`Found ${h1Headings.size} H1 headings and ${h2Headings.size} H2 headings in HTML content`);

  // Generate ToC from H1 and H2 headings (CSS loaded externally via --style)
  let tocHtml = `
    <div class="book-toc">
      <h1 class="book-toc-title">Table of Contents</h1>
      <ol class="book-toc-list">
  `;

  for (const [id, h1Data] of h1Headings) {
    tocHtml += `
      <li class="book-toc-item level_0">
        <div class="book-toc-item-inner">
          <a class="book-toc-item-title" href="#${id}">${escapeHtml(h1Data.title)}</a>
        </div>
    `;

    // Add H2 subheadings
    if (h1Data.h2s && h1Data.h2s.length > 0) {
      tocHtml += '<ol class="book-toc-list">';
      for (const h2 of h1Data.h2s) {
        tocHtml += `
          <li class="book-toc-item level_1">
            <div class="book-toc-item-inner">
              <a class="book-toc-item-title" href="#${h2.id}">${escapeHtml(h2.title)}</a>
            </div>
          </li>
        `;
      }
      tocHtml += '</ol>';
    }

    tocHtml += '</li>';
  }

  tocHtml += `
      </ol>
    </div>
  `;

  return tocHtml;
}

module.exports = { generateTocHtml, extractHeadingsFromHtml };
