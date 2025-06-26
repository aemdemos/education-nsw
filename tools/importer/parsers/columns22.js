/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section footer which contains the columns
  const sectionFooter = element.querySelector('.section-footer');
  if (!sectionFooter) return;

  // Find the row that visually contains the columns
  const row = sectionFooter.querySelector('.gel-section-footer__row');
  if (!row) return;

  // Get all column elements (visually: left, middle, right)
  const columns = Array.from(row.children);
  if (columns.length === 0) return;

  // Gather all direct children of each column into the contentRow
  const contentRow = columns.map((col) => {
    // If only text nodes, wrap in a div
    if (col.childNodes.length === 1 && col.childNodes[0].nodeType === Node.TEXT_NODE) {
      const wrapper = document.createElement('div');
      wrapper.textContent = col.textContent;
      return wrapper;
    }
    // If has element children, gather all direct children
    const fragment = document.createDocumentFragment();
    Array.from(col.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        fragment.appendChild(node);
      }
    });
    // If only one node, just return that node
    if (fragment.childNodes.length === 1) return fragment.childNodes[0];
    // If more, return an array (so createTable can handle)
    return Array.from(fragment.childNodes);
  });

  // The header row should be a single cell/column only (first row is always one column)
  const headerRow = ['Columns (columns22)'];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
