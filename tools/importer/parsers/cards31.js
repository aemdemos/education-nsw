/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards31) block expects: header row, each card row (image, text)
  // Provided HTML: Only structural divs, no images/headings, but some text may be present
  // Task: Include all visible, non-hidden text found inside as a single card if present

  const headerRow = ['Cards (cards31)'];
  const rows = [headerRow];

  // Helper to recursively collect visible text content while skipping hidden or input/script/style elements
  function collectVisibleText(node) {
    let texts = [];
    if (!node || node.nodeType !== 1) return texts;
    // skip nodes hidden via aria-hidden or class
    if (node.getAttribute('aria-hidden') === 'true' || node.classList.contains('uk-hidden')) return texts;
    node.childNodes.forEach((child) => {
      if (child.nodeType === 3) {
        const txt = child.textContent.trim();
        if (txt) texts.push(txt);
      } else if (child.nodeType === 1) {
        if (
          child.tagName === 'INPUT' ||
          child.tagName === 'SCRIPT' ||
          child.tagName === 'STYLE' ||
          child.getAttribute('aria-hidden') === 'true' ||
          child.classList.contains('uk-hidden')
        ) {
          return;
        } else {
          texts = texts.concat(collectVisibleText(child));
        }
      }
    });
    return texts;
  }

  // Run extraction only on main element
  const cardTexts = collectVisibleText(element);
  if (cardTexts.length) {
    // Combine all strings into one paragraph, preserving line breaks if multiple
    const p = document.createElement('p');
    p.textContent = cardTexts.join('\n');
    rows.push([p]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
