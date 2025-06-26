/* global WebImporter */
export default function parse(element, { document }) {
  // Find the banner aside
  const aside = element.querySelector('aside.gel-banner-container');
  if (!aside) return;
  // Find columns: image and content
  const imageCol = aside.querySelector('.media-container.image_container');
  const contentCol = aside.querySelector('.gel-banner__content');

  // Reference the first <img> in the image column (if present)
  let imgEl = null;
  if (imageCol) {
    imgEl = imageCol.querySelector('img');
  }

  // Reference the main content container
  let contentContainer = null;
  if (contentCol) {
    contentContainer = contentCol.querySelector('.banner__content-container') || contentCol;
  }

  // Determine number of columns in second row (2 in this case)
  const numCols = 2;

  // Create table manually to ensure header cell spans all columns
  const table = document.createElement('table');
  const headerTr = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns6)';
  th.colSpan = numCols;
  headerTr.appendChild(th);
  table.appendChild(headerTr);

  const contentTr = document.createElement('tr');
  const td1 = document.createElement('td');
  if (contentContainer) td1.appendChild(contentContainer);
  const td2 = document.createElement('td');
  if (imgEl) td2.appendChild(imgEl);
  contentTr.appendChild(td1);
  contentTr.appendChild(td2);
  table.appendChild(contentTr);

  element.replaceWith(table);
}
