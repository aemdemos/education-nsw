/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all content (including text nodes) from a column
  function extractColumnContent(col) {
    const content = [];
    col.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        content.push(node);
      } else if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          content.push(span);
        }
      }
    });
    return content.length === 1 ? content[0] : content;
  }

  // Find section-footer block
  const sectionFooter = element.querySelector('.section-footer');
  if (!sectionFooter) return;

  const footer = sectionFooter.querySelector('footer');
  if (!footer) return;

  const combined = footer.querySelector('.gel-section-footer__combined');
  if (!combined) return;

  // Get the main row with 3 columns
  const row = combined.querySelector('.row.gel-section-footer__row');
  if (!row) return;

  const columns = row.querySelectorAll(':scope > div');
  if (columns.length < 3) return;

  // Extract content from each column (including all elements and inline text)
  const col1 = extractColumnContent(columns[0]);
  const col2 = extractColumnContent(columns[1]);
  const col3 = extractColumnContent(columns[2]);

  // Compose block table so the header row is a single cell, and the next row is three columns
  const cells = [
    ['Columns (columns10)'], // header row: single column (matches example)
    [col1, col2, col3]       // content row: three columns
  ];

  // Create and replace the block
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
