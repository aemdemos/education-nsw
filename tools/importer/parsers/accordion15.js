/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid
  const grid = element.querySelector('.uk-grid');
  if (!grid) return;
  // Find the main content column
  const mainCol = grid.querySelector('.uk-width-large-2-3.gef-main-content');
  if (!mainCol) return;
  // Find all accordion sections
  const textSections = mainCol.querySelectorAll(':scope > .text.parbase');
  const rows = [];
  // Header row - exactly as block name, one column
  rows.push(['Accordion (accordion15)']);

  // For each accordion section, extract title and content
  textSections.forEach(section => {
    const contentBlock = section.querySelector('.gef-main-content.sws-content');
    if (!contentBlock) return;
    // Find all meaningful children (skip empty p's and whitespace)
    const meaningfulNodes = Array.from(contentBlock.childNodes).filter(node => {
      if (node.nodeType === 3) return !!node.textContent.trim(); // non-empty text
      if (node.nodeType === 1 && node.tagName === 'P') return !!node.textContent.trim();
      if (node.nodeType === 1) return true;
      return false;
    });

    // Title: first heading (h1-h6), or first non-empty paragraph/span
    let title = null;
    let contentNodes = [];
    let foundTitle = false;
    for (let i = 0; i < meaningfulNodes.length; i++) {
      const node = meaningfulNodes[i];
      if (!foundTitle) {
        if (node.nodeType === 1 && /^H[1-6]$/.test(node.tagName)) {
          title = node;
          foundTitle = true;
          continue;
        } else if (node.nodeType === 1 && (node.tagName === 'P' || node.tagName === 'SPAN') && node.textContent.trim()) {
          title = node;
          foundTitle = true;
          continue;
        }
      }
      if (foundTitle) {
        contentNodes.push(node);
      }
    }
    // If no title found, use first non-empty element as title, rest as content
    if (!title && meaningfulNodes.length > 0) {
      title = meaningfulNodes[0];
      contentNodes = meaningfulNodes.slice(1);
    }
    // Ensure content cell is never empty
    if (!contentNodes.length) {
      const emptyDiv = document.createElement('div');
      contentNodes = [emptyDiv];
    }
    rows.push([title, contentNodes]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
