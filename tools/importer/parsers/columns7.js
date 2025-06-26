/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section-footer (the blue background multi-column footer)
  const sectionFooter = element.querySelector('.section-footer');
  if (!sectionFooter) return;

  // The column wrappers are direct children of .gel-section-footer__row
  const row = sectionFooter.querySelector('.gel-section-footer__row');
  if (!row) return;
  const columns = Array.from(row.children);

  // Defensive: fallbacks to empty divs in case there are fewer columns than expected
  const col1 = columns[0] || document.createElement('div');
  const col2 = columns[1] || document.createElement('div');
  const col3 = columns[2] || document.createElement('div');

  // Compose the block table
  const header = ['Columns (columns7)'];
  const row1 = [col1, col2, col3];
  const cells = [header, row1];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the section-footer with the new block
  sectionFooter.replaceWith(block);
}
