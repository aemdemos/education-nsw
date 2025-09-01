/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content column (exclude sidebar)
  let grid = element.querySelector('.uk-grid');
  let mainCol = null;
  if (grid) {
    mainCol = grid.querySelector('.uk-width-large-2-3');
  }
  if (!mainCol) mainCol = element; // fallback

  // --- Get hero image (first image in main content) ---
  let imageElem = null;
  const img = mainCol.querySelector('img');
  if (img) {
    imageElem = img;
  }

  // --- Get all text content blocks (all .text.parbase in order) ---
  // Each .text.parbase contains a .gef-main-content with meaningful content
  // Collect all non-empty direct children <p>, <h1>-<h6>, <ul>, <ol>, etc.
  const textCellContent = [];
  const textParbases = mainCol.querySelectorAll('.text.parbase');
  textParbases.forEach(parbase => {
    const mainContent = parbase.querySelector('.gef-main-content');
    if (mainContent) {
      Array.from(mainContent.children).forEach(child => {
        if (
          child.textContent.trim() === '' &&
          child.tagName.toLowerCase() === 'p'
        ) {
          return; // skip empty paragraph
        }
        textCellContent.push(child);
      });
    }
  });

  // --- Table rows per block requirements: header, image, then text ---
  const cells = [
    ['Hero (hero33)'],
    [imageElem ? imageElem : ''],
    [textCellContent]
  ];

  // Replace the original element with the new block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
