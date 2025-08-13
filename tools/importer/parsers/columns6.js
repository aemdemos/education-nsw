/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row, matching exactly
  const headerRow = ['Columns (columns6)'];

  // Find the side-by-side columns container
  const wrapper = element.querySelector('.gel-banner.fifty_fifty_warpper.row');
  if (!wrapper) return;

  // Get all direct column children
  // These are .gel-banner__content (text/button) and .media-container (images)
  const columns = Array.from(wrapper.children);

  // Left column: text/button
  let contentCell = null;
  // Right column: images
  let imageCell = null;

  // Identify columns by class (regardless of order)
  columns.forEach((col) => {
    if (col.classList.contains('gel-banner__content')) {
      // Gather elements: h2, p, a (button), in their original order
      const items = [];
      col.childNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Only elements
          items.push(node);
        }
      });
      contentCell = items;
    } else if (col.querySelector('.media-container')) {
      // Images column: find first img inside .media-container
      const imgDiv = col.querySelector('.media-container');
      if (imgDiv) {
        const img = imgDiv.querySelector('img');
        if (img) {
          imageCell = img;
        }
      }
    }
  });

  // Fallback: If not found by class, try by order (first col is content, second is image)
  if (!contentCell && columns[0]) {
    const col = columns[0];
    const items = [];
    col.childNodes.forEach((node) => {
      if (node.nodeType === 1) {
        items.push(node);
      }
    });
    if (items.length) {
      contentCell = items;
    }
  }
  if (!imageCell && columns[1]) {
    const imgDiv = columns[1].querySelector('.media-container');
    if (imgDiv) {
      const img = imgDiv.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }
  }

  // Ensure both cells present
  const tableRow = [contentCell || '', imageCell || ''];

  // Compose table rows
  const rows = [
    headerRow,
    tableRow
  ];

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
