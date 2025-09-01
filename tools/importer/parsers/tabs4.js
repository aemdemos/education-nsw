/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, exactly as in the example
  const cells = [['Tabs (tabs4)']];

  // Get tab label dynamically from active nav item
  let tabLabel = '';
  const navActive = element.querySelector('.uk-width-large-1-3 .uk-active a');
  tabLabel = navActive && navActive.textContent.trim() ? navActive.textContent.trim() : 'Science and technology';

  // Collect all relevant tab content blocks in source order
  // Look for .gef-main-content.sws-content or fallback to main container
  let mainContent = element.querySelector('.gef-main-content.sws-content');
  if (!mainContent) mainContent = element;

  // Blocks to hold tab content
  const blocks = [];
  // Find all direct children (text or image)
  Array.from(mainContent.children).forEach(child => {
    if (child.classList.contains('text')) {
      // Find inner content block
      const textInner = child.querySelector('.gef-main-content.sws-content, .gef-main-content, .sws-content');
      if (textInner) {
        // Extract all non-empty paragraphs (and their markup)
        Array.from(textInner.querySelectorAll('p')).forEach(p => {
          if (p.textContent.trim()) blocks.push(p);
        });
      }
    }
    if (child.classList.contains('image')) {
      const fig = child.querySelector('figure');
      if (fig) blocks.push(fig);
    }
  });

  // Fallback: If blocks empty, try all paragraphs in mainContent
  if (!blocks.length) {
    Array.from(mainContent.querySelectorAll('p')).forEach(p => {
      if (p.textContent.trim()) blocks.push(p);
    });
  }

  // Insert 1 tab row: label and all content elements in a single cell (array)
  cells.push([tabLabel, blocks]);

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
