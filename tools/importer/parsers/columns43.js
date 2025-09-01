/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid columns (for a two-column layout)
  const grid = element.querySelector('.uk-grid');
  if (!grid) return;

  // Find the left and right columns of the grid
  const leftCol = grid.querySelector('.uk-width-large-2-3');
  const rightCol = grid.querySelector('.uk-width-large-1-3');

  // Compose the left column: all main content blocks in order
  let leftContent = [];
  if (leftCol) {
    // Select all direct children that are content blocks
    // This will get text and image blocks in display order
    const leftBlocks = Array.from(leftCol.children);
    for (const block of leftBlocks) {
      // Only add content blocks (not backtotop or non-content)
      if (
        block.classList.contains('gef-main-content') ||
        block.classList.contains('text') ||
        block.classList.contains('image')
      ) {
        leftContent.push(block);
      }
    }
  }
  // If only one block, use it alone, otherwise array
  leftContent = leftContent.length === 1 ? leftContent[0] : leftContent;

  // Compose the right column: sidebar navigation (single block)
  let rightContent = null;
  if (rightCol) {
    rightContent = rightCol;
  }

  // Table headers must match exactly
  const headerRow = ['Columns (columns43)'];
  // Second row: two columns (left and right)
  const contentRow = [leftContent, rightContent];

  // Table structure
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
