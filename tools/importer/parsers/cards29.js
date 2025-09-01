/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row, exactly matching the example
  const headerRow = ['Cards (cards29)'];
  // Find all card wrappers
  const cardWrappers = Array.from(element.querySelectorAll('.sws-latest-news-wrapper'));
  const rows = [];
  cardWrappers.forEach(wrapper => {
    // First cell: image (mandatory)
    let imgCell = null;
    const imgWrap = wrapper.querySelector('.sws-latest-news__image-wrap');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img) imgCell = img;
    }
    // Second cell: text content (mandatory)
    // Compose the card text content, preserving semantics
    const article = wrapper.querySelector('article.sws-latest-news__article');
    const textParts = [];
    // Department label (optional)
    const dept = wrapper.querySelector('.from-the-department');
    if (dept) textParts.push(dept);
    // Category (optional)
    const category = article ? article.querySelector('.sws-latest-news__article__category') : null;
    if (category) textParts.push(category);
    // Title/heading (optional)
    const heading = article ? article.querySelector('.sws-latest-news__article__heading') : null;
    if (heading) textParts.push(heading);
    // Date (optional)
    const date = article ? article.querySelector('.sws-latest-news__article__date') : null;
    if (date) textParts.push(date);
    // Description (optional)
    const desc = article ? article.querySelector('.sws-latest-news__article__text') : null;
    if (desc) textParts.push(desc);
    // Compose second cell, referencing existing elements
    let textCell;
    if (textParts.length === 1) {
      textCell = textParts[0];
    } else if (textParts.length > 1) {
      const div = document.createElement('div');
      textParts.forEach(part => div.append(part));
      textCell = div;
    } else {
      textCell = document.createElement('div'); // empty cell fallback
    }
    rows.push([imgCell, textCell]);
  });
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
