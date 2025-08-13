/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section-footer footer (contains the columns)
  const footer = element.querySelector('.section-footer footer');
  if (!footer) return;
  const row = footer.querySelector('.gel-section-footer__row');
  if (!row) return;

  // Get all immediate children that represent columns
  const colDivs = Array.from(row.children).filter(child => child.tagName === 'DIV');
  if (!colDivs.length) return;

  // Helper to gather all real content from a column div
  function gatherContent(div) {
    const result = [];
    div.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        result.push(node);
      } else if (node.nodeType === Node.TEXT_NODE) {
        const txt = node.textContent.trim();
        if (txt) {
          const span = document.createElement('span');
          span.textContent = txt;
          result.push(span);
        }
      }
    });
    return result.length === 1 ? result[0] : result;
  }

  // Build the content row for the block table
  const contentRow = colDivs.map(gatherContent);

  // Table header: single cell row as per the requirements
  const headerRow = ['Columns (columns22)'];

  // Create the table: first row is one cell, second row has one cell per column
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
