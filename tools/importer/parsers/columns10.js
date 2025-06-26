/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section-footer (main content)
  const footerSection = element.querySelector('.section-footer');
  if (!footerSection) return;

  // Find column containers -- direct children of the .row.gel-section-footer__row
  let columns = [];
  const row = footerSection.querySelector('.row.gel-section-footer__row');
  if (row) {
    columns = Array.from(row.children);
  }
  if (columns.length !== 3) return;

  // Helper to collect all meaningful content (text and element nodes)
  function collectContent(col) {
    const nodes = [];
    col.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        nodes.push(document.createTextNode(node.textContent));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        nodes.push(node);
      }
    });
    return nodes;
  }

  // For each column, grab its content (as arrays)
  const col1Content = collectContent(columns[0]);
  const col2Content = collectContent(columns[1]);
  const col3Content = collectContent(columns[2]);

  // Build table: header row is a single cell, second row has three columns
  const cells = [
    ['Columns (columns10)'],
    [col1Content, col2Content, col3Content]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
