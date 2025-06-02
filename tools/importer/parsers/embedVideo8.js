/* global WebImporter */
export default function parse(element, { document }) {
  // Extract relevant content from the element
  const thumbsContainer = element.querySelector('.thumbs-container');
  const description = thumbsContainer.querySelector('.thumbs__description');

  // Extract the source URL for embedding
  const embedUrl = 'https://vimeo.com/454418448';

  // Create the anchor element for the embed link
  const embedLink = document.createElement('a');
  embedLink.href = embedUrl;
  embedLink.textContent = embedUrl;

  // Create the table structure
  const cells = [
    ['Embed (embedVideo8)'],
    [
      description,
      embedLink,
    ],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}