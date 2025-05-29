/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the footer groups
  const groups = Array.from(element.querySelectorAll(':scope > div > div > div.nsw-footer__group'));

  // Define the header row with the exact text as specified in the example
  const headerRow = ['Columns (columns9)'];

  // Process the groups into rows
  const rows = groups.map((group) => {
    // Extract heading and links
    const heading = group.querySelector('h3');
    const links = group.querySelectorAll('ul li a');

    // Create a container for heading and links
    const content = document.createElement('div');

    // Include the heading
    if (heading) {
      const headingClone = heading.cloneNode(true);
      content.appendChild(headingClone);
    }

    // Include the links as a list
    if (links.length > 0) {
      const list = document.createElement('ul');
      links.forEach((link) => {
        const listItem = document.createElement('li');
        listItem.appendChild(link.cloneNode(true));
        list.appendChild(listItem);
      });
      content.appendChild(list);
    }

    return [content];
  });

  // Combine header row and content rows into table structure
  const tableData = [headerRow, ...rows];

  // Create the table using the WebImporter helper
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new table block
  element.replaceWith(block);
}