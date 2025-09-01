/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid that contains the two columns
  const mainGrid = element.querySelector('.uk-grid');
  if (!mainGrid) return;

  // Get the left and right columns
  let leftCol = null;
  let rightCol = null;
  const cols = mainGrid.querySelectorAll(':scope > div');
  for (const col of cols) {
    if (col.classList.contains('gef-main-content')) {
      leftCol = col;
    }
    if (col.classList.contains('sws-content__side-nav')) {
      rightCol = col;
    }
  }
  if (!leftCol || !rightCol) return;

  // LEFT COLUMN: Aggregate all content inside the main left block
  // (excluding the #backtotop block)
  const leftContent = [];
  // The content is inside leftCol > .gef-main-content#sws-content
  const mainContent = leftCol.querySelector('.gef-main-content#sws-content');
  if (mainContent) {
    // For each .text.parbase, add its .gef-main-content child
    const textBlocks = mainContent.querySelectorAll(':scope > .text.parbase');
    for (const textBlock of textBlocks) {
      const gefBlock = textBlock.querySelector(':scope > .gef-main-content');
      if (gefBlock) {
        // Remove empty <p> at start and end for cleaner output
        const psAll = gefBlock.querySelectorAll(':scope > p');
        psAll.forEach(p => {
          if (!p.textContent.trim() && !p.children.length) {
            p.remove();
          }
        });
        leftContent.push(gefBlock);
      }
    }
  }
  // If, for some reason, no .gef-main-content found, fallback to leftCol
  if (leftContent.length === 0) leftContent.push(leftCol);

  // RIGHT COLUMN: Navigation menu only
  const nav = rightCol.querySelector('nav');
  const rightContent = nav ? [nav] : [rightCol];

  // Build the table as required
  const cells = [
    ['Columns (columns2)'],
    [leftContent, rightContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
