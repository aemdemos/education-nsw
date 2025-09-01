/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header
  const cells = [['Cards (cards19)']];

  // Get the main page content
  const mainContent = element.querySelector('.gef-main-content.sws-content');
  if (!mainContent) return;

  const children = Array.from(mainContent.children);
  let i = 0;
  while (i < children.length) {
    const imageBlock = children[i];
    if (imageBlock.classList.contains('image')) {
      // Reference the existing image element
      const img = imageBlock.querySelector('img');
      if (!img) { i++; continue; }
      // Gather all directly following text blocks
      let textNodes = [];
      let j = i + 1;
      while (j < children.length && children[j].classList.contains('text')) {
        const contentDiv = children[j].querySelector('.gef-main-content') || children[j];
        // Use all <p> as separate elements, preserving inner structure
        const ps = Array.from(contentDiv.querySelectorAll('p')).filter(p => p.textContent.trim() !== '');
        textNodes.push(...ps);
        j++;
      }
      // Fallback in case no <p> found: use entire contentDivs
      if (textNodes.length === 0 && j > i + 1) {
        for (let k = i + 1; k < j; k++) {
          const contentDiv = children[k].querySelector('.gef-main-content') || children[k];
          textNodes.push(contentDiv);
        }
      }
      // Combine as a single cell
      if (img && textNodes.length > 0) {
        cells.push([
          img,
          textNodes.length === 1 ? textNodes[0] : textNodes
        ]);
      }
      i = j;
    } else {
      i++;
    }
  }

  // Create and replace with the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
