/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Columns (columns5)'];

  // Extract the content from the left column
  const contentBlock = element.querySelector(':scope .dcs-feature__content');

  const title = contentBlock.querySelector('.dcs-feature__title');
  const paragraphs = Array.from(contentBlock.querySelectorAll('.dcs-feature__html p'));
  const link = contentBlock.querySelector('.dcs-feature__link');

  // Extract the image
  const imageBlock = element.querySelector(':scope .dcs-feature__image img');

  const firstRow = [
    [title, ...paragraphs, link], // Left column with title, paragraphs, and link
    imageBlock, // Image in the right column
  ];

  const cells = [
    headerRow,
    firstRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block); // Correct replacement removes return
}