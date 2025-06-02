/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Accordion (accordion7)'];
  const rows = [];

  // Select all accordion titles and content within the given element
  const accordionTitles = element.querySelectorAll(':scope > .nsw-accordion__title');
  const accordionContents = element.querySelectorAll(':scope > .nsw-accordion__content');

  // Iterate over titles and contents to create rows
  accordionTitles.forEach((title, index) => {
    const content = accordionContents[index];
    if (content) {
      rows.push([title, content]);
    }
  });

  // Combine header and rows into a table structure
  const cells = [headerRow, ...rows];

  // Create the block table using the helper function
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}