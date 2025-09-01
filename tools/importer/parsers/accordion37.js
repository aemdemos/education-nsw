/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content column
  const grid = element.querySelector('.uk-grid');
  if (!grid) return;
  const mainCol = grid.querySelector('.uk-width-large-2-3');
  if (!mainCol) return;

  // Main content container
  const contentRoot = mainCol.querySelector('.gef-main-content.sws-content');
  if (!contentRoot) return;
  const blocks = Array.from(contentRoot.children);

  // Helper: collects all meaningful child nodes from a .gef-main-content block
  function getNodes(inner) {
    return Array.from(inner.childNodes).filter(node => {
      if (node.nodeType === 1 && node.tagName === 'P' && node.textContent.trim() === '') return false;
      return !(node.nodeType === 3 && node.textContent.trim() === '');
    });
  }

  // Find all accordion sections (h2s with following content)
  const accordionRows = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const inner = block.querySelector('.gef-main-content.sws-content, .gef-main-content.sws-remove-external-link-anchor-tags.sws-content');
    if (!inner) continue;
    const h2 = inner.querySelector('h2');
    if (block.classList.contains('text') && h2) {
      // Title is the heading element
      const titleCell = h2;
      // Content: everything after the h2 in 'inner', plus all non-heading/empty sibling blocks until the next heading
      const contentCell = [];
      let foundH2 = false;
      for (const node of inner.childNodes) {
        if (node === h2) {
          foundH2 = true;
          continue;
        }
        if (!foundH2) continue;
        if ((node.nodeType === 1 && node.tagName === 'P' && node.textContent.trim() === '') || (node.nodeType === 3 && node.textContent.trim() === '')) continue;
        contentCell.push(node);
      }
      // Add subsequent blocks until the next h2 (but not include another heading)
      for (let j = i + 1; j < blocks.length; j++) {
        const sibling = blocks[j];
        // Check if this sibling is a heading-parbase block
        const siblingInner = sibling.querySelector('.gef-main-content.sws-content, .gef-main-content.sws-remove-external-link-anchor-tags.sws-content');
        const siblingH2 = siblingInner ? siblingInner.querySelector('h2') : null;
        if (siblingH2) break; // Next accordion section
        if (sibling.classList.contains('image')) {
          // If it's an image block, add the figure
          const fig = sibling.querySelector('figure');
          if (fig) contentCell.push(fig);
        } else if (sibling.classList.contains('text') && siblingInner) {
          // Add all meaningful nodes
          contentCell.push(...getNodes(siblingInner));
        }
      }
      // Only add this row if it contains at least some content
      accordionRows.push([titleCell, contentCell.length === 1 ? contentCell[0] : contentCell]);
    }
  }

  const cells = [
    ['Accordion (accordion37)'],
    ...accordionRows
  ];

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
