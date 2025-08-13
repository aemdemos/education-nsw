/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion'];
  const rows = [];

  // Top-level showhide accordions (each is a section)
  const accordions = Array.from(element.querySelectorAll(':scope > div.showhide-v2'));

  accordions.forEach(acc => {
    // Title extraction
    const titleSpan = acc.querySelector('.gel-show-hide_title span');
    const title = titleSpan ? titleSpan.textContent.trim() : '';

    // Content extraction: get all relevant content inside the expanded section
    // Find the collapse content container
    const collapseContent = acc.querySelector('.gel-show-hide__content .card-body');
    let contentElements = [];
    if (collapseContent) {
      // Handle nested grid structure
      const grids = Array.from(collapseContent.querySelectorAll(':scope > div > div.aem-Grid.aem-Grid--12'));
      if (grids.length > 0) {
        grids.forEach(grid => {
          // Only add elements with meaningful content (text or table)
          Array.from(grid.children).forEach(child => {
            // Accept if it's a table or has non-empty text
            if (child.querySelector('table') || child.textContent.trim()) {
              contentElements.push(child);
            }
          });
        });
      } else {
        // fallback: direct children if no grid
        Array.from(collapseContent.children).forEach(child => {
          if (child.querySelector('table') || child.textContent.trim()) {
            contentElements.push(child);
          }
        });
      }
    }
    // Only add a row if we have a non-empty title
    if (title) {
      // If only one content element, use it directly; else use array
      rows.push([title, contentElements.length === 1 ? contentElements[0] : contentElements]);
    }
  });

  // Only create the block if we found accordions (matches example)
  if (rows.length) {
    const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
    element.replaceWith(table);
  }
}
