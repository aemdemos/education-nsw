/* global WebImporter */
export default function parse(element, { document }) {
  // Find the dcs-feature block (contains both columns)
  const feature = element.querySelector('.dcs-feature');
  if (!feature) return;

  // Left column: heading, paragraphs, and button (all in .dcs-feature__content)
  const leftCol = feature.querySelector('.dcs-feature__content') || '';

  // Right column: image (picture or img in .dcs-feature__image)
  let rightCol = '';
  const imageContainer = feature.querySelector('.dcs-feature__image');
  if (imageContainer) {
    rightCol = imageContainer.querySelector('picture,img') || '';
  }

  // Header row must be a single cell, matching the markdown example exactly.
  const tableRows = [
    ['Columns (columns5)'], // header row, exactly one column
    [leftCol, rightCol]     // content row, 2 columns
  ];
  
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
