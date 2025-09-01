/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area
  let mainContent = element.querySelector('.gef-main-content.sws-content#sws-content');
  if (!mainContent) {
    mainContent = element.querySelector('.gef-main-content.sws-content');
  }
  if (!mainContent) return;

  // Find all relevant content blocks in order
  const contentBlocks = Array.from(mainContent.querySelectorAll(':scope > div.text > div.gef-main-content'));

  // We'll build accordion rows as [title, content]
  const rows = [];
  let currentTitle = null;
  let currentContentNodes = [];

  // Helper to flush an accordion section
  function flushAccordionItem() {
    if (currentTitle) {
      // If content is empty, add a blank div
      const cellContent = currentContentNodes.length
        ? currentContentNodes
        : [document.createElement('div')];
      rows.push([currentTitle, cellContent.length === 1 ? cellContent[0] : cellContent]);
      currentTitle = null;
      currentContentNodes = [];
    }
  }

  // Iterate through each content block
  contentBlocks.forEach(block => {
    // If this block contains an h2: new accordion item
    const h2 = block.querySelector('h2');
    if (h2) {
      // Flush previous item
      flushAccordionItem();
      // Reference the h2 directly (do not clone, keep it in the DOM structure for semantic meaning)
      currentTitle = h2;
      // Everything after h2 in this block is content for this item
      let foundTitle = false;
      Array.from(block.childNodes).forEach(node => {
        if (node === h2) {
          foundTitle = true;
          return;
        }
        if (!foundTitle) return;
        // Accept non-empty nodes
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Skip empty <p>s
          if (node.tagName === 'P' && !node.textContent.trim()) return;
          currentContentNodes.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent;
          currentContentNodes.push(span);
        }
      });
    } else if (currentTitle) {
      // If in an item, add all non-empty children as content
      Array.from(block.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'P' && !node.textContent.trim()) return;
          currentContentNodes.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent;
          currentContentNodes.push(span);
        }
      });
    }
  });
  // Flush final accordion item
  flushAccordionItem();

  if (rows.length) {
    const cells = [["Accordion (accordion3)"], ...rows];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
