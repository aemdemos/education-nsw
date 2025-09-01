/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct child DIVs of a parent
  function getDirectDivs(root) {
    return Array.from(root.children).filter(el => el.tagName === 'DIV');
  }

  // Find the main content area
  const mainContent = element.querySelector('.gef-main-content.sws-content__content-page');

  // Find root accordion content
  const accordionRoot = mainContent && mainContent.querySelector('.online-enrolment > .gef-main-content');

  // Establish header row
  const rows = [['Accordion (accordion49)']];

  // Helper to add a row, title can be element or string, content is array of elements
  function addRow(title, content) {
    rows.push([
      title,
      Array.isArray(content) ? content : [content]
    ]);
  }

  // Process each accordion section in the main .online-enrolment > .gef-main-content block
  if (accordionRoot) {
    getDirectDivs(accordionRoot).forEach(div => {
      const h2 = div.querySelector('h2');
      if (h2) {
        // Title is h2's text as a DIV for semantic block
        const titleDiv = document.createElement('div');
        titleDiv.append(h2);
        // Content: everything except the h2
        const contents = Array.from(div.childNodes).filter(
          node => node !== h2 && (node.nodeType !== 3 || node.textContent.trim() !== '')
        );
        addRow(titleDiv, contents);
      }
    });
  }

  // Also handle #movingprimarycentral ("Moving to high school")
  const movingPrimaryCentral = mainContent.querySelector('#movingprimarycentral');
  if (movingPrimaryCentral) {
    const h2 = movingPrimaryCentral.querySelector('h2');
    if (h2) {
      const titleDiv = document.createElement('div');
      titleDiv.append(h2);
      const contents = Array.from(movingPrimaryCentral.childNodes).filter(
        node => node !== h2 && (node.nodeType !== 3 || node.textContent.trim() !== '')
      );
      addRow(titleDiv, contents);
    }
  }

  // Find "Open Day and School Tour" accordion item
  const openDayImgDiv = mainContent.querySelector('div.image.parbase:has(h2#Open6)');
  const openDayTextDiv = mainContent.querySelector('div.text.parbase > div.gef-main-content.sws-content');
  if (openDayImgDiv && openDayTextDiv) {
    const h2 = openDayImgDiv.querySelector('h2');
    if (h2) {
      const titleDiv = document.createElement('div');
      titleDiv.append(h2);
      // Content: combine image figure + all paragraphs and links in openDayTextDiv
      const figure = openDayImgDiv.querySelector('figure');
      const textNodes = Array.from(openDayTextDiv.childNodes).filter(
        node => node.nodeType !== 3 || node.textContent.trim() !== ''
      );
      addRow(titleDiv, [figure, ...textNodes]);
    }
  }

  // Find "Moving overseas" accordion item
  const overseasDiv = mainContent.querySelector('div.text.parbase > div.gef-main-content[componenttype="could"]');
  if (overseasDiv) {
    const h2 = overseasDiv.querySelector('h2');
    if (h2) {
      const titleDiv = document.createElement('div');
      titleDiv.append(h2);
      const contents = Array.from(overseasDiv.childNodes).filter(
        node => node !== h2 && (node.nodeType !== 3 || node.textContent.trim() !== '')
      );
      addRow(titleDiv, contents);
    }
  }

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
