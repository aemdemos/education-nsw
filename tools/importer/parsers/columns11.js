/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main grid
  const grid = element.querySelector('.uk-grid');
  if (!grid) return;

  // Find the content and sidebar columns
  const leftCol = grid.querySelector('.uk-width-large-2-3');
  const rightCol = grid.querySelector('.uk-width-large-1-3');
  if (!leftCol || !rightCol) return;

  // Get all immediate children of leftCol
  const leftChildren = Array.from(leftCol.children);
  // Filter text blocks and image blocks
  const textBlocks = leftChildren.filter(child => child.classList.contains('text'));
  const imageBlock = leftChildren.find(child => child.classList.contains('image'));

  // Compose first cell for row 1 (all text blocks grouped)
  let leftTextCell;
  if (textBlocks.length === 1) {
    leftTextCell = textBlocks[0];
  } else if (textBlocks.length > 1) {
    leftTextCell = document.createElement('div');
    textBlocks.forEach(tb => leftTextCell.appendChild(tb));
  } else {
    leftTextCell = '';
  }

  // Compose second cell for row 2 (image block)
  const leftImageCell = imageBlock || '';

  // Compose the sidebar cell (same for both rows)
  const sidebarCell = rightCol;

  // Table structure: header, then one row for text, then one row for image
  const headerRow = ['Columns (columns11)'];
  const textRow = [leftTextCell, sidebarCell];
  const imageRow = [leftImageCell, sidebarCell];

  const cells = [headerRow, textRow, imageRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
