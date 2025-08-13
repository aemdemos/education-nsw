/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards17)'];

  // All card containers (col-12 col-md-6 col-lg-4 d-flex)
  const cardDivs = element.querySelectorAll(':scope > div');
  const rows = [];
  cardDivs.forEach(cardDiv => {
    const link = cardDiv.querySelector('a.gel-expanded-nav__item');
    if (!link) return;
    const inner = link.querySelector('div.flex-grow-1');
    if (!inner) return;
    // Title (h3)
    const h3 = inner.querySelector('h3');
    // Description (p)
    const desc = inner.querySelector('p');
    // Compose text cell as array of nodes
    const textCell = [];
    if (h3) textCell.push(h3);
    if (desc) textCell.push(desc);
    // No image or icon in this variant, leave first cell blank
    rows.push(['', textCell]);
  });

  const tableCells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
