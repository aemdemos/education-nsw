/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: header and rows
  const headerRow = ['Accordion (accordion10)'];

  // Find all accordion sections: .text.parbase blocks
  const sectionBlocks = Array.from(element.querySelectorAll('.text.parbase'));

  // Find image block (if present)
  let imageEl = null;
  const imageDiv = element.querySelector('.image.parbase');
  if (imageDiv) {
    const fig = imageDiv.querySelector('figure');
    if (fig && fig.querySelector('img')) {
      imageEl = fig;
    }
  }

  // Compose accordion rows
  const rows = [];

  sectionBlocks.forEach((block, idx) => {
    // Defensive: find the main content inside this block
    const contentWrap = block.querySelector('.gef-main-content');
    if (!contentWrap) return;
    // Find heading (h4)
    const heading = contentWrap.querySelector('h4');
    const title = heading ? heading.textContent.trim() : '';
    // Gather all paragraphs after heading
    const contentNodes = [];
    let foundHeading = false;
    for (const child of contentWrap.childNodes) {
      if (!foundHeading && child.nodeType === 1 && child.tagName === 'H4') {
        foundHeading = true;
        continue;
      }
      if (foundHeading && child.nodeType === 1 && child.tagName === 'P' && child.textContent.trim()) {
        contentNodes.push(child);
      }
    }
    // If there are only <p></p> elements with no text, skip them
    const filteredContent = contentNodes.filter(p => p.textContent.trim());
    // For the first section, include the image if present
    let cellContent = filteredContent.length === 1 ? filteredContent[0] : filteredContent;
    if (idx === 0 && imageEl) {
      cellContent = [imageEl, ...filteredContent];
    }
    rows.push([title, cellContent]);
  });

  // Only include rows with titles (avoid empty ones)
  const validRows = rows.filter(r => r[0]);

  // Build final table
  const cells = [headerRow, ...validRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
