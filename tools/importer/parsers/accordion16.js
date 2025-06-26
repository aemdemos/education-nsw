/* global WebImporter */
export default function parse(element, { document }) {
  // Find all top-level showhide-v2 accordions within the given element
  const accordions = Array.from(element.querySelectorAll(':scope > .showhide-v2'));
  if (!accordions.length) return;

  // Prepare the table cells, with the header as a single column
  const cells = [['Accordion']];

  accordions.forEach(acc => {
    // Get the title text for the accordion (from the collapse trigger)
    let title = '';
    const header = acc.querySelector('.card-header, h3, .gel-show-hide_title');
    if (header) {
      // Try to get from an explicit span, else get full textContent
      const span = header.querySelector('span');
      if (span && span.textContent.trim()) {
        title = span.textContent.trim();
      } else {
        title = header.textContent.trim();
      }
    }
    if (!title) return;

    // Get the content: everything inside the .gel-show-hide__content .card-body (preserving block structure)
    let content = null;
    const contentDiv = acc.querySelector('.gel-show-hide__content');
    if (contentDiv) {
      const cardBody = contentDiv.querySelector('.card-body');
      if (cardBody) {
        // Get all child nodes with meaningful content
        const nodes = Array.from(cardBody.childNodes).filter(node => {
          if (node.nodeType === 3 && node.textContent.trim() !== '') return true;
          if (node.nodeType === 1 && node.textContent.trim() !== '') return true;
          return false;
        });
        if (nodes.length === 1) {
          content = nodes[0];
        } else if (nodes.length > 1) {
          content = nodes;
        } else {
          // Fallback: preserve even empty/placeholder content as a blank string
          content = '';
        }
      } else {
        // If cardBody missing, fallback to text content of contentDiv
        const txt = contentDiv.textContent.trim();
        content = txt ? txt : '';
      }
    } else {
      // If no content div, fallback to blank string
      content = '';
    }

    // Only add row if we have a title (even empty content is ok)
    cells.push([title, content]);
  });

  // Only create and replace if there is at least one accordion row
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
