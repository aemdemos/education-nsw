/* global WebImporter */
export default function parse(element, { document }) {
  // Critical Review Implementation

  // Ensure the header row matches exactly and isn't hardcoded incorrectly
  const headerRow = ['Accordion (accordion4)'];

  // Extracting the accordion items dynamically
  const titles = element.querySelectorAll(':scope > .nsw-accordion__title');
  const contents = element.querySelectorAll(':scope > .nsw-accordion__content');
  
  // Ensure edge cases like missing titles or empty content are handled
  const rows = [];
  titles.forEach((titleElement, index) => {
    const titleButton = titleElement.querySelector('button');
    const titleContent = titleButton ? titleButton.cloneNode(true) : document.createTextNode('');

    const contentElement = contents[index];
    const contentBody = contentElement ? contentElement.cloneNode(true) : document.createTextNode('');

    rows.push([titleContent, contentBody]);
  });

  // Create table data with dynamic content extraction
  const tableData = [headerRow, ...rows];

  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element, ensuring semantic meaning and text content are retained
  element.replaceWith(block);

  return block;
}