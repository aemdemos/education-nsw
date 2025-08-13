/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as shown in the example
  const headerRow = ['Cards (cards20)'];
  // Find the .row containing the cards
  const rowDiv = element.querySelector('.row');
  if (!rowDiv) return;
  // Find all immediate card columns
  const cardCols = Array.from(rowDiv.children).filter(child => child.classList.contains('col-12'));
  const cards = cardCols.map(col => {
    // The card is inside a link
    const link = col.querySelector('a.gel-featured-teaser-link');
    const cardDiv = link ? link.querySelector('div.card') : null;
    // Get image element
    let imgEl = null;
    if (cardDiv) {
      const imgWrapper = cardDiv.querySelector('.gel-teaser__img-wrapper');
      if (imgWrapper) {
        imgEl = imgWrapper.querySelector('img');
      }
    }
    // Compose text cell content
    const textContent = [];
    if (cardDiv) {
      const contentDiv = cardDiv.querySelector('.card-body');
      if (contentDiv) {
        // Category/label
        const highlight = contentDiv.querySelector('.gel-featured-teaser_highlight');
        if (highlight) textContent.push(highlight);
        // Title
        const title = contentDiv.querySelector('.card-title');
        if (title) textContent.push(title);
        // Description
        const desc = contentDiv.querySelector('p');
        if (desc) textContent.push(desc);
        // Date
        const time = contentDiv.querySelector('time');
        if (time) textContent.push(time);
        // CTA (arrow) as link with the original href if available
        const arrowDiv = contentDiv.querySelector('.gel-featured-teaser__arrow');
        if (arrowDiv && link && link.href) {
          // Reference the arrow element directly, but wrap in a link as in the source
          const ctaLink = document.createElement('a');
          ctaLink.href = link.href;
          // Reference, not clone, the arrowDiv
          ctaLink.appendChild(arrowDiv);
          textContent.push(ctaLink);
        }
      }
    }
    return [imgEl, textContent];
  });
  // Build the table
  const cells = [headerRow, ...cards];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
