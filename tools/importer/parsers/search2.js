/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the absolute URL for the query index
  const queryIndexElement = element.querySelector('a[href*="query-index.json"]');
  const queryIndex = queryIndexElement ? queryIndexElement.href : 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';

  // Construct the table data dynamically
  const cells = [
    ['Search (search2)'], // Header row
    [
      (() => {
        if (queryIndexElement) {
          queryIndexElement.textContent = queryIndex; // Ensure text content matches the URL
          return queryIndexElement; // Reference the existing element
        } else {
          const anchor = document.createElement('a');
          anchor.href = queryIndex;
          anchor.textContent = queryIndex; // Set text content to the URL
          return anchor;
        }
      })()
    ]
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}