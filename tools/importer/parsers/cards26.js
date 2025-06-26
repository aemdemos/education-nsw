/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row matching the example block name
  const headerRow = ['Cards (cards26)'];

  // 2. Extract all card columns from the .row
  const cardCols = element.querySelectorAll('.row > div');

  const rows = Array.from(cardCols).map((col) => {
    // Each col contains an <a> linking the whole card
    const link = col.querySelector('a.gel-featured-teaser-link');
    const cardBody = link ? link.querySelector('.card-body') : null;

    // First column: No image/icon, so remains blank ("")
    const imgCell = '';

    // Second column: content fragment (title, description, CTA)
    const textFrag = document.createDocumentFragment();

    if (cardBody) {
      // Heading/title
      const title = cardBody.querySelector('h4');
      if (title) textFrag.appendChild(title);
      // Description (p)
      const desc = cardBody.querySelector('p');
      if (desc) {
        // Add a br if title exists
        if (title) textFrag.appendChild(document.createElement('br'));
        textFrag.appendChild(desc);
      }
      // CTA (link is present, always add as last line)
      if (link && link.href) {
        // Add line break if there is content before
        if (title || desc) textFrag.appendChild(document.createElement('br'));
        const cta = document.createElement('a');
        cta.href = link.href;
        cta.textContent = 'Learn more';
        textFrag.appendChild(cta);
      }
    }
    return [imgCell, textFrag];
  });

  // Compose block table
  const tableCells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
