/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing both columns
  const grid = element.querySelector('.uk-grid.uk-grid-collapse');
  if (!grid) return;

  // Find the two columns
  let mainContent = null;
  let sideNav = null;
  const colElements = grid.querySelectorAll(':scope > div');
  for (const col of colElements) {
    if (col.classList.contains('uk-width-large-2-3')) {
      mainContent = col;
    } else if (col.classList.contains('uk-width-large-1-3')) {
      sideNav = col;
    }
  }

  // Main column: find main content element
  let mainBlock = null;
  if (mainContent) {
    // Try to find the most content-rich block
    mainBlock = mainContent.querySelector('.gef-main-content.sws-content');
    // Fallback if not found
    if (!mainBlock) {
      mainBlock = mainContent;
    }
  }

  // Side column: use everything in the side column as a block
  let sideBlock = null;
  if (sideNav) {
    sideBlock = sideNav;
  }

  // Table header matches the example exactly
  const headerRow = ['Columns (columns21)'];
  // Table second row: one cell for each column
  const contentRow = [mainBlock, sideBlock];
  const cells = [headerRow, contentRow];

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
