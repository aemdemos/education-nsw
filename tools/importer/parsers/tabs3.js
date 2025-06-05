/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main nav menu
  const nav = element.querySelector('nav.dcs-main-nav');
  if (!nav) return;
  const mainList = nav.querySelector('ul.dcs-main-nav__list--primary');
  if (!mainList) return;
  const liTabs = Array.from(mainList.querySelectorAll(':scope > li'));

  const rows = [];
  // Header row exactly as required
  rows.push(['Tabs (tabs3)']);

  // Add a row for each tab
  liTabs.forEach(li => {
    // Tab label is the anchor's first span (if present) or anchor text
    let tabLabel = '';
    const anchor = li.querySelector(':scope > a');
    if (anchor) {
      // Tab label is usually the first <span> direct child
      const labelSpan = anchor.querySelector('span');
      if (labelSpan && labelSpan.textContent.trim()) {
        tabLabel = labelSpan.textContent.trim();
      } else {
        tabLabel = anchor.textContent.trim();
      }
    } else {
      // fallback: take direct text of the li
      tabLabel = li.textContent.trim();
    }

    // Tab content: submenu if present, otherwise the anchor (for non-dropdowns)
    let tabContent = null;
    const subNav = li.querySelector(':scope > .dcs-main-nav__sub-nav');
    if (subNav) {
      tabContent = subNav;
    } else if (anchor) {
      tabContent = anchor;
    } else {
      tabContent = li;
    }

    // Push the row: [label, content]
    rows.push([tabLabel, tabContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
