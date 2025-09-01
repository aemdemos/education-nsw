/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards24) block header
  const headerRow = ['Cards (cards24)'];

  // Find the cards wrapper and all card elements
  const cardsWrapper = element.querySelector('#newsLandingNewsAnalytics');
  if (!cardsWrapper) return;
  const cardElements = cardsWrapper.querySelectorAll('.sws-latest-news');

  const rows = [];

  cardElements.forEach(card => {
    // Image cell (mandatory, must be the actual <img> element)
    const img = card.querySelector('.sws-latest-news__image-wrap img');
    const imageCell = img || '';

    // Text cell: category, heading, date, description (all present, optional per spec)
    const article = card.querySelector('article.sws-latest-news__article');
    const fragments = [];
    if (article) {
      // Category
      const category = article.querySelector('.sws-latest-news__article__category');
      if (category) fragments.push(category);
      // Heading
      const heading = article.querySelector('.sws-latest-news__article__heading');
      if (heading) fragments.push(heading);
      // Date
      const date = article.querySelector('.sws-latest-news__article__date');
      if (date) fragments.push(date);
      // Description
      const desc = article.querySelector('.sws-latest-news__article__text');
      if (desc) fragments.push(desc);
      // If there was a CTA link, include it here (none present in example)
    }

    rows.push([
      imageCell,
      fragments
    ]);
  });

  // Final table: header + card rows
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
