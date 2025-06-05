/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the feature block
  const feature = element.querySelector('.dcs-feature');
  if (!feature) return;

  // Left column: image
  let leftCol = null;
  const imageWrapper = feature.querySelector('.dcs-feature__image');
  if (imageWrapper) {
    // Prefer <picture>, fallback to <img>
    const picture = imageWrapper.querySelector('picture');
    if (picture) {
      leftCol = picture;
    } else {
      leftCol = imageWrapper.querySelector('img');
    }
  }

  // Right column: heading, description, button (in order)
  let rightColEls = [];
  const content = feature.querySelector('.dcs-feature__content');
  if (content) {
    const nodes = [];
    const title = content.querySelector('.dcs-feature__title');
    if (title) nodes.push(title);
    const html = content.querySelector('.dcs-feature__html');
    if (html) nodes.push(html);
    const button = content.querySelector('a');
    if (button) nodes.push(button);
    rightColEls = nodes;
  }

  // Compose the block table with the header row as a single cell
  const cells = [
    ['Columns (columns6)'],
    [leftCol, rightColEls],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
