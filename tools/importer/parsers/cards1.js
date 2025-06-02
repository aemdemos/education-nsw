/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Extract relevant content dynamically from the HTML structure

  // Extract the content inside <p> tag within the noticeboard block
  const contentParagraph = element.querySelector('.nsw-wysiwyg-content p');

  if (!contentParagraph) {
    console.warn('No content found inside .nsw-wysiwyg-content p');
    return;
  }

  // Step 2: Define header row matching example structure
  const headerRow = ['Cards (cards1)'];

  // Step 3: Organize content into a table structure
  const contentRow = [contentParagraph];

  const tableData = [
    headerRow,
    contentRow,
  ];

  // Step 4: Create the block table using the helper function
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  // Step 5: Replace original element with the new block table
  element.replaceWith(blockTable);
}