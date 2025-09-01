/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content block that contains both images and text blocks
  const mainContent = element.querySelector('.gef-main-content.sws-content');
  if (!mainContent) return;

  // Collect the image and text blocks in the order they appear
  const blocks = Array.from(mainContent.children).filter(child =>
    child.classList.contains('image') || child.classList.contains('text')
  );

  // Pair blocks into cards: always image + text (in any order)
  const cards = [];
  let i = 0;
  while (i < blocks.length) {
    let imageBlock = null;
    let textBlock = null;
    if (blocks[i].classList.contains('image')) {
      imageBlock = blocks[i];
      // Next block might be text
      if (i+1 < blocks.length && blocks[i+1].classList.contains('text')) {
        textBlock = blocks[i+1];
        i += 2;
      } else {
        // No paired text block (should not happen in this example, but fallback)
        i++;
      }
    } else if (blocks[i].classList.contains('text')) {
      textBlock = blocks[i];
      if (i+1 < blocks.length && blocks[i+1].classList.contains('image')) {
        imageBlock = blocks[i+1];
        i += 2;
      } else {
        // No paired image block (should not happen in this example, but fallback)
        i++;
      }
    }
    // Add only cards with both image and text
    if (imageBlock && textBlock) {
      cards.push([imageBlock, textBlock]);
    }
  }

  // Fallback: zip images and text blocks by index (in case of unexpected structure)
  if (cards.length === 0) {
    const images = blocks.filter(b => b.classList.contains('image'));
    const texts = blocks.filter(b => b.classList.contains('text'));
    const minLen = Math.min(images.length, texts.length);
    for (let j = 0; j < minLen; j++) {
      cards.push([images[j], texts[j]]);
    }
  }

  // Header row as in the example
  const cells = [['Cards (cards20)']];

  // For each card: image in first cell, full text (all formatting) in second cell
  cards.forEach(([imageBlock, textBlock]) => {
    // Get the <img> element in the image block
    const img = imageBlock.querySelector('img');
    // Get the deepest content block inside the text block
    let textContentRoot = textBlock.querySelector(
      '.gef-main-content.sws-content, .gef-main-content.sws-remove-external-link-anchor-tags.sws-content'
    ) || textBlock;
    // Gather all children with meaningful content
    const textElements = Array.from(textContentRoot.children).filter(el =>
      el.textContent && el.textContent.replace(/\u00a0/g, '').trim() !== ''
    );
    const cellContent = textElements.length > 0 ? textElements : textContentRoot.textContent.trim();
    cells.push([img, cellContent]);
  });

  // Create and replace with block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
