/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards1)'];

  // Extracting dynamic content from the provided element
  const contentWrapper = element.querySelector('.nsw-global-alert__content');
  const link = contentWrapper?.querySelector('a');

  if (!link) {
    console.warn('Link is missing in the content wrapper');
    return;
  }

  const cells = [
    headerRow,
    [link]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table block
  element.replaceWith(table);
}