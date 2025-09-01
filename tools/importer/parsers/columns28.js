/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must be a single cell
  const headerRow = ['Columns (columns28)'];

  // Get all immediate child divs (left content, social, logo)
  const children = element.querySelectorAll(':scope > div');

  // Left column: contact info
  const leftCol = children[0];

  // Right column: logo image, if present
  let rightColImg = '';
  if (children.length > 2) {
    for (let i = 1; i < children.length; i++) {
      const img = children[i].querySelector('img');
      if (img) {
        rightColImg = img;
        break;
      }
    }
  }

  // Content row: must be an array with two cells
  const contentRow = [leftCol, rightColImg];

  // Pass rows as: first (header), then content
  const tableRows = [headerRow, contentRow];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
