/* global WebImporter */
export default function parse(element, { document }) {
  // Table header EXACTLY as in example
  const headerRow = ['Columns (columns47)'];

  // The HTML structure has a grid with two columns:
  // Left: main content (.uk-width-large-2-3), Right: side nav (.uk-width-large-1-3)
  const grid = element.querySelector('.uk-grid');

  // Find left and right columns
  const mainCol = grid && grid.querySelector('.uk-width-large-2-3.gef-main-content');
  const sideCol = grid && grid.querySelector('.uk-width-large-1-3.sws-content__side-nav');

  // Get main content: reference the div containing copy
  let mainContent = null;
  if (mainCol) {
    // Find the deepest content div
    // .gef-main-content.sws-content contains .text.parbase > .gef-main-content.sws-remove-external-link-anchor-tags.sws-content
    const innerContent = mainCol.querySelector('.gef-main-content.sws-remove-external-link-anchor-tags.sws-content');
    if (innerContent && innerContent.textContent.trim() !== '') {
      mainContent = innerContent;
    } else {
      // fallback: reference the largest content block
      mainContent = mainCol;
    }
  } else {
    // fallback: empty cell
    mainContent = document.createElement('div');
  }

  // Get side nav content
  let sideContent = null;
  if (sideCol) {
    // Reference the nav containing the links if possible
    const nav = sideCol.querySelector('nav#sws-side-navigation');
    if (nav) {
      sideContent = nav;
    } else {
      sideContent = sideCol;
    }
  } else {
    // fallback: empty cell
    sideContent = document.createElement('div');
  }

  // Table structure: header row, second row with columns
  const cells = [
    headerRow,
    [mainContent, sideContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element with the block table
  element.replaceWith(table);
}
