/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Columns (columns9)'];

  const groups = Array.from(element.querySelectorAll(':scope > div > div > div'));

  const contentRows = groups.map((group) => {
    const heading = group.querySelector('h3');
    const links = Array.from(group.querySelectorAll('ul > li > a')).map(link => {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = link.textContent;

      if (link.classList.contains('is-external') && link.hasAttribute('rel')) {
        anchor.setAttribute('rel', link.getAttribute('rel'));
      }

      return anchor;
    });

    const cellContent = [];

    if (heading) {
      const headingElement = document.createElement('h3');
      headingElement.appendChild(document.createTextNode(heading.textContent));
      cellContent.push(headingElement);
    }

    if (links.length > 0) {
      const list = document.createElement('ul');
      links.forEach(anchor => {
        const listItem = document.createElement('li');
        listItem.appendChild(anchor);
        list.appendChild(listItem);
      });
      cellContent.push(list);
    }

    return cellContent.length > 0 ? [cellContent] : [];
  }).filter(row => row.length > 0);

  const tableData = [headerRow, ...contentRows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  element.replaceWith(table);
}