/* global WebImporter */
export default function parse(element, { document }) {
  // Find the relevant columns from the section/footer block
  // 1st: logo, 2nd: acknowledgement, 3rd: links, 4th: copyright/print logo
  // We'll reference the immediate content containers for each column
  const sectionFooter = element.querySelector('.section-footer');
  const globalFooter = element.querySelector('.global-footer');

  // Defensive: skip if main blocks not present
  if (!sectionFooter && !globalFooter) return;

  // 1. Logo column (left)
  let logoCol = null;
  if (sectionFooter) {
    // The logo is within col1 > .gel-global-footer__logo
    const col = sectionFooter.querySelector('.gel-section-footer__col1');
    if (col) {
      // Only logo/image and social block (which is empty in this HTML)
      const logoWrap = col.querySelector('.gel-global-footer__logo');
      logoCol = logoWrap || col; // fallback to col if logoWrap is missing
    }
  }

  // 2. Acknowledgement column (center left)
  let ackCol = null;
  if (sectionFooter) {
    const col = sectionFooter.querySelector('.gel-section-footer__col2');
    if (col) ackCol = col;
  }

  // 3. Links columns (center right)
  let linksCol = null;
  if (sectionFooter) {
    const col = sectionFooter.querySelector('.gel-section-footer__col3');
    if (col) linksCol = col;
  }

  // 4. Copyright/print logo (bottom)
  let copyrightCol = null;
  if (globalFooter) {
    // The .gel-footer-print contains all copyright info
    const col = globalFooter.querySelector('.gel-footer-print');
    if (col) copyrightCol = col;
  }

  // Build the columns array in the order shown in the screenshot
  // Screenshot shows 3 columns in the top row -- logo, ack, links
  // 4th column (copyright) is a full width row (placed as 4th cell in a new row)
  const columns = [logoCol, ackCol, linksCol].filter(Boolean);

  // Create the cells for the columns block
  // Header:
  const cells = [
    ['Columns (columns8)'],
    columns,
  ];

  // If copyrightCol exists, add as a full-width row (single cell)
  if (copyrightCol) {
    cells.push([copyrightCol]);
  }

  // Remove the old element and insert the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
