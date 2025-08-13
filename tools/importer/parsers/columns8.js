/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the section-footer
  const grid = element.querySelector('.aem-Grid.aem-Grid--12.aem-Grid--default--12');
  if (!grid) return;
  const sectionFooter = grid.querySelector('.section-footer');
  if (!sectionFooter) return;

  // Find the main row with columns
  const row = sectionFooter.querySelector('.row.gel-section-footer__row');
  if (!row) return;

  // Get all direct column elements
  const columns = Array.from(row.children).filter((child) => child.nodeType === 1);

  // For each column, gather all content (including text nodes and elements)
  function getColumnContent(col) {
    if (!col.childNodes || !col.childNodes.length) return col;
    // Use a fragment to retain text nodes and elements
    const frag = document.createDocumentFragment();
    Array.from(col.childNodes).forEach((node) => {
      frag.appendChild(node);
    });
    return frag;
  }
  const columnContents = columns.map(getColumnContent);

  // Compose the block: header single cell, then a single row with all columns as cells
  const cells = [
    ['Columns (columns8)'], // header: always a single cell
    columnContents           // content row: N columns/cells
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
