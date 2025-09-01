/* global WebImporter */
export default function parse(element, { document }) {
  // Utility: get all direct children, including significant text nodes, as an array
  function getRelevantChildren(parent) {
    return Array.from(parent.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return node.nodeType === Node.ELEMENT_NODE;
    });
  }

  // Find grid columns
  const grid = element.querySelector('.uk-grid');
  if (!grid) return;
  const cols = grid.querySelectorAll(':scope > div');
  // The columns are the two main divs with width classes
  const leftCol = Array.from(cols).find(col => col.classList.contains('uk-width-large-2-3'));
  const rightCol = Array.from(cols).find(col => col.classList.contains('uk-width-large-1-3'));

  // Extract all content from each column, including text and elements
  // This ensures all text content is included.
  let leftCell = [];
  if (leftCol) {
    // Sometimes there is extra div nesting, so flatten by diving into first .gef-main-content or fallback
    let leftContentRoot = leftCol.querySelector('.gef-main-content.sws-content') || leftCol;
    leftCell = getRelevantChildren(leftContentRoot);
    // If nothing found, ensure at least an empty string
    if (!leftCell.length) leftCell = [''];
  } else {
    leftCell = [''];
  }

  let rightCell = [];
  if (rightCol) {
    // Include all navigation and headings
    rightCell = getRelevantChildren(rightCol);
    if (!rightCell.length) rightCell = [''];
  } else {
    rightCell = [''];
  }

  // Compose table: header is exactly as specified
  const cells = [
    ['Columns (columns41)'],
    [leftCell, rightCell],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Set colspan=2 on the header row to span both columns
  const th = table.querySelector('tr:first-child th');
  if (th) {
    th.setAttribute('colspan', '2');
  }
  element.replaceWith(table);
}
