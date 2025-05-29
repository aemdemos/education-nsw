/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Tabs (tabs3)'];

  const rows = [];

  // Query the primary list items that group tabs
  const mainNavItems = element.querySelectorAll(':scope > nav > ul > li');

  mainNavItems.forEach((navItem) => {
    const tabLabelElement = navItem.querySelector(':scope > a span');
    const tabContentElement = navItem.querySelector(':scope > div');

    let tabLabel = tabLabelElement || ''; // Use existing tab label element

    if (tabContentElement) {
      // Convert links for non-image elements with 'src' attributes
      const iframeElements = tabContentElement.querySelectorAll('[src]:not(img)');
      iframeElements.forEach((iframe) => {
        const link = document.createElement('a');
        link.href = iframe.src;
        link.textContent = iframe.src;
        iframe.replaceWith(link);
      });

      rows.push([tabLabel, tabContentElement]);
    } else {
      // Handle tabs with no content
      const placeholderContent = document.createElement('p');
      placeholderContent.textContent = 'No additional content available.';
      rows.push([tabLabel, placeholderContent]);
    }
  });

  const cells = [headerRow, ...rows];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}