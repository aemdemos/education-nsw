/* global WebImporter */
export default function parse(element, { document }) {
  // Block header matches example exactly
  const headerRow = ['Embed (embedVideo21)'];

  // Collect all direct text nodes (not hidden by classes)
  // Reference the entire block's content for resilience and to capture all text
  // We'll use cloneNode to avoid side effects, but you can use element itself if required.
  // For semantic meaning and flexibility, we want to include all visible content from the block,
  // including links and structure, not just plain text.

  // The block is a breadcrumb navigation; the semantic meaning is 'navigation trail'.
  // We'll include its entire inner structure as a single cell, referencing its content directly.

  // Take all children inside .container > nav for maximum coverage and resilience
  // (the actual navigation and breadcrumbs are inside this nav)
  const nav = element.querySelector('.container > nav');
  let cellContent;
  if (nav) {
    cellContent = nav;
  } else {
    // Fallback: reference the entire element if nav not found
    cellContent = element;
  }

  const cells = [
    headerRow,
    [cellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}