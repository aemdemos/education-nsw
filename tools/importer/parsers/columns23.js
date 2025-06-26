/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the columns wrapper (the .gel-banner)
  const banner = element.querySelector('.gel-banner');
  if (!banner) return;

  // Get both primary columns (should be two)
  const colDivs = banner.querySelectorAll('.col-lg-6');
  if (colDivs.length !== 2) return;

  // Identify which column is content, which is images
  let contentCol, imageCol;
  if (colDivs[0].querySelector('.gel-banner__content')) {
    contentCol = colDivs[0];
    imageCol = colDivs[1];
  } else {
    contentCol = colDivs[1];
    imageCol = colDivs[0];
  }

  // Get the inner content container for cleaner output
  const contentInner = contentCol.querySelector('.banner__content-container') || contentCol;
  // Use the entire .media-container for the image column
  const imageInner = imageCol.querySelector('.media-container') || imageCol;

  // Build the table with the correct header
  const cells = [
    ['Columns (columns23)'],
    [contentInner, imageInner]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
