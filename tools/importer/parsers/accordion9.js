/* global WebImporter */
export default function parse(element, { document }) {
  // The header row as required
  const headerRow = ['Accordion (accordion9)'];

  // Find the main content area containing the accordion items
  let mainContent = element.querySelector('.uk-width-large-2-3.gef-main-content.sws-content__content-page');
  if (!mainContent) mainContent = element;
  const mainContentInner = mainContent.querySelector('#sws-content') || mainContent;
  const childBlocks = Array.from(mainContentInner.children);

  // Identify the image block if it exists at the top
  let imageBlock = null;
  if (childBlocks.length && childBlocks[0].classList.contains('image')) {
    imageBlock = childBlocks[0];
  }

  // Get all text blocks (accordion items)
  const textBlocks = childBlocks.filter(child => child.classList.contains('text'));

  const rows = [headerRow];

  textBlocks.forEach((block, idx) => {
    // Get main content div
    const contentDiv = block.querySelector('.gef-main-content.sws-remove-external-link-anchor-tags.sws-content') || block;
    // Find all heading tags (h2-h6)
    const headings = Array.from(contentDiv.querySelectorAll('h2,h3,h4,h5,h6'));

    if (headings.length) {
      headings.forEach((heading, hIdx) => {
        // Title = heading node
        const titleElem = heading;
        // Content = everything between this heading and next heading (or end)
        const sectionContent = [];
        let sibling = heading.nextSibling;
        while (sibling && !(sibling.nodeType === 1 && /H[2-6]/.test(sibling.tagName))) {
          // Only include non-empty nodes, and preserve formatting/lists/images
          if (sibling.nodeType === 3 && sibling.textContent.trim()) {
            sectionContent.push(document.createTextNode(sibling.textContent));
          } else if (sibling.nodeType === 1 && (sibling.textContent.trim() || sibling.tagName === 'UL' || sibling.tagName === 'OL' || sibling.tagName === 'IMG')) {
            sectionContent.push(sibling);
          }
          sibling = sibling.nextSibling;
        }
        // For the first heading in the first block, prepend the image if present
        if (idx === 0 && hIdx === 0 && imageBlock) {
          sectionContent.unshift(imageBlock);
        }
        // If sectionContent is empty, fallback to contentDiv
        rows.push([
          titleElem,
          sectionContent.length ? sectionContent : contentDiv
        ]);
      });
    } else {
      // Fallback: no heading, treat all as one item
      let sectionContent = Array.from(contentDiv.childNodes).filter(node => {
        if (node.nodeType === 3) return node.textContent.trim();
        if (node.nodeType === 1) return node.textContent.trim() || node.tagName === 'UL' || node.tagName === 'OL' || node.tagName === 'IMG';
        return false;
      });
      if (idx === 0 && imageBlock) sectionContent.unshift(imageBlock);
      rows.push([
        document.createTextNode(''),
        sectionContent.length ? sectionContent : contentDiv
      ]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
