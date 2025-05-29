/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Columns (columns6)'];

  // Extract image block
  const imageContainer = element.querySelector('.dcs-feature__image picture img');

  // Extract content block
  const contentContainer = element.querySelector('.dcs-feature__content');
  const title = contentContainer.querySelector('.dcs-feature__title');
  const description = contentContainer.querySelector('.dcs-feature__html');
  const link = contentContainer.querySelector('.dcs-feature__link');

  const textContent = [title, description, link];

  const secondRow = [textContent, imageContainer];

  const cells = [headerRow, secondRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}