/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per block name
  const headerRow = ['Cards (cards26)'];
  const cells = [headerRow];

  // Find card columns - only direct children
  const cardCols = element.querySelectorAll(':scope .row > .col-12');
  cardCols.forEach(col => {
    // Each card is inside a link
    const cardLink = col.querySelector(':scope > a.gel-featured-teaser-link');
    // Defensive check: if no link, skip
    if (!cardLink) return;
    // Card content
    const cardBody = cardLink.querySelector('.card-body.gel-featured-teaser__content_variant');
    // Defensive check: if no body, skip
    if (!cardBody) return;
    // Compose card text: includes h4 (title), p (desc), and the arrow
    // Only reference existing elements (don't clone)
    const cardText = document.createElement('div');
    const title = cardBody.querySelector('h4.card-title');
    if (title) cardText.appendChild(title);
    const desc = cardBody.querySelector('p');
    if (desc) cardText.appendChild(desc);
    const arrow = cardBody.querySelector('.gel-featured-teaser__arrow');
    if (arrow) cardText.appendChild(arrow);
    // For icon/image cell: none present, so cell is empty string
    cells.push(['', cardText]);
  });

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
