/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards grid root
  const cardsRoot = element.querySelector('.columncontrol .uk-grid');
  if (!cardsRoot) return;

  // Both columns in the grid
  const columns = Array.from(cardsRoot.querySelectorAll(':scope > .uk-width-medium-1-2'));
  // Gather all card sections across both columns, in order
  const cardDivs = columns.flatMap(col =>
    Array.from(col.querySelectorAll(':scope > .image.parbase.section'))
  );

  const rows = [['Cards (cards13)']];

  cardDivs.forEach(cardDiv => {
    // Get image (may be wrapped in link/figure)
    let img = cardDiv.querySelector('img');
    let imgCell = img || '';

    // Prepare the text cell content
    const textBits = [];
    // Title (h2) if present
    const h2 = cardDiv.querySelector('h2');
    if (h2) textBits.push(h2);
    // All non-empty paragraphs (p), lists (ul/ol), and other block content except figures
    Array.from(cardDiv.children).forEach(child => {
      if (child !== h2 && child.tagName !== 'FIGURE') {
        if (
          (child.tagName === 'P' || child.tagName === 'UL' || child.tagName === 'OL' || child.tagName === 'DIV') &&
          child.textContent && child.textContent.trim()
        ) {
          textBits.push(child);
        }
      }
    });
    // Add PDF link as CTA if present
    const figure = cardDiv.querySelector('figure');
    if (figure) {
      const link = figure.querySelector('a');
      if (link && link.href && link.href.match(/\.pdf$/i)) {
        textBits.push(link);
      }
    }
    // Fallback: if nothing in textBits and img alt exists, use alt
    if (textBits.length === 0 && img && img.alt && img.alt.trim()) {
      textBits.push(document.createTextNode(img.alt));
    }
    rows.push([imgCell, textBits.length > 0 ? textBits : '']);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
