/* global WebImporter */
export default function parse(element, { document }) {
  // Extract header row based on block name
  const headerRow = ['Columns (columns6)'];

  // Extract content for the first column (text content)
  const featureContent = element.querySelector('.dcs-feature__content');
  const title = featureContent.querySelector('.dcs-feature__title');
  const htmlContent = featureContent.querySelector('.dcs-feature__html');
  const link = featureContent.querySelector('.dcs-feature__link');

  const column1Content = document.createElement('div');
  if (title) column1Content.appendChild(title);
  if (htmlContent) column1Content.appendChild(htmlContent);
  if (link) column1Content.appendChild(link);

  // Extract content for the second column (image)
  const featureImage = element.querySelector('.dcs-feature__image img');

  // Handle edge case where image might not exist
  let column2Content = 'No Image';
  if (featureImage) {
    column2Content = featureImage;
  }

  // Create table using WebImporter.DOMUtils.createTable
  const cells = [
    headerRow,
    [column1Content, column2Content],
  ];

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the new block table
  element.replaceWith(blockTable);
}