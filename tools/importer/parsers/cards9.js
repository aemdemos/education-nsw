/* global WebImporter */
export default function parse(element, { document }) {
  // The table header must match the block name exactly
  const headerRow = ['Cards (cards9)'];
  const rows = [headerRow];
  // Get all card elements as direct children
  const cardDivs = element.querySelectorAll(':scope > div');
  cardDivs.forEach((cardDiv) => {
    // The card's content is inside the link
    const cardLink = cardDiv.querySelector('a.gel-expanded-nav__item');
    let iconOrImgCell = '';
    // Compose a fragment for card body (heading, text, CTA)
    const cellFragment = document.createDocumentFragment();
    const h3 = cardLink.querySelector('h3');
    const p = cardLink.querySelector('p');
    // Use existing elements in the document. Detach them first to prevent duplicate DOM nodes.
    if (h3) cellFragment.appendChild(h3);
    if (p) cellFragment.appendChild(p);
    // Add CTA as a link if cardLink has href
    if (cardLink && cardLink.href) {
      // For this layout, a CTA is included as a link at the bottom of text cell
      const cta = document.createElement('a');
      cta.href = cardLink.href;
      cta.textContent = 'Learn more';
      // Add a break for clarity if there is other content
      if (h3 || p) cellFragment.appendChild(document.createElement('br'));
      cellFragment.appendChild(cta);
    }
    rows.push([iconOrImgCell, cellFragment]);
  });
  // Replace the original element with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
