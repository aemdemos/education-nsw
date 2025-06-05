/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be exactly one column, matching the example
  const headerRow = ['Cards (cards1)'];

  // Extract and combine card content for a single cell
  let cardTextContent = '';
  const wysiwyg = element.querySelector('.nsw-wysiwyg-content');
  if (wysiwyg) {
    const para = wysiwyg.querySelector('p');
    cardTextContent = para ? para : wysiwyg;
  } else {
    cardTextContent = element;
  }

  // Compose the card's layout: no image, only text, in a single cell
  const cardRow = [cardTextContent];

  // Table: every row (including header and content) is a single column
  const cells = [headerRow, cardRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
