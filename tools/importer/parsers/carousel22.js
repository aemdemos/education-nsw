/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area where both images and text live
  const mainContent = element.querySelector('.gef-main-content.sws-content');
  if (!mainContent) return;
  const children = Array.from(mainContent.children);
  // Find all image.parbase blocks
  const imageBlocks = children.filter(el => 
    el.classList.contains('image') && el.classList.contains('parbase')
  );
  // For each image block, construct a slide row
  const slides = imageBlocks.map(imageBlock => {
    // Get the <img>
    const img = imageBlock.querySelector('img');
    // Find adjacent text.parbase blocks:
    // Check previous siblings until hitting another image.parbase or start
    let textBlocks = [];
    let prev = imageBlock.previousElementSibling;
    while (prev && prev.classList.contains('text') && prev.classList.contains('parbase')) {
      if (prev.textContent.trim()) textBlocks.unshift(prev); // keep order
      prev = prev.previousElementSibling;
    }
    // Check next siblings until hitting another image.parbase or end
    let next = imageBlock.nextElementSibling;
    while (next && next.classList.contains('text') && next.classList.contains('parbase')) {
      if (next.textContent.trim()) textBlocks.push(next);
      next = next.nextElementSibling;
    }
    // Only use unique blocks
    const uniqueTextBlocks = Array.from(new Set(textBlocks));
    // If we have any text blocks, use array, else empty string
    return [img, uniqueTextBlocks.length ? uniqueTextBlocks : ''];
  });
  // Construct table
  const headerRow = ['Carousel (carousel22)'];
  const cells = [headerRow, ...slides];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
