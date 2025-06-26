/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section footer row containing the columns
  const sectionFooter = element.querySelector('.section-footer footer');
  if (!sectionFooter) return;
  const row = sectionFooter.querySelector('.gel-section-footer__row');
  if (!row) return;

  // Get all direct children (columns) of the row
  const colNodes = Array.from(row.children);
  // For each column, reference the actual element from the document (not a clone)
  // If the column is empty, insert an empty string
  const columns = colNodes.map(col => {
    let hasContent = false;
    for (let i = 0; i < col.childNodes.length; i++) {
      if (
        col.childNodes[i].nodeType === 1 ||
        (col.childNodes[i].nodeType === 3 && col.childNodes[i].textContent.trim().length > 0)
      ) {
        hasContent = true;
        break;
      }
    }
    return hasContent ? col : '';
  });
  // Header row: exactly one cell, as required
  const headerRow = ['Columns (columns5)'];
  // The next row contains the columns as separate cells
  const tableArray = [headerRow, columns];
  const block = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(block);
}
