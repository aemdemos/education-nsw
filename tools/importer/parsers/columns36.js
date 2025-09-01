/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid and left column
  const grid = element.querySelector('.uk-grid');
  if (!grid) return;
  const leftCol = grid.querySelector('.uk-width-large-2-3');
  if (!leftCol) return;

  // This will store pairs of [textBlock, columnBlock]
  const contentPairs = [];
  let buffer = [];

  // Helper to get real content children (ignore CQ placeholder)
  function getRealContent(node) {
    return Array.from(node.children).filter(e => !e.classList.contains('cq-placeholder'));
  }

  // Go through direct children of leftCol in order
  Array.from(leftCol.children).forEach((child) => {
    if (child.classList.contains('text') || child.classList.contains('gef-main-content')) {
      buffer.push(child);
    } else if (child.classList.contains('columncontrol')) {
      // Pair up buffered text with this columncontrol
      const textPart = buffer.length === 1 ? buffer[0] : (buffer.length > 1 ? buffer.slice() : '');
      buffer = [];
      contentPairs.push([textPart, child]);
    }
  });
  // If text left in buffer at end with no column, add as a row with just text
  if (buffer.length) {
    contentPairs.push([buffer.length === 1 ? buffer[0] : buffer.slice(), null]);
  }

  // Build rows for the table
  const rows = [['Columns (columns36)']];
  contentPairs.forEach(([textBlock, colBlock]) => {
    if (colBlock) {
      // Find grid and columns
      const ukGrid = colBlock.querySelector(':scope > .uk-grid');
      let colDivs = ukGrid ? Array.from(ukGrid.children).filter(col => col.className && col.className.indexOf('uk-width-') !== -1) : [];
      // For each column, get content
      const colCells = colDivs.map(col => {
        const realEls = getRealContent(col);
        if (realEls.length === 1) return realEls[0];
        if (realEls.length > 1) return realEls;
        return '';
      });
      // Always put textBlock in the first column
      rows.push([textBlock, ...colCells]);
    } else if (textBlock) {
      // Text with no columns
      rows.push([textBlock]);
    }
  });

  // Remove extra cells if any row has more columns than the first data row (besides header)
  const colCount = rows[1] ? rows[1].length : 2;
  rows.forEach((row, i) => {
    if (i > 0 && row.length > colCount) {
      row.length = colCount;
    }
  });

  // Build the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
