/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as per requirements
  const headerRow = ['Embed (embedVideo3)'];

  // Collect all direct text content from the element (breadcrumbs), preserving structure
  // Put all the relevant visual/textual content into the cell
  let cellContent = [];
  // Get all direct child nodes (preserve element and text)
  const children = Array.from(element.childNodes).filter(n => {
    // Keep elements and non-empty text nodes
    return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim());
  });
  if (children.length > 0) {
    cellContent = children;
  } else if (element.textContent && element.textContent.trim()) {
    cellContent = [element.textContent.trim()];
  } else {
    cellContent = [''];
  }

  // Assemble the table as required
  const rows = [
    headerRow,
    [cellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
