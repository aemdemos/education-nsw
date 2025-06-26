/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards9)'];
  const rows = [headerRow];

  // Get all top-level columns (cards)
  const cardCols = element.querySelectorAll(':scope > div');
  cardCols.forEach((col) => {
    // Each card is a link containing a div with h3 and p
    const cardLink = col.querySelector('a.gel-expanded-nav__item');
    if (!cardLink) return;
    const contentDiv = cardLink.querySelector('div.flex-grow-1');
    if (!contentDiv) return;

    // --- First cell: Icon (mandatory, example uses icon)
    // Use the icon element directly if present, else use an empty text node
    let icon = contentDiv.querySelector('i');
    icon = icon || document.createTextNode('');

    // --- Second cell: Text (title as heading, description)
    // Use the h3 and p elements directly
    const h3 = contentDiv.querySelector('h3');
    const p = contentDiv.querySelector('p');
    // Ensure at least one exists for semantic correctness
    const cellContent = [];
    if (h3) {
      cellContent.push(h3);
    }
    if (h3 && p) {
      // Add a space or line break between h3 and p for clarity
      cellContent.push(document.createElement('br'));
    }
    if (p) {
      cellContent.push(p);
    }
    // If neither found, use empty text so cell exists
    if (!cellContent.length) cellContent.push(document.createTextNode(''));

    rows.push([icon, cellContent]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
