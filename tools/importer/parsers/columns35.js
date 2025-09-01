/* global WebImporter */
export default function parse(element, { document }) {
  // --- HEADER ROW ---
  const headerRow = ['Columns (columns35)'];

  // --- COLUMN EXTRACTION ---
  // Left column: main content block
  const leftCol = element.querySelector('.uk-width-large-2-3');
  const leftContent = [];
  if (leftCol) {
    // Image at the top
    const imgFigure = leftCol.querySelector('.image.parbase figure');
    if (imgFigure) leftContent.push(imgFigure);
    // Main body text (paragraphs, lists etc)
    const textBox = leftCol.querySelector('.text.parbase .sws-content');
    if (textBox && textBox.textContent.trim()) leftContent.push(textBox);
    // Blue card at the bottom (if present)
    const blueCard = leftCol.querySelector('.contentBox .uk-card');
    if (blueCard) leftContent.push(blueCard);
  }

  // Right column: side navigation only
  const rightCol = element.querySelector('.uk-width-large-1-3');
  const rightContent = [];
  if (rightCol) {
    // Only include the section navigation menu, not the <h2>/<h3> (they're for screen readers)
    const nav = rightCol.querySelector('nav');
    if (nav) rightContent.push(nav);
  }

  // --- TABLE STRUCTURE ---
  // The block should be a single table with two columns, no extra rows
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // --- CREATE & REPLACE ---
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
