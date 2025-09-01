/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid with two columns
  const grid = element.querySelector('.uk-grid');
  if (!grid) return;

  // Find left (main) and right (side nav) columns
  const leftCol = grid.querySelector('.uk-width-large-2-3');
  const rightCol = grid.querySelector('.uk-width-large-1-3');
  if (!leftCol || !rightCol) return;

  // LEFT COLUMN: get all main content paragraphs and images
  // Find main content wrapper
  let mainContent = leftCol.querySelector('.gef-main-content#sws-content');
  if (!mainContent) mainContent = leftCol;

  // Get all visible (non-empty) paragraphs in order
  const textBlocks = [];
  mainContent.querySelectorAll('.text .gef-main-content p, .text p').forEach(p => {
    if (p.textContent.trim().length > 0) textBlocks.push(p);
  });

  // Get any images (figures) after the text content
  const imageBlocks = [];
  mainContent.querySelectorAll('.image figure').forEach(fig => {
    imageBlocks.push(fig);
  });

  // Compose left cell with all text and image content in order
  const leftCell = [...textBlocks, ...imageBlocks];

  // RIGHT COLUMN: get navigation and headings
  const rightCell = [];
  // add visually hidden section heading if present
  const navHeading = rightCol.querySelector('h2.show-on-sr');
  if (navHeading) rightCell.push(navHeading);
  // add navigation
  const nav = rightCol.querySelector('nav');
  if (nav) rightCell.push(nav);

  // Build columns block table
  const headerRow = ['Columns (columns7)'];
  const contentRow = [leftCell, rightCell];
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  element.replaceWith(table);
}
