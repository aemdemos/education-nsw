/* global WebImporter */
export default function parse(element, { document }) {
  // Create the table header
  const headerRow = ['Search (search2)'];

  // Dynamically create the link for the second row
  const link = document.createElement('a');
  link.href = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  link.textContent = link.href;

  // Create the table rows
  const rows = [
    headerRow,
    [link],
  ];

  // Generate the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}