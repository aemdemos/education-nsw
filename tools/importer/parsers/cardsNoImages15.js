/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per the example
  const headerRow = ['Cards (cardsNoImages15)'];
  const rows = [headerRow];

  // Each "col-12..." div is a card
  const cardCols = element.querySelectorAll(':scope > div');

  cardCols.forEach((col) => {
    // Find the link which wraps the card content
    const link = col.querySelector('a.gel-expanded-nav__item');
    if (!link) return;
    // The content is in the div inside the link
    const contentDiv = link.querySelector('div.flex-grow-1');
    if (!contentDiv) return;
    // Start a fragment for the card content
    const frag = document.createDocumentFragment();
    // Heading (optional)
    const heading = contentDiv.querySelector('h3');
    if (heading) frag.appendChild(heading);
    // Description (optional)
    const desc = contentDiv.querySelector('p');
    if (desc) frag.appendChild(desc);
    // No CTA, as the whole card is the link; nothing more to add.
    rows.push([frag]);
  });

  // Create and replace the block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
