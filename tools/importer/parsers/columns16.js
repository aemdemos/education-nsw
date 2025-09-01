/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid container
  const grid = element.querySelector('.uk-grid');
  if (!grid) return;

  // Get the main content (large column) and side nav (sidebar column)
  const mainCol = grid.querySelector('.uk-width-large-2-3');
  const sideCol = grid.querySelector('.uk-width-large-1-3');

  // Organize left (main) column content
  let leftCellDiv = document.createElement('div');
  if (mainCol) {
    // Get all .text.parbase blocks under mainCol (including nested in .gef-main-content)
    const textBlocks = Array.from(mainCol.querySelectorAll('.text.parbase'));
    textBlocks.forEach(tb => {
      // Each tb contains a .gef-main-content, which contains the actual content
      const content = tb.querySelector('.gef-main-content');
      if (content && content.textContent.trim()) {
        Array.from(content.childNodes).forEach(node => {
          // Skip empty paragraphs
          if (node.nodeType === 1 && node.tagName === 'P' && !node.textContent.trim()) return;
          leftCellDiv.appendChild(node.cloneNode(true));
        });
      }
    });
  }
  if (!leftCellDiv.hasChildNodes()) leftCellDiv = '';

  // Organize right (side) column content
  let rightCellDiv = document.createElement('div');
  if (sideCol) {
    // Find the nav in the sideCol
    const nav = sideCol.querySelector('nav,#sws-side-navigation');
    if (nav) {
      rightCellDiv.appendChild(nav);
    }
  }
  if (!rightCellDiv.hasChildNodes()) rightCellDiv = '';

  // Build cells array: first row is header with ONE column only, then each content row is an array of two columns
  const cells = [];
  // Header row, one cell
  cells.push(['Columns (columns16)']);
  // Content rows (in columns, just one row here, but structure supports expansion)
  cells.push([leftCellDiv, rightCellDiv]);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
