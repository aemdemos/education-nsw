/* global WebImporter */
export default function parse(element, { document }) {
  // Header row per spec
  const headerRow = ['Cards (cardsNoImages15)'];
  const rows = [headerRow];

  // Select all card columns (direct children)
  const cardColDivs = element.querySelectorAll(':scope > div');
  cardColDivs.forEach((colDiv) => {
    // Each col contains an <a> with card body inside
    const anchor = colDiv.querySelector('a');
    if (!anchor) return;
    const cardContentDiv = anchor.querySelector('div');
    if (!cardContentDiv) return;
    // Remove icon if present (do not include in block)
    const cardContentNodes = Array.from(cardContentDiv.childNodes).filter(node => {
      return !(node.nodeType === 1 && node.tagName === 'I');
    });
    // Only push if there's content
    if (cardContentNodes.length > 0) {
      rows.push([cardContentNodes]);
    }
  });

  // Create the block and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
