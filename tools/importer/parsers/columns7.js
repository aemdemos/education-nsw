/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section-footer as the main block content
  const sectionFooter = element.querySelector('.section-footer');
  if (!sectionFooter) return;

  // The columns are visually laid out in the row with three children
  const row = sectionFooter.querySelector('.gel-section-footer__row');
  if (!row) return;

  // Get the three column containers for the block
  const columns = Array.from(row.children);
  if (columns.length === 0) return;

  // For each column, preserve all child content (text, lists, headings, images, links, etc.)
  const contentRow = columns.map((col) => {
    const fragment = document.createDocumentFragment();
    Array.from(col.childNodes).forEach((node) => {
      fragment.appendChild(node);
    });
    return fragment;
  });

  // The header row MUST have exactly one cell, per requirements
  const cells = [
    ['Columns (columns7)'], // header row, single column
    contentRow              // second row, N columns holding content
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
