/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main grid containing the two columns
  const grid = element.querySelector('.uk-grid');
  if (!grid) return;
  const left = grid.querySelector('.uk-width-large-2-3');
  const right = grid.querySelector('.uk-width-large-1-3');

  // LEFT COLUMN extraction
  // 1. Main text (intro paragraphs and bullet list)
  const leftText = left ? left.querySelector('.text.parbase .gef-main-content') : null;
  // 2. Main image (figure)
  const leftImage = left ? left.querySelector('.image figure') : null;
  // 3. Fact sheet block (blue card)
  const leftFactSheet = left ? left.querySelector('.uk-card.card-blue') : null;

  // RIGHT COLUMN extraction
  // 1. Navigation: heading + nav block (sidebar)
  let rightNavHeading = null;
  let rightNavBlock = null;
  if (right) {
    rightNavHeading = right.querySelector('h2');
    rightNavBlock = right.querySelector('nav');
  }
  const rightNav = [];
  if (rightNavHeading) rightNav.push(rightNavHeading);
  if (rightNavBlock) rightNav.push(rightNavBlock);

  // HEADER row
  const headerRow = ['Columns (columns48)'];
  // ROW 1: left = main text, right = image
  const row1 = [leftText ? leftText : '', leftImage ? leftImage : ''];
  // ROW 2: left = fact sheet, right = navigation
  const row2 = [leftFactSheet ? leftFactSheet : '', rightNav.length ? rightNav : ''];

  // Compose table
  const cells = [headerRow, row1, row2];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
