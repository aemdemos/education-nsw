/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per example
  const headerRow = ['Cards (cardsNoImages18)'];
  const cells = [headerRow];

  // Find all card columns (noting direct children of .row)
  const row = element.querySelector('.wayfinder-component .row');
  if (row) {
    const cols = row.querySelectorAll(':scope > div');
    cols.forEach(col => {
      // Each card is a link
      const link = col.querySelector('a.gel-featured-teaser-link');
      if (link) {
        // Card content is inside .card-body
        const cardBody = link.querySelector('.card-body');
        let cardTitleEl = null;
        if (cardBody) {
          cardTitleEl = cardBody.querySelector('h4.card-title');
        }
        // Compose the cell: all actual text content must be present!
        const cellContents = [];
        if (cardTitleEl) {
          // Use strong to retain heading emphasis per example
          const heading = document.createElement('strong');
          heading.textContent = cardTitleEl.textContent.trim();
          cellContents.push(heading);
        } else {
          // Fallback: use all text inside the cardBody (if present)
          if (cardBody && cardBody.textContent.trim().length > 0) {
            const fallbackHeading = document.createElement('strong');
            fallbackHeading.textContent = cardBody.textContent.trim();
            cellContents.push(fallbackHeading);
          }
        }
        // The CTA is the link itself
        if (link.href && cardTitleEl) {
          // Add a break for spacing
          cellContents.push(document.createElement('br'));
          const cta = document.createElement('a');
          cta.href = link.href;
          cta.textContent = cardTitleEl.textContent.trim();
          cellContents.push(cta);
        }
        // Only add row if we have meaningful content
        if (cellContents.length > 0) {
          cells.push([cellContents]);
        }
      }
    });
  }
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
