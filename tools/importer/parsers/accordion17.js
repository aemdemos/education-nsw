/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly the specification
  const headerRow = ['Accordion (accordion17)'];
  const rows = [headerRow];

  // Find all accordion content blocks inside the main content area
  // These are .text.parbase > .gef-main-content.sws-remove-external-link-anchor-tags.sws-content
  const accordionCandidates = Array.from(element.querySelectorAll('.text.parbase > .gef-main-content.sws-remove-external-link-anchor-tags.sws-content'));

  // Also check for any .gef-main-content.sws-remove-external-link-anchor-tags.sws-content directly under main content
  // (to handle variations)
  const extraCandidates = Array.from(element.querySelectorAll('.gef-main-content.sws-remove-external-link-anchor-tags.sws-content'));

  // Combine and deduplicate blocks
  const blocks = [...new Set([...accordionCandidates, ...extraCandidates])];

  // For each accordion item, get title and content
  blocks.forEach(block => {
    // Try h2, h3, strong, .sws-lead-paragraph, or first non-empty p as title
    let titleEl = block.querySelector('h2, h3');
    if (!titleEl) titleEl = block.querySelector('.sws-lead-paragraph');
    if (!titleEl) {
      // First non-empty p
      const ps = Array.from(block.querySelectorAll('p'));
      titleEl = ps.find(p => p.textContent.trim());
    }
    // If still no title, fallback to a generic title
    if (!titleEl) {
      titleEl = document.createElement('span');
      titleEl.textContent = 'Section';
    }

    // Content: Everything except the title element
    // Reference the existing elements directly, not clones
    // To do this: collect all children except titleEl
    let contentNodes = [];
    // If titleEl is a child of block, exclude it, else content is all children
    Array.from(block.childNodes).forEach(node => {
      if (node !== titleEl && !(node.nodeType === 1 && node.contains(titleEl))) {
        // Remove empty <p>
        if (node.nodeType === 1 && node.tagName === 'P' && !node.textContent.trim()) {
          return;
        }
        contentNodes.push(node);
      }
    });
    // If contentNodes is empty, put a <br>
    if (contentNodes.length === 0) {
      contentNodes = [document.createElement('br')];
    }
    rows.push([titleEl, contentNodes]);
  });

  // Also check for the card block (Behaviour Support and Management Plan)
  const cardBlock = element.querySelector('.uk-card.uk-card-default');
  if (cardBlock) {
    // Use the title (h3) as the accordion title
    const cardTitleEl = cardBlock.querySelector('h3');
    // Content is everything else in the card
    const cardContentNodes = [];
    Array.from(cardBlock.childNodes).forEach(node => {
      if (node !== cardTitleEl) {
        // Remove empty <p>
        if (node.nodeType === 1 && node.tagName === 'P' && !node.textContent.trim()) {
          return;
        }
        cardContentNodes.push(node);
      }
    });
    // If there is no content, add a <br>
    if (cardContentNodes.length === 0) {
      cardContentNodes.push(document.createElement('br'));
    }
    rows.push([cardTitleEl, cardContentNodes]);
  }

  // Build the accordion block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
