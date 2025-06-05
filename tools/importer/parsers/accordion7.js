/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion7)'];

  // Find the accordion container (should have class nsw-accordion)
  let accordion = element;
  if (!accordion.classList.contains('nsw-accordion')) {
    accordion = element.querySelector('.nsw-accordion');
  }
  if (!accordion) {
    // If still not found, fallback to input element
    accordion = element;
  }

  // Get all accordion item title and content pairs
  // The order in HTML is: .nsw-accordion__title, .nsw-accordion__content, ...
  const rows = [headerRow];
  const children = Array.from(accordion.children);
  for (let i = 0; i < children.length; i++) {
    const titleDiv = children[i];
    if (titleDiv.classList.contains('nsw-accordion__title')) {
      // Find matching content (the next .nsw-accordion__content sibling)
      let contentDiv = null;
      for (let j = i + 1; j < children.length; j++) {
        if (children[j].classList.contains('nsw-accordion__content')) {
          contentDiv = children[j];
          break;
        }
        if (children[j].classList.contains('nsw-accordion__title')) {
          // If another title is found before content, skip this entry
          break;
        }
      }
      // Extract the title text from the button (exclude icon span)
      let titleText = '';
      const button = titleDiv.querySelector('button');
      if (button) {
        // Concatenate only text nodes (excluding icon span)
        let titleParts = [];
        for (let k = 0; k < button.childNodes.length; k++) {
          const node = button.childNodes[k];
          if (node.nodeType === 3) { // 3 === TEXT_NODE
            titleParts.push(node.textContent.trim());
          }
        }
        titleText = titleParts.join(' ').replace(/\s+/g, ' ').trim();
      }
      // Content cell: Use the .nsw-wysiwyg-content element if present, else the contentDiv itself
      let contentCell = '';
      if (contentDiv) {
        const wysiwyg = contentDiv.querySelector('.nsw-wysiwyg-content');
        contentCell = wysiwyg ? wysiwyg : contentDiv;
      }
      // Only add if there is any content (graceful if missing)
      rows.push([titleText, contentCell]);
    }
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
