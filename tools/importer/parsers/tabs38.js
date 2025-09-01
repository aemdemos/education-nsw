/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match: Tabs (tabs38)
  const headerRow = ['Tabs (tabs38)'];

  // Try to dynamically extract the active tab label from the navigation (not hardcoded)
  let tabLabel = '';
  const activeTabSpan = element.querySelector(
    '.uk-width-large-1-3 .sws-side__sublist-block.uk-active .sws-side__list-item span'
  );
  if (activeTabSpan && activeTabSpan.textContent.trim().length > 0) {
    tabLabel = activeTabSpan.textContent.trim();
  } else {
    // fallback: first nav section with a .sws-side__list-item span
    const firstTabSpan = element.querySelector('.uk-width-large-1-3 .sws-side__list-item span');
    tabLabel = firstTabSpan ? firstTabSpan.textContent.trim() : 'About our school';
  }

  // Compose tab content:
  // Find main content column
  const grid = element.querySelector('.uk-grid');
  const mainCol = grid && grid.querySelector('.uk-width-large-2-3');
  const mainContent = mainCol && mainCol.querySelector('#sws-content');

  // Gather image element (if present)
  let imageElement = null;
  if (mainContent) {
    const imageParbase = mainContent.querySelector('.image.parbase');
    if (imageParbase) {
      const figure = imageParbase.querySelector('figure');
      if (figure) imageElement = figure;
    }
  }

  // Gather all non-empty text parbase blocks (retaining semantic structure)
  let textBlocks = [];
  if (mainContent) {
    const textParbases = mainContent.querySelectorAll('.text.parbase');
    textParbases.forEach(tb => {
      // Avoid empty blocks
      if (tb.textContent.replace(/\s+/g, '').length > 0) {
        textBlocks.push(tb);
      }
    });
  }

  // Compose the cell content: always image first if present, then text blocks
  const tabContent = [];
  if (imageElement) tabContent.push(imageElement);
  tabContent.push(...textBlocks);

  // Compose the table exactly as per example: header row (one cell), next row [tabLabel, tabContent]
  const cells = [
    headerRow,
    [tabLabel, tabContent]
  ];

  // Replace the original element with the new table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
