/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row, exactly matching the example
  const rows = [['Cards (cardsNoImages40)']];

  // 2. Get all cards (li.banner-cards)
  const ul = element.querySelector('ul');
  if (!ul) return;
  const cards = ul.querySelectorAll('li.banner-cards');

  cards.forEach((card) => {
    // Each card: Compose a cell containing heading, description, CTA (if any)
    const cellContent = [];
    // Prefer desktop-only-access-links div for structure, fallback to mobile
    let mainDiv = card.querySelector('.desktop-only-access-links');
    if (!mainDiv) {
      mainDiv = card.querySelector('.mobile-only-access-links');
    }
    // Grab heading from mainDiv (h1-h6)
    if (mainDiv) {
      const heading = mainDiv.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) cellContent.push(heading);
      // Get all <p> elements below heading
      mainDiv.querySelectorAll('p').forEach(p => {
        if (p.textContent.trim()) cellContent.push(p);
      });
    }
    // Find the CTA link (a.read-link)
    const cta = card.querySelector('a.read-link');
    if (cta) cellContent.push(cta);
    // If no content found, fallback to all text content of card
    if (cellContent.length === 0) {
      cellContent.push(document.createTextNode(card.textContent.trim()));
    }
    rows.push([cellContent]);
  });

  // 3. Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
