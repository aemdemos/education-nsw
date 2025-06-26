/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the full visible breadcrumb text from the DOM, preserving order and separators
  // Prefer the desktop breadcrumbs (more complete), fallback to any available
  let breadcrumbRoot = element.querySelector('.gel-breadcrumbs-visibility.d-none.d-lg-block .gel-breadcrumbs__list');
  if (!breadcrumbRoot) {
    breadcrumbRoot = element.querySelector('.gel-breadcrumbs__list');
  }
  // If not found, fallback to entire element
  let breadcrumbTexts = [];
  if (breadcrumbRoot) {
    // Extract each breadcrumb item in order
    const items = breadcrumbRoot.querySelectorAll('li');
    items.forEach((li) => {
      let text = '';
      // Try anchor first
      const a = li.querySelector('a');
      if (a) {
        text = a.textContent.trim();
      } else {
        // Try span (active/current)
        const span = li.querySelector('span');
        if (span) {
          text = span.textContent.trim();
        } else {
          // Fallback to li text
          text = li.textContent.trim();
        }
      }
      if (text) breadcrumbTexts.push(text);
    });
  } else {
    // Fallback: get all text from element
    const raw = element.textContent || '';
    breadcrumbTexts = raw.replace(/\s+/g, ' ').trim().split('>').map(s => s.trim()).filter(Boolean);
  }
  // Join with ' > ' like the example screenshot
  const breadcrumbText = breadcrumbTexts.join(' > ');

  const headerRow = ['Embed (embedVideo3)'];
  const contentRow = [breadcrumbText];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
