/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Embed (embedVideo8)'];

  // Extract relevant content from the element
  const thumbsDescription = element.querySelector('.thumbs__description');
  const feedbackContainer = element.querySelector('#onegov-quickfeed-container');

  // Create a link for the embedded content
  const link = document.createElement('a');
  link.href = feedbackContainer?.dataset.onegovEnv ? `https://vimeo.com/454418448` : '#';
  link.textContent = feedbackContainer?.dataset.onegovEnv ? 'https://vimeo.com/454418448' : 'No URL found';

  // Combine content into a single cell
  const combinedContent = document.createElement('div');
  combinedContent.append(link);
  if (thumbsDescription) {
    combinedContent.append(document.createElement('br'));
    combinedContent.append(thumbsDescription);
  }

  const contentRow = [combinedContent];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}