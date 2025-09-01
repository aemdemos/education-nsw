/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell (one column)
  const headerRow = ['Columns (columns44)'];

  // Find the horizontal card (columns)
  const horizontalCard = element.querySelector('.sws-card-horizontal');
  if (!horizontalCard) return;

  // Get left column: image (as an array of elements for the table cell)
  const imgWrapper = horizontalCard.querySelector('.sws-card-img-wrapper');
  let leftCol = [];
  if (imgWrapper) {
    const img = imgWrapper.querySelector('img');
    if (img) leftCol.push(img);
  }

  // Get right column: content (title, description, button)
  const contentWrapper = horizontalCard.querySelector('.sws-card-content-wrapper');
  let rightCol = [];
  if (contentWrapper) {
    const content = contentWrapper.querySelector('.sws-card-content');
    if (content) {
      const title = content.querySelector('.sws-card-title');
      if (title) rightCol.push(title);
      const desc = content.querySelector('.sws-card-description');
      if (desc) rightCol.push(desc);
      const btn = content.querySelector('.sws-card-button');
      if (btn) rightCol.push(btn);
    }
  }

  // The first row is always a single column (header), content row has two columns
  const cells = [
    headerRow,
    [leftCol, rightCol]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
