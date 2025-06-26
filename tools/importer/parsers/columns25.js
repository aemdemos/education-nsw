/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the section-footer/footer (the main block)
  const sectionFooter = element.querySelector('.section-footer, footer[role="contentinfo"]');
  if (!sectionFooter) return;

  // 2. Find the columns row
  let row = sectionFooter.querySelector('.gel-section-footer__row');
  if (!row) {
    const container = sectionFooter.querySelector('.container');
    row = container ? container.querySelector('.row') : null;
  }
  if (!row) return;

  // 3. Find the three columns
  const col1 = row.querySelector('.gel-section-footer__col1');
  const col2 = row.querySelector('.gel-section-footer__col2');
  const col3 = row.querySelector('.gel-section-footer__col3');
  const cols = [col1, col2, col3];

  // Helper: Recursively collect all child nodes (elements and text), keeping structure
  function extractContent(node) {
    const result = [];
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        result.push(child);
      } else if (child.nodeType === Node.TEXT_NODE) {
        const txt = child.textContent.replace(/\s+/g, ' ').trim();
        if (txt) result.push(document.createTextNode(txt));
      }
    });
    return result.length === 1 ? result[0] : result;
  }

  // For each col, extract all nested content recursively (to ensure all text/elements are included)
  const columnsRow = cols.map(col => col ? extractContent(col) : '');

  // 4. Build table
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns25)'],
    columnsRow
  ], document);

  // 5. Replace original element
  element.replaceWith(table);
}
