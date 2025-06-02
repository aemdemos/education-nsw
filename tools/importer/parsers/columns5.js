/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Columns (columns5)'];

  // Extracting content elements
  const content = document.createElement('div');
  const title = element.querySelector('.dcs-feature__title');
  const text = element.querySelector('.dcs-feature__html');
  const button = element.querySelector('.dcs-feature__link');

  if (title) content.appendChild(title);
  if (text) content.appendChild(text);
  if (button) content.appendChild(button);

  // Extracting image element
  const imageContainer = element.querySelector('.dcs-feature__image img');

  // Create the cells array for the table
  const cells = [
    headerRow,
    [content, imageContainer],
  ];

  // Create the table using WebImporter.DOMUtils.createTable and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}