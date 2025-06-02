/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with the correct label
  const headerRow = ['Embed (embedVideo8)'];

  // Locate the video/image and embed link dynamically from the element
  const iframe = element.querySelector(':scope iframe[src]');
  const image = element.querySelector(':scope img[src]');

  // Create the content row dynamically based on available data
  const contentRow = [];

  if (image) {
    contentRow.push(image); // Reference the existing image element directly
  }
  if (iframe) {
    const videoLink = document.createElement('a');
    videoLink.href = iframe.src;
    videoLink.textContent = iframe.src;
    contentRow.push(videoLink); // Append the dynamically created link to the row
  }

  if (contentRow.length === 0) {
    // Handle edge case where no image or iframe is provided
    const placeholder = document.createElement('p');
    placeholder.textContent = 'No embed content available';
    contentRow.push(placeholder);
  }

  // Construct the table structure
  const cells = [
    headerRow,
    [contentRow]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the created table
  element.replaceWith(table);
}