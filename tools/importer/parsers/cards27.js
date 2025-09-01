/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as example
  const headerRow = ['Cards (cards27)'];
  const cells = [headerRow];

  // Find the card grid
  const cardGrid = element.querySelector('.columncontrol .uk-grid');
  if (cardGrid) {
    // Each direct child is a card column
    const cardColumns = cardGrid.querySelectorAll(':scope > div');
    cardColumns.forEach(cardCol => {
      const card = cardCol.querySelector('.sws-card');
      if (card) {
        // First cell: image (mandatory)
        let img = null;
        const imgWrapper = card.querySelector('.sws-card-img-wrapper');
        if (imgWrapper) {
          img = imgWrapper.querySelector('img');
        }
        // Second cell: gather all direct children of .sws-card-content in source order
        let contentArr = [];
        const cardContent = card.querySelector('.sws-card-content');
        if (cardContent) {
          Array.from(cardContent.childNodes).forEach(child => {
            // Only add if element or nonempty text
            if (child.nodeType === Node.ELEMENT_NODE) {
              // Only add if the element contains text or markup
              if (child.textContent.trim() || child.tagName === 'A') contentArr.push(child);
            } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
              // Preserve text nodes with non-whitespace
              const span = document.createElement('span');
              span.textContent = child.textContent;
              contentArr.push(span);
            }
          });
        }
        // Add card only if both image and content
        if (img && contentArr.length > 0) {
          cells.push([img, contentArr]);
        }
      }
    });
  }

  // Replace the element only if at least header + 1 card row
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}