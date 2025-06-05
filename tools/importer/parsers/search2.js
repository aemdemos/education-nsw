/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header exactly as required
  const headerRow = ['Search (search2)'];

  // 2. The search index URL should be DYNAMIC if possible, but
  // the provided HTML does not contain a reference to a search index URL.
  // Thus, as per the block description and the example markdown,
  // use the expected default sample URL.
  // If in the future the source HTML contains a URL, this code should extract it.
  //
  // For now, the block always uses the sample-search-data/query-index.json link.
  const searchIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';

  // 3. Table creation following the block format: 1 column, 2 rows (header + data)
  const cells = [
    headerRow,
    [ searchIndexUrl ]
  ];

  // 4. Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
