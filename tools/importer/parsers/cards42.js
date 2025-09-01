/* global WebImporter */
export default function parse(element, { document }) {
  // Header matches the example exactly
  const headerRow = ['Cards (cards42)'];
  const cardRows = [];

  // Find all card wrappers (each card)
  const wrappers = element.querySelectorAll('.sws-latest-news-wrapper');

  wrappers.forEach(wrapper => {
    const card = wrapper.querySelector('.sws-latest-news');
    if (!card) return; // skip empty stack/empty cards

    // Image (always present)
    const imgWrap = card.querySelector('.sws-latest-news__image-wrap');
    let imgEl = null;
    if (imgWrap) {
      // Reference the existing <img> element
      imgEl = imgWrap.querySelector('img');
    }

    // Text content
    const article = card.querySelector('.sws-latest-news__article');
    if (!article) return;

    // Compose content: category, heading, date, description, CTA
    const fragments = [];

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

    // CTA link, if present: Use the existing link and set text to heading
    const link = card.querySelector('a.sws-latest-news__link');
    if (link && heading && link.getAttribute('href')) {
      // Only add if heading exists
      link.textContent = heading.textContent;
      fragments.push(link);
    }

    // Row: [image, text content]
    cardRows.push([imgEl, fragments]);
  });

  // Only build block if any cards are found
  if (cardRows.length) {
    const cells = [headerRow, ...cardRows];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
