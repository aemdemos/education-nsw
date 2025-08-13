/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the banner block
  const banner = element.querySelector('.gel-banner__fullbleed-banner');
  if (!banner) return;

  // Find the columns within the banner: image and content
  // The .col-md-6.order-md-last is the right column (images)
  const rightCol = banner.querySelector('.col-md-6.order-md-last');
  // The .gel-banner__fullbleed-banner__overlay-wrapper is the left column (text content)
  const leftCol = banner.querySelector('.gel-banner__fullbleed-banner__overlay-wrapper');

  // Table header matches the example
  const headerRow = ['Columns (columns11)'];

  // Row should have two columns: leftCol and rightCol
  // Reference the actual elements so all children and formatting are preserved
  // If either column is missing, put an empty string in that cell
  const row = [leftCol || '', rightCol || ''];

  const cells = [ headerRow, row ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
