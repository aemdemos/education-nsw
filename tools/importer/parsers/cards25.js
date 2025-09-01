/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per example
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Select all direct children card wrappers
  const cardWrappers = Array.from(element.querySelectorAll('.sws-latest-news-wrapper'));

  cardWrappers.forEach(wrapper => {
    const card = wrapper.querySelector('.sws-latest-news');
    if (!card) return;

    // Image cell
    let imgCell = null;
    const imgWrap = card.querySelector('.sws-latest-news__image-wrap');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img) {
        imgCell = img;
      }
    }

    // Text cell: Reference the actual article element for resilience
    const article = card.querySelector('.sws-latest-news__article');
    // If missing, still output a cell (empty div for safety)
    const textCell = article || document.createElement('div');

    rows.push([imgCell, textCell]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
