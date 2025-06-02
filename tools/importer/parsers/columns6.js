/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Columns (columns6)'];

  const contentCells = [];

  const children = element.querySelectorAll(':scope > div > div > div > div');

  children.forEach((child) => {
    const contentBlock = [];

    const title = child.querySelector('.dcs-feature__title');
    if (title) {
      contentBlock.push(title);
    }

    const description = child.querySelector('.dcs-feature__html');
    if (description) {
      contentBlock.push(description);
    }

    const button = child.querySelector('a.dcs-feature__link');
    if (button) {
      contentBlock.push(button);
    }

    const image = child.querySelector('picture');
    if (image) {
      contentBlock.push(image);
    }

    if (contentBlock.length > 0) {
      contentCells.push(contentBlock);
    }
  });

  const tableData = [headerRow, ...contentCells.map((cell) => [cell])];

  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  element.replaceWith(blockTable);
}