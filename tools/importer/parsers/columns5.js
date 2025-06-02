/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the relevant title from the feature content
  const title = element.querySelector('.dcs-feature__title');

  // Extract the textual content paragraphs
  const paragraphs = Array.from(
    element.querySelectorAll('.dcs-feature__html p')
  );

  // Extract the button (link) element
  const button = element.querySelector('.dcs-feature__link');

  // Extract and keep the image element
  const image = element.querySelector('.dcs-feature__image img');

  // Structure the header row for the table
  const headerRow = ['Columns (columns5)'];

  // Structure the content row with text and image side by side
  const contentRow = [
    [title, ...paragraphs, button],
    image,
  ];

  // Create the block table using WebImporter.DOMUtils.createTable()
  const blockTable = WebImporter.DOMUtils.createTable(
    [headerRow, contentRow],
    document
  );

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}