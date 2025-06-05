/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all direct .nsw-footer__group elements (each group is a column)
  const groups = element.querySelectorAll('.nsw-footer__group');
  // Build the row for columns (each column cell is the full group element)
  const columns = [];
  groups.forEach((group) => {
    columns.push(group);
  });
  // Assemble the table
  const headerRow = ['Columns (columns9)'];
  const contentRow = columns;
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
