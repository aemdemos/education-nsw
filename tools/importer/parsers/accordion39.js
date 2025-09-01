/* global WebImporter */
export default function parse(element, { document }) {
  // Find main content area
  let mainContent = element.querySelector('.uk-width-large-2-3.gef-main-content.sws-content__content-page');
  if (!mainContent) mainContent = element.querySelector('.uk-width-large-2-3');
  if (!mainContent) return;

  // Helper to get all content blocks in original order
  const blocks = Array.from(mainContent.children).filter(child =>
    child.classList.contains('image') ||
    child.classList.contains('text') ||
    child.classList.contains('contentBox')
  );

  // Table header matches example EXACTLY
  const rows = [['Accordion (accordion39)']];

  // Kindergarten section: h2 title + image + all related text blocks up to Best Start Assessment
  let kindergartenBlockIdx = blocks.findIndex(b => b.classList.contains('text') && b.querySelector('h2'));
  if (kindergartenBlockIdx > -1) {
    // Find image just before kindergarten block
    let imgBlock;
    for (let i = kindergartenBlockIdx - 1; i >= 0; i--) {
      if (blocks[i].classList.contains('image')) {
        imgBlock = blocks[i];
        break;
      }
    }
    // Title cell
    const kindergartenHeading = blocks[kindergartenBlockIdx].querySelector('h2');
    // Content cell: image (if found), then all kindergarten-related text blocks (until first h3 block)
    const contentCell = document.createElement('div');
    if (imgBlock) contentCell.appendChild(imgBlock);
    for (let i = kindergartenBlockIdx; i < blocks.length; i++) {
      // Stop at first block with h3
      if (blocks[i].classList.contains('text') && blocks[i].querySelector('h3')) break;
      // Exclude heading in first block
      if (i === kindergartenBlockIdx) {
        Array.from(blocks[i].children).forEach(child => {
          if (!child.tagName.match(/^H2$/)) contentCell.appendChild(child);
        });
      } else {
        contentCell.appendChild(blocks[i]);
      }
    }
    // Only add row if there is real content
    if (kindergartenHeading && contentCell.textContent.trim()) {
      rows.push([kindergartenHeading, contentCell]);
    }
  }

  // Best Start Assessment section: block with h3
  const bestStartBlock = blocks.find(b => b.classList.contains('text') && b.querySelector('h3'));
  if (bestStartBlock) {
    const bestHeading = bestStartBlock.querySelector('h3');
    // Content cell: all children except h3
    const bestContentCell = document.createElement('div');
    Array.from(bestStartBlock.children).forEach(child => {
      if (!child.tagName.match(/^H3$/)) bestContentCell.appendChild(child);
    });
    if (bestHeading && bestContentCell.textContent.trim()) {
      rows.push([bestHeading, bestContentCell]);
    }
  }

  // Enrolment card section
  const cardBlock = blocks.find(b => b.classList.contains('contentBox'));
  if (cardBlock) {
    const card = cardBlock.querySelector('.uk-card');
    if (card) {
      const cardHeading = card.querySelector('h3');
      const cardContent = document.createElement('div');
      Array.from(card.childNodes).forEach(child => {
        if (child !== cardHeading) cardContent.appendChild(child);
      });
      if (cardHeading && cardContent.textContent.trim()) {
        rows.push([cardHeading, cardContent]);
      }
    }
  }

  // Open Day section: image with alt/title 'Open Day' and following text block
  const openDayImgBlockIdx = blocks.findIndex(b => {
    const img = b.querySelector('img');
    return img && ((img.alt && img.alt.toLowerCase().includes('open day')) || (img.title && img.title.toLowerCase().includes('open_day')));
  });
  if (openDayImgBlockIdx > -1) {
    const openDayImgBlock = blocks[openDayImgBlockIdx];
    const img = openDayImgBlock.querySelector('img');
    // Title cell: h3 element with image alt text
    const openDayTitle = document.createElement('h3');
    openDayTitle.textContent = img.alt || 'Open Day';
    // Content cell: image block, then following text block (if exists)
    const openDayContentCell = document.createElement('div');
    openDayContentCell.appendChild(openDayImgBlock);
    const openDayTextBlock = blocks[openDayImgBlockIdx + 1];
    if (openDayTextBlock && openDayTextBlock.classList.contains('text')) {
      openDayTextBlock.querySelectorAll('.gef-main-content, p').forEach(el => {
        if (el.textContent.trim()) openDayContentCell.appendChild(el);
      });
    }
    if (openDayTitle && openDayContentCell.textContent.trim()) {
      rows.push([openDayTitle, openDayContentCell]);
    }
  }

  // Final table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
