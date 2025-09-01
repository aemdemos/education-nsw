/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner grid
  const inner = element.querySelector('.gef-global-footer__inner');
  if (!inner) return;

  // Get link columns
  const wrapper = inner.querySelector('.gef-global-footer__inner__wrapper');
  const nav = wrapper ? wrapper.querySelector('nav') : null;
  let linkColumns = [];
  if (nav) {
    linkColumns = Array.from(nav.querySelectorAll(':scope > div.sws-global-footer-links'));
  }

  // Get logo column
  const logoCol = inner.querySelector('.gef-global-footer__inner__logo');

  // Compose content row for columns block: all link columns, then logo (if exists)
  const contentRow = [...linkColumns, logoCol].filter(Boolean);
  const numCols = contentRow.length > 0 ? contentRow.length : 1;

  // Build the table manually for correct header colspan
  const table = document.createElement('table');

  // Header row: one th with colspan of all columns
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.setAttribute('colspan', numCols);
  headerTh.textContent = 'Columns (columns12)';
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);

  // Content row
  const rowTr = document.createElement('tr');
  contentRow.forEach(cell => {
    const td = document.createElement('td');
    td.append(cell);
    rowTr.appendChild(td);
  });
  table.appendChild(rowTr);

  element.replaceWith(table);
}
