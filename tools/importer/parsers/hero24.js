/* global WebImporter */
export default function parse(element, { document }) {
  // Select the main hero image: prefer desktop rendition, otherwise first image
  let img = element.querySelector('.img-web-rendition');
  if (!img) {
    img = element.querySelector('img');
  }

  // Gather hero overlay content: heading, paragraph, CTA button
  const overlay = element.querySelector('.gel-banner__content');
  const overlayContent = [];
  if (overlay) {
    // Heading (using the largest heading inside overlay)
    const heading = overlay.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) overlayContent.push(heading);
    // Paragraph (first paragraph inside overlay)
    const paragraph = overlay.querySelector('p');
    if (paragraph) overlayContent.push(paragraph);
    // CTA button (first anchor inside overlay)
    const cta = overlay.querySelector('a');
    if (cta) overlayContent.push(cta);
  }

  // Table: strictly 1 column, 3 rows as per example
  const tableRows = [
    ['Hero'],
    [img ? img : ''],
    [overlayContent.length ? overlayContent : '']
  ];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
