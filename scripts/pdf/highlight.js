/**
 * Server-side syntax highlighting using Prism.js
 *
 * Note: Client-side Prism causes browser memory issues on large documents (2500+ pages)
 * so we run Prism server-side using Node.js vm module.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const pdfFolder = path.join(__dirname, '..', '..', 'pdf');

/**
 * Initialize Prism for server-side highlighting
 * Returns a Prism object that can be used to highlight code
 */
function initPrism() {
  const prismPath = path.join(pdfFolder, 'prism.js');
  const prismCode = fs.readFileSync(prismPath, 'utf8');

  // Create a minimal DOM-like environment for Prism
  const context = {
    self: {},
    document: {
      currentScript: null,
      readyState: 'complete',
      addEventListener: () => {},
      getElementsByTagName: () => [],
      querySelector: () => null,
      querySelectorAll: () => []
    },
    window: {
      Prism: { manual: true },
      addEventListener: () => {},
      requestAnimationFrame: (cb) => setTimeout(cb, 0),
      setTimeout: setTimeout
    },
    navigator: { userAgent: '' },
    WorkerGlobalScope: undefined,
    module: { exports: {} },
    global: {}
  };

  // Make window properties accessible at top level
  context.Prism = context.window.Prism;

  // Execute Prism in the context
  vm.createContext(context);
  vm.runInContext(prismCode, context);

  return context.Prism;
}

/**
 * Apply Prism syntax highlighting to code blocks server-side
 * Transforms <div class="code-block" data-lang="kotlin">code</div>
 * to include highlighted HTML
 */
function applyCodeHighlighting(content, Prism) {
  // Match code-block divs with data-lang attribute
  // Pattern: <div class="code-block" data-lang="kotlin">code content</div>
  const codeBlockRegex = /<div\s+class="code-block"\s+data-lang="([^"]+)"[^>]*>([\s\S]*?)<\/div>/gi;

  let highlightedCount = 0;

  const result = content.replace(codeBlockRegex, (match, lang, code) => {
    // Decode HTML entities in the code
    const decodedCode = code
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    // Check if Prism supports this language
    if (Prism && Prism.languages && Prism.languages[lang]) {
      try {
        const highlighted = Prism.highlight(decodedCode, Prism.languages[lang], lang);
        highlightedCount++;
        return `<div class="code-block" data-lang="${lang}">${highlighted}</div>`;
      } catch (e) {
        console.warn(`Failed to highlight ${lang} code block:`, e.message);
        return match;
      }
    }

    // Return original if language not supported
    return match;
  });

  console.log(`Applied syntax highlighting to ${highlightedCount} code blocks`);
  return result;
}

module.exports = { initPrism, applyCodeHighlighting };
