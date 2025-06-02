/* global WebImporter */
export default function parse(element, { document }) {
  // Define the header row with proper block naming
  const headerRow = ['Accordion (accordion7)'];

  // Initialize an array to store rows for the table
  const rows = [];

  // Select all accordion titles and content within the immediate scope of the element
  const accordionTitles = element.querySelectorAll(':scope > div.nsw-accordion > div.nsw-accordion__title');
  const accordionContents = element.querySelectorAll(':scope > div.nsw-accordion > div.nsw-accordion__content');

  // Ensure the number of titles matches the number of content blocks
  if (accordionTitles.length !== accordionContents.length) {
    console.warn('Mismatch between accordion titles and content. Titles:', accordionTitles.length, 'Contents:', accordionContents.length);
  }

  // Iterate through the accordion titles and contents, pairing them into rows
  accordionTitles.forEach((title, index) => {
    const titleButton = title.querySelector('button'); // Extract the button containing the title text
    const content = accordionContents[index]?.querySelector('.nsw-wysiwyg-content'); // Extract content within the matched accordion

    // Handle cases where content or title might be missing
    if (titleButton && content) {
      rows.push([titleButton, content]);
    } else {
      console.warn('Skipped a row due to missing title or content. Index:', index);
    }
  });

  // Combine the header row with the extracted rows
  const cells = [headerRow, ...rows];

  // Create the table block using DOMUtils helper
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the generated block table
  element.replaceWith(block);
}