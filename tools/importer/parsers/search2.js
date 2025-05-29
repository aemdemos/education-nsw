/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Search (search2)'];

  const searchElement = element.querySelector('[data-react-app="dcsHeaderSearch"]');

  const searchIndexLink = document.createElement('a');
  searchIndexLink.href = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  searchIndexLink.textContent = searchIndexLink.href;

  const rows = [
    headerRow,
    [searchIndexLink],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);

  element.replaceWith(table);
}