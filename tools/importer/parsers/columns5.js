/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <footer> containing the columns
  const footer = element.querySelector('footer');
  if (!footer) return;

  // Find the row of columns inside the footer
  const row = footer.querySelector('.row.gel-section-footer__row');
  if (!row) return;

  // Get all direct column divs (three columns)
  const columns = Array.from(row.children);

  // Extract each column's meaningful content
  const cells = columns.map((col) => {
    // Gather visible content inside the column
    // Remove any empty text nodes
    const contentNodes = Array.from(col.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
    // If only one child div, flatten its children (to remove extra wrappers)
    if (contentNodes.length === 1 && contentNodes[0].nodeType === Node.ELEMENT_NODE && contentNodes[0].tagName === 'DIV') {
      return Array.from(contentNodes[0].childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return true;
      });
    }
    return contentNodes.length === 1 ? contentNodes[0] : contentNodes;
  });

  // Build the block table, matching example: header EXACTLY, then one row with three columns
  const headerRow = ['Columns (columns5)'];
  const blockTable = [headerRow, cells];

  // Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(blockTable, document);
  element.replaceWith(block);
}
