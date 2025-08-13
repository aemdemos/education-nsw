/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section footer (main blue area with columns)
  const sectionFooter = element.querySelector('.section-footer');
  let col1 = [], col2 = [], col3 = [];
  if (sectionFooter) {
    // Find three column wrappers by their classes
    const col1Wrapper = sectionFooter.querySelector('.gel-section-footer__col1');
    const col2Wrapper = sectionFooter.querySelector('.gel-section-footer__col2');
    const col3Wrapper = sectionFooter.querySelector('.gel-section-footer__col3');
    if (col1Wrapper) {
      // Social panel and logo
      const social = col1Wrapper.querySelector('.gel-social-icons-panel');
      if (social) col1.push(social);
      const logo = col1Wrapper.querySelector('.gel-global-footer__logo, .gel-corporate-logo');
      if (logo) col1.push(logo);
    }
    if (col2Wrapper) {
      // Acknowledgement
      const ack = col2Wrapper.querySelector('.gel-acknowledgement');
      if (ack) col2.push(ack);
    }
    if (col3Wrapper) {
      // Two link lists
      const sectionLinks = col3Wrapper.querySelector('.gel-section-footer__links');
      if (sectionLinks) col3.push(sectionLinks);
      const globalLinks = col3Wrapper.querySelector('.gel-global-footer__links');
      if (globalLinks) col3.push(globalLinks);
    }
  }

  // Ensure at least arrays for each column
  if (!col1.length) col1 = [];
  if (!col2.length) col2 = [];
  if (!col3.length) col3 = [];

  // Header row
  const headerRow = ['Columns (columns25)'];
  // Second row: columns content
  const row2 = [col1, col2, col3];

  // Check for print/copyright footer
  let row3 = null;
  const globalFooter = element.querySelector('.global-footer');
  if (globalFooter) {
    row3 = [globalFooter];
  }

  // Assemble block table rows
  const cells = [headerRow, row2];
  if (row3) cells.push(row3);

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
