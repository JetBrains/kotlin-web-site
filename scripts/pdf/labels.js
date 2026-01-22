/**
 * Transform data-label-id attributes on headings into visible label elements
 */

const cheerio = require('cheerio');

/**
 * Label configuration for data-label-id attributes
 */
const LABEL_CONFIG = {
  'eap': { text: 'EAP', color: 'purple' },
  'beta': { text: 'Beta', color: 'tangerine' },
  'experimental-general': { text: 'Experimental', color: 'tangerine' },
  'experimental-opt-in': { text: 'Experimental', color: 'tangerine' },
  'deprecated': { text: 'Deprecated', color: 'red' },
  'stable': { text: 'Stable', color: 'green' },
};

/**
 * Transform data-label-id attributes on headings into visible label elements
 * @param {string} html - HTML content
 * @returns {string} - Transformed HTML with label elements
 */
function addTitleLabels(html) {
  const $ = cheerio.load(html, { decodeEntities: false });

  $('h1[data-label-id], h2[data-label-id], h3[data-label-id], h4[data-label-id]').each(function () {
    const $heading = $(this);
    const labelId = $heading.attr('data-label-id');
    const config = LABEL_CONFIG[labelId];

    if (!config) {
      return; // Unknown label, skip
    }

    const tag = this.tagName.toLowerCase();
    const labelHtml = `<div class="title__label title__label--related-${tag}"><span class="label__content label__content--color-${config.color}">${config.text}</span></div>`;

    // Insert label at the beginning of heading content
    $heading.prepend(labelHtml);
  });

  return $.html();
}

module.exports = { addTitleLabels, LABEL_CONFIG };
