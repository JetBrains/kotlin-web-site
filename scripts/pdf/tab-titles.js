const cheerio = require('cheerio');

/**
 * Convert tab titles from CSS pseudo-elements to inline text
 * Make title part of the code block to avoid page break issues
 *
 * @param {string} content - HTML content to process
 * @returns {string} - Modified HTML with tab titles embedded
 */
function convertTabTitlesToElements(content) {
  const $ = cheerio.load(content, { decodeEntities: false });

  // Find all tabs__content elements with data-title attribute
  $('.tabs__content[data-title]').each((i, elem) => {
    const $elem = $(elem);
    const title = $elem.attr('data-title');

    // Find the first code-block child
    const $codeBlock = $elem.find('.code-block').first();

    if ($codeBlock.length) {
      // Prepend title as a comment-style line inside the code block
      const currentContent = $codeBlock.html();
      $codeBlock.html(`<span class="tabs__title">${title}</span>\n${currentContent}`);
    } else {
      // Fallback: just prepend a regular title div
      $elem.prepend(`<div class="tabs__title-standalone">${title}</div>`);
    }
  });

  return $.html();
}

module.exports = { convertTabTitlesToElements };
