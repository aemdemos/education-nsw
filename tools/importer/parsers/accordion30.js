/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row - exact match
  const cells = [['Accordion (accordion30)']];

  // Find all h2[id] which mark start of an accordion item
  const headings = Array.from(element.querySelectorAll('h2[id]'));

  // Get a flat list of all .text.parbase elements for easy traversal
  const parbaseDivs = Array.from(element.querySelectorAll('.text.parbase'));

  headings.forEach((heading, idx) => {
    // Title cell: reference existing element
    const titleCell = heading;

    // Content cell: gather all relevant content after the heading up to the next heading
    const contentNodes = [];

    // Get parent .gef-main-content of current heading
    const currentContentDiv = heading.closest('.gef-main-content');
    // Collect all siblings after heading within the same content div
    let node = heading.nextSibling;
    while (node) {
      // Only add non-heading, non-empty elements & meaningful text nodes
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'H2' && (node.textContent.trim() || node.querySelectorAll('*').length > 0)) {
        contentNodes.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // Wrap text node for safety
        const span = document.createElement('span');
        span.textContent = node.textContent;
        contentNodes.push(span);
      }
      node = node.nextSibling;
    }

    // Now collect subsequent .text.parbase divs until next heading
    let currParbaseIdx = parbaseDivs.findIndex(div => div.contains(heading));
    for (let i = currParbaseIdx + 1; i < parbaseDivs.length; i++) {
      // Stop when hit next heading
      if (headings[idx + 1] && parbaseDivs[i].contains(headings[idx + 1])) break;
      // Extract all children from gef-main-content inside this .text.parbase, skip h2[id]
      const contentMain = parbaseDivs[i].querySelector('.gef-main-content');
      if (contentMain) {
        Array.from(contentMain.childNodes).forEach(n => {
          if (
            (n.nodeType === Node.ELEMENT_NODE && n.tagName !== 'H2' && (n.textContent.trim() || n.querySelectorAll('*').length > 0)) ||
            (n.nodeType === Node.TEXT_NODE && n.textContent.trim())
          ) {
            if (n.nodeType === Node.TEXT_NODE) {
              const span = document.createElement('span');
              span.textContent = n.textContent;
              contentNodes.push(span);
            } else {
              contentNodes.push(n);
            }
          }
        });
      }
    }

    // Also check for .contentBox immediately after this section and before next heading
    let currBox = currentContentDiv.parentElement.nextElementSibling;
    const nextHeading = headings[idx + 1];
    while (currBox && !(nextHeading && currBox.contains(nextHeading))) {
      if (currBox.classList.contains('contentBox')) {
        const card = currBox.querySelector('.uk-card');
        if (card) contentNodes.push(card);
      }
      currBox = currBox.nextElementSibling;
      if (nextHeading && currBox && currBox.contains(nextHeading)) break;
    }

    // If nothing found, create empty div for cell
    let contentCell = contentNodes.length === 0
      ? document.createElement('div')
      : (contentNodes.length === 1 ? contentNodes[0] : contentNodes);

    cells.push([titleCell, contentCell]);
  });

  // Create and replace the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
