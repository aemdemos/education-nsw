/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the Embed (embedVideo21) block containing all visible breadcrumb text content from the element
  // Extract all visible text, preserving structure as much as possible
  // To maximize flexibility, extract the relevant nav (breadcrumb) and reference it directly if possible
  const nav = element.querySelector('nav');
  let content;
  if (nav) {
    // Use the actual breadcrumb nav element for better structure preservation
    content = nav;
  } else {
    // Fallback: all text in the block
    content = element.textContent.trim();
  }

  const headerRow = ['Embed (embedVideo21)'];
  const cells = [
    headerRow,
    [content]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}