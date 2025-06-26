/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as in example
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  // Select all cards in the block
  const cardCols = element.querySelectorAll('.row > .col-12');
  cardCols.forEach(col => {
    const cardLink = col.querySelector('a.gel-featured-teaser-link');
    if (!cardLink) return;
    const card = cardLink.querySelector('.card.featurecard');
    if (!card) return;

    // IMAGE CELL: reference the image element directly (do not clone)
    let imgEl = card.querySelector('.gel-teaser__img-wrapper img, img');
    const imageCell = imgEl || '';

    // TEXT CELL: Compose content in semantic order
    const textParts = [];
    // Highlight badge (if present)
    const highlight = card.querySelector('.gel-featured-teaser_highlight');
    if (highlight) {
      textParts.push(highlight);
      textParts.push(document.createElement('br'));
    }
    // Title (as heading style, use <strong> to match example bold)
    const title = card.querySelector('.card-title');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textParts.push(strong);
      textParts.push(document.createElement('br'));
    }
    // Description (p)
    const desc = card.querySelector('p');
    if (desc) {
      textParts.push(desc);
      textParts.push(document.createElement('br'));
    }
    // Date (time element)
    const date = card.querySelector('time');
    if (date) {
      textParts.push(date);
      textParts.push(document.createElement('br'));
    }
    // Call-to-action link (use href of card, always present)
    if (cardLink.href) {
      const cta = document.createElement('a');
      cta.href = cardLink.href;
      cta.textContent = 'Read more';
      cta.target = '_blank';
      textParts.push(cta);
    }
    // Remove trailing <br>
    while (textParts.length && textParts[textParts.length-1].tagName === 'BR') {
      textParts.pop();
    }
    // Referencing elements, not cloning
    rows.push([imageCell, textParts]);
  });

  // Create the block table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
