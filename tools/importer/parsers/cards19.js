/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block definition
  const headerRow = ['Cards (cards19)'];
  const cells = [headerRow];

  // Select all immediate card columns
  const cardCols = element.querySelectorAll(':scope > div');
  cardCols.forEach(col => {
    // Each card column contains an <a> with content
    const cardLink = col.querySelector('a');
    if (!cardLink) return;
    const cardContent = cardLink.querySelector('div');
    if (!cardContent) return;

    // First cell: icon (if present)
    let iconCell = '';
    const icon = cardContent.querySelector('i');
    if (icon) iconCell = icon;
    else iconCell = document.createTextNode('');

    // Second cell: text content
    const textFrag = document.createDocumentFragment();
    const h3 = cardContent.querySelector('h3');
    if (h3) textFrag.appendChild(h3);
    const p = cardContent.querySelector('p');
    if (p) textFrag.appendChild(p);
    // No CTA needed, the link wraps the entire card

    cells.push([iconCell, textFrag]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
