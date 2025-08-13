/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: block name with variant as in the example
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Get all cards, which are direct children of .row inside .wayfinder-component
  const cardDivs = element.querySelectorAll('.row > .col-12');

  cardDivs.forEach((colDiv) => {
    // The card is inside the anchor
    const cardLink = colDiv.querySelector('a.gel-featured-teaser-link');
    const card = cardLink ? cardLink.querySelector('.card') : colDiv.querySelector('.card');
    if (!card) return;
    // First cell: image or icon
    const img = card.querySelector('.wayfinder-component_img'); // Use existing <img> element

    // Second cell: text content (title, description, CTA)
    const cardBody = card.querySelector('.card-body');
    const content = [];
    // Title
    const title = cardBody && cardBody.querySelector('h4.card-title');
    if (title) content.push(title);
    // Description
    const desc = cardBody && cardBody.querySelector('p');
    if (desc) content.push(desc);
    // CTA - only if anchor exists and has href
    if (cardLink && cardLink.href) {
      // Use visible arrow icon + link text (title) as CTA
      // But only add link if there is an href and actual title
      const link = document.createElement('a');
      link.href = cardLink.href;
      link.textContent = (title && title.textContent) ? title.textContent : 'Learn more';
      content.push(link);
    }
    // Add row to the table
    rows.push([img, content]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
