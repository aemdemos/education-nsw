/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area where accordion sections are present
  let mainContent = element.querySelector('.gef-main-content.sws-content__content-page');
  if (!mainContent) {
    mainContent = element.querySelector('.gef-main-content.sws-content');
  }
  if (!mainContent) {
    mainContent = element;
  }

  // Collect all accordion sections
  const sectionDivs = Array.from(mainContent.querySelectorAll('.text.parbase > .gef-main-content'));
  const rows = [['Accordion (accordion1)']];

  sectionDivs.forEach(section => {
    // Collect all non-empty, visible nodes
    const contentNodes = [];
    let titleNode = null;
    Array.from(section.childNodes).forEach(node => {
      if (node.nodeType === 1 && node.tagName.toLowerCase() === 'p' && !node.textContent.trim()) {
        return;
      } else if (node.nodeType === 3 && !node.textContent.trim()) {
        return;
      } else if (!titleNode && node.nodeType === 1 && node.tagName.toLowerCase() === 'h2') {
        // First h2 is used as title
        titleNode = node;
        return;
      } else if (!titleNode && node.nodeType === 1 && node.classList && node.classList.contains('sws-lead-paragraph')) {
        // First span.sws-lead-paragraph as title
        titleNode = node;
        return;
      } else if (!titleNode && node.nodeType === 1 && node.tagName.toLowerCase() === 'p') {
        // First non-empty <p> as title
        titleNode = node;
        return;
      } else {
        // Add to content, skip the title node
        contentNodes.push(node);
      }
    });
    if (!titleNode) {
      // Try fallback: find first non-empty text node
      for (const node of section.childNodes) {
        if (node.nodeType === 3 && node.textContent.trim()) {
          titleNode = document.createElement('span');
          titleNode.textContent = node.textContent.trim();
          break;
        }
      }
    }
    // If no content, use empty string
    rows.push([
      titleNode,
      contentNodes.length === 1 ? contentNodes[0] : (contentNodes.length ? contentNodes : '')
    ]);
  });

  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
