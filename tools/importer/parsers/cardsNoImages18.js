/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table header
  const headerRow = ['Cards (cardsNoImages18)'];
  const cells = [headerRow];

  // Find the .wayfinder-component > .row
  const wayfinderComponent = element.querySelector('.wayfinder-component');
  if (wayfinderComponent) {
    const row = wayfinderComponent.querySelector('.row');
    if (row) {
      // Each card is in a col-12.col-md-6.col-lg-6.d-flex
      const cardCols = Array.from(row.querySelectorAll(':scope > div'));
      cardCols.forEach(col => {
        // The anchor wrapping the card
        const link = col.querySelector('a.gel-featured-teaser-link');
        if (!link) return;
        // Get the card title
        const cardTitleElem = link.querySelector('.card-title');
        // For this HTML, the only content is the title (no description)
        // Compose the cell content: title (as h4), arrow (as icon/span), all inside the link
        // Reference existing elements: use the link as-is
        
        // Remove unrelated DOM nodes from the link clone
        // But per instructions, reference the original element, not a clone
        cells.push([link]);
      });
    }
  }
  
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
