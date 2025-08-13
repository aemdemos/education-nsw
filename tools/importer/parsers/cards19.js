/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in example
  const headerRow = ['Cards (cards19)'];

  // Each card is contained in a column div
  const cardColumns = element.querySelectorAll(':scope > div');
  const cardRows = [];

  cardColumns.forEach(col => {
    // Find the anchor that wraps the card
    const cardLink = col.querySelector('a');
    // The actual card content (icon, heading, description) is inside this div
    const cardContent = cardLink && cardLink.querySelector('div');

    // First cell: icon (if present), otherwise leave empty
    let icon = cardContent && cardContent.querySelector('i');
    let firstCell = icon ? icon : document.createElement('span');

    // Second cell: text content (title, description)
    const title = cardContent && cardContent.querySelector('h3');
    const description = cardContent && cardContent.querySelector('p');
    const cellContent = [];
    if (title) cellContent.push(title);
    if (description) cellContent.push(description);
    // No CTA in markup, so just use title/description
    cardRows.push([firstCell, cellContent]);
  });

  // Build the table data
  const cells = [headerRow, ...cardRows];

  // Make the table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
