/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the columns
  const grid = element.querySelector('.uk-grid');
  if (!grid) return;

  // Get the left (main) and right (side nav) columns
  // .uk-width-large-2-3 is the main content, .uk-width-large-1-3 is the side navigation
  const leftCol = grid.querySelector('.uk-width-large-2-3');
  const rightCol = grid.querySelector('.uk-width-large-1-3');

  if (!leftCol || !rightCol) return;

  // In the left column, get the main content wrapper
  const mainContent = leftCol.querySelector('.gef-main-content#sws-content');
  if (!mainContent) return;

  // Collect all content blocks from mainContent (image blocks and text blocks)
  const leftContentEls = [];
  Array.from(mainContent.children).forEach(child => {
    // If image block
    if (child.classList.contains('image')) {
      const fig = child.querySelector('figure');
      if (fig) leftContentEls.push(fig);
    }
    // If text block
    if (child.classList.contains('text')) {
      const content = child.querySelector('.gef-main-content');
      // Only push non-empty blocks
      if (content && content.textContent.trim().length > 0) {
        leftContentEls.push(content);
      }
    }
  });

  // In the right column, get the nav (side navigation)
  let rightContent = null;
  const nav = rightCol.querySelector('nav');
  if (nav && nav.textContent.trim().length > 0) {
    rightContent = nav;
  } else {
    // fallback: include the whole rightCol if nav is missing or empty
    rightContent = rightCol;
  }

  // Header row must match exactly
  const headerRow = ['Columns (columns23)'];
  // Second row: left column = all extracted left content (array), right column = nav (side nav menu)
  const contentRow = [leftContentEls, rightContent];
  const cells = [headerRow, contentRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Set header row to span two columns
  const trHeader = table.querySelector('tr');
  if (trHeader && trHeader.children.length === 1) {
    trHeader.children[0].setAttribute('colspan', '2');
  }

  // Replace the original element with the new table
  element.replaceWith(table);
}
