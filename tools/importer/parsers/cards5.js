/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per requirements
  const headerRow = ['Cards (cards5)'];
  // Find all top-level news card wrappers
  const cardWrappers = Array.from(element.querySelectorAll(':scope > div.news-index > div.sws-container-width-100 > div.sws-container-inner > div.sws-latest-news-wrapper'));
  const rows = [headerRow];
  cardWrappers.forEach(cardWrapper => {
    const news = cardWrapper.querySelector('.sws-latest-news');
    if (!news) return;
    // Image
    const imgWrap = news.querySelector('.sws-latest-news__image-wrap');
    let img = imgWrap ? imgWrap.querySelector('img') : null;
    // Text content
    const article = news.querySelector('article.sws-latest-news__article');
    if (!article) return;
    const textParts = [];
    // From the department block (if present)
    const fromDept = article.querySelector('.from-the-department');
    if (fromDept) textParts.push(fromDept);
    // Category
    const cat = article.querySelector('.sws-latest-news__article__category');
    if (cat) textParts.push(cat);
    // Title (h3)
    const heading = article.querySelector('.sws-latest-news__article__heading');
    if (heading) textParts.push(heading);
    // Date
    const date = article.querySelector('.sws-latest-news__article__date');
    if (date) textParts.push(date);
    // Description
    const desc = article.querySelector('.sws-latest-news__article__text');
    if (desc) textParts.push(desc);
    // CTA: use the existing anchor as referenced, not cloned (for accessibility, use link.title or fallback)
    const link = news.querySelector('a.sws-latest-news__link');
    if (link && link.getAttribute('href')) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = link.getAttribute('title') || 'Read more';
      textParts.push(a);
    }
    // Assemble row
    rows.push([
      img ? img : '',
      textParts.length > 1 ? textParts : (textParts[0] || '')
    ]);
  });
  // Replace original element with new table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
