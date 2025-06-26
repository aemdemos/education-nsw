/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards17)'];
  const rows = [headerRow];

  // Get all card containers (direct children)
  const cardContainers = element.querySelectorAll(':scope > div');
  cardContainers.forEach((container) => {
    // Each container has one <a> with content
    const link = container.querySelector('a.gel-expanded-nav__item');
    if (!link) return; // skip if missing
    const contentDiv = link.querySelector('div.flex-grow-1');
    if (!contentDiv) return; // skip if missing

    // ICON/CARD-IMAGE CELL: Use the <i> as the left cell (icon only)
    const icon = contentDiv.querySelector('i');
    // For this HTML, the icon represents a right-arrow, but no visual image; keep as is
    const iconCell = icon ? icon : document.createElement('span'); // placeholder if missing

    // TEXT CELL: Heading + Description, in order, as elements
    const textCellElements = [];
    const heading = contentDiv.querySelector('h3');
    if (heading) textCellElements.push(heading);
    const para = contentDiv.querySelector('p');
    if (para) textCellElements.push(para);
    // No CTA in design, so nothing more in this cell

    rows.push([iconCell, textCellElements]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
