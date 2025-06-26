/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main aside banner
  const aside = element.querySelector('aside.gel-banner-container');
  if (!aside) return;

  // Find the two columns inside the .gel-banner__fullbleed-banner
  const banner = aside.querySelector('.gel-banner__fullbleed-banner');
  if (!banner) return;

  // Find the content (overlay/left) and image (right) columns
  const overlayCol = banner.querySelector('.gel-banner__fullbleed-banner__overlay-wrapper');
  const imageCol = banner.querySelector('.col-md-6');

  // For main row, preserve order: text left, image right
  const contentRow = [overlayCol || '', imageCol || ''];

  // The header row MUST be a single cell (one column), even for a multi-column table
  const headerRow = ['Columns (columns11)'];

  // Construct table as per the block guidelines and example
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  
  // Replace the original element with the new table
  element.replaceWith(table);
}
