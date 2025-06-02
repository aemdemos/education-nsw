/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Tabs (tabs3)'];

  const rows = Array.from(element.querySelectorAll(':scope > nav > ul.dcs-main-nav__list > li')).map(tab => {
    const tabLabel = tab.querySelector(':scope > a > span')?.textContent.trim();
    const tabContent = tab.querySelector(':scope > div.dcs-main-nav__sub-nav') || tab.querySelector(':scope > a[itemprop="url"]');

    return [tabLabel, tabContent];
  });

  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);

  element.replaceWith(table);
}