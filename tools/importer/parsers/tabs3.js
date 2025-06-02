/* global WebImporter */
export default function parse(element, { document }) {
    const headerRow = ['Tabs (tabs3)'];
    const rows = [];

    const tabs = element.querySelectorAll(':scope > nav > ul > li');

    tabs.forEach((tab) => {
      const tabLabelElement = tab.querySelector('a > span');
      const tabLabel = tabLabelElement ? tabLabelElement.textContent.trim() : 'Unnamed Tab';

      const tabContentWrapper = tab.querySelector('.dcs-main-nav__sub-wrapper');
      const tabContent = [];

      if (tabContentWrapper) {
        const subNavList = tabContentWrapper.querySelector('.dcs-main-nav__list--secondary');
        if (subNavList) {
          subNavList.querySelectorAll('li > a').forEach((link) => {
            tabContent.push(link);
          });
        }

        const promotedList = tabContentWrapper.querySelector('.dcs-main-nav__list--promoted');
        if (promotedList) {
          promotedList.querySelectorAll('li > a').forEach((link) => {
            tabContent.push(link);
          });
        }

        const ctaButton = tabContentWrapper.querySelector('.dcs-main-nav__sub-link > a');
        if (ctaButton) {
          tabContent.push(ctaButton);
        }
      } else {
        tabContent.push('No content available.');
      }

      rows.push([tabLabel, tabContent]);
    });

    const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
    element.replaceWith(table);
}