/* global WebImporter */
export default function parse(element, { document }) {
  // Get the aside containing the banner
  const aside = element.querySelector('aside.gel-banner-container');
  if (!aside) return;

  // Get columns wrapper
  const colsWrapper = aside.querySelector('.fifty_fifty_warpper.row');
  if (!colsWrapper) return;

  // Get the two column elements
  const columns = colsWrapper.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  let imageCol = null, contentCol = null;
  columns.forEach(col => {
    if (col.classList.contains('gel-banner__content')) {
      contentCol = col;
    } else {
      imageCol = col;
    }
  });

  // Right column: image
  let imageCellContent = [];
  if (imageCol) {
    // Use only the first img that is actually present
    const imgs = imageCol.querySelectorAll('img');
    if (imgs.length > 0) {
      imageCellContent.push(imgs[0]);
    }
  }

  // Left column: heading, paragraph, button
  let textCellContent = [];
  if (contentCol) {
    // Use all direct children of .banner__content-container for robust content extraction
    const contentContainer = contentCol.querySelector('.banner__content-container');
    if (contentContainer) {
      // Only include existing elements in the content container
      contentContainer.childNodes.forEach(child => {
        // Only include elements (not text nodes)
        if (child.nodeType === 1) {
          textCellContent.push(child);
        }
      });
    } else {
      // Edge case: fallback to direct children
      contentCol.childNodes.forEach(child => {
        if (child.nodeType === 1) {
          textCellContent.push(child);
        }
      });
    }
  }

  // Build the table
  const cells = [
    ['Columns (columns23)'],
    [textCellContent, imageCellContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
