/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards1)'];

  // Extracting content from the provided HTML structure
  const alertContent = element.querySelector(
    ':scope > div > div.nsw-global-alert__wrapper > div.nsw-global-alert__content > div.nsw-wysiwyg-content'
  );
  
  if (!alertContent) {
    throw new Error('Content wrapper is missing.');
  }

  const linkElement = alertContent.querySelector('a');
  if (!linkElement) {
    throw new Error('Link element is missing.');
  }

  // Defining rows for the table
  const contentRow = [linkElement];

  // Creating the block table
  const cells = [
    headerRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}