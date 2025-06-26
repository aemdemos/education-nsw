/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const cells = [
    ['Cards (cards14)']
  ];

  // Find all card containers
  const row = element.querySelector('.row');
  if (!row) return;
  const cardCols = row.querySelectorAll(':scope > div');

  cardCols.forEach(col => {
    const anchor = col.querySelector('a.gel-featured-teaser-link');
    if (!anchor) return;
    const card = anchor.querySelector('div.card');
    if (!card) return;

    // 1st cell: image element
    let imgCell = null;
    const img = card.querySelector('.wayfinder-component_img-wrapper img');
    if (img) imgCell = img;

    // 2nd cell: text content (heading, description, CTA)
    const body = card.querySelector('.card-body');
    const textCellContents = [];
    if (body) {
      const title = body.querySelector('h4, .card-title');
      if (title) textCellContents.push(title);
      const desc = body.querySelector('p');
      if (desc) textCellContents.push(desc);
      // Add CTA as a link with the same href as the card, using the title text as label
      const href = anchor.getAttribute('href');
      if (href) {
        const cta = document.createElement('a');
        cta.href = href;
        // Prefer the visible arrow for CTA, but fallback to text label
        cta.textContent = 'Learn more';
        cta.setAttribute('style', 'display:inline-block;margin-top:12px;');
        textCellContents.push(cta);
      }
    }
    cells.push([
      imgCell,
      textCellContents
    ]);
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
