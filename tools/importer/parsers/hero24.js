/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Get the main desktop (web) image for the background row, fallback to any img
  let img = element.querySelector('img.img-web-rendition') || element.querySelector('img');

  // 2. Compose the content block (headline, subheading, CTA)
  // Get content container, fallback to the overlay/parent if not found
  let contentContainer = element.querySelector('.banner__content-container')
    || element.querySelector('.gel-banner__content')
    || element;

  const contentElements = [];
  // Get heading(s)
  const heading = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) contentElements.push(heading);
  // Get paragraph(s)
  contentContainer.querySelectorAll('p').forEach(p => {
    // Avoid empty paragraphs
    if (p.textContent.trim()) contentElements.push(p);
  });
  // Get CTA/button
  const btn = contentContainer.querySelector('a');
  if (btn) contentElements.push(btn);

  // 3. Build the Hero block table
  // Must match the example: 1 column, 3 rows, with exactly 'Hero' (not bold, not markdown) as the header
  const cells = [
    ['Hero'],
    [img ? img : ''],
    [contentElements.length ? contentElements : '']
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
