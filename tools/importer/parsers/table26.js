/* global WebImporter */
export default function parse(element, { document }) {
  // Find all text/content blocks (include paragraphs, headings, table, etc.), maintain order.
  // The content is inside .gef-main-content.sws-content, but sometimes nested deeper.
  let main;
  // Try to find the inner content div with the text/table blocks
  main = element.querySelector('.gef-main-content#sws-content');
  if (!main) {
    // fallback: use first .gef-main-content or the element itself
    main = element.querySelector('.gef-main-content') || element;
  }
  // Gather all .text.parbase children (these hold content groups like intro text, table, newsletter, etc.)
  const textBlocks = Array.from(main.querySelectorAll(':scope > .text.parbase'));
  // Defensive: if no such blocks, fallback to all direct children
  const blocks = textBlocks.length > 0 ? textBlocks : Array.from(main.children);
  // For each content block, collect their children (including text, tables, headings, etc.)
  const allContent = [];
  blocks.forEach(block => {
    // Get all contentful children in order
    Array.from(block.childNodes).forEach(node => {
      // Keep elements and non-empty text nodes
      if (
        (node.nodeType === Node.ELEMENT_NODE && (
          node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE')
        ) || 
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
      ) {
        allContent.push(node);
      }
    });
  });
  // If no content is found, as last resort use main's childNodes
  if (allContent.length === 0) {
    Array.from(main.childNodes).forEach(node => {
      if (
        (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
      ) {
        allContent.push(node);
      }
    });
  }
  // Build the table block: header, then a single cell for all content (retains structure and all text)
  const cells = [
    ['Table (table26)'],
    [allContent]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
