/* global WebImporter */
export default function parse(element, { document }) {
  // Find a unique external URL for the feedback widget, if any
  // This block does not have an embedded iframe/video src, so we must synthesize a meaningful link as a proxy
  // We'll use an anchor linking to the current page's feedback widget anchor, as a placeholder for 'embed' semantics
  
  // Find the closest anchor/ID for the feedback widget
  let feedbackId = element.id || element.closest('[id]')?.id || '';
  let feedbackLink = document.createElement('a');
  feedbackLink.href = feedbackId ? `#${feedbackId}` : '#block-onegovquickfeedblock';
  feedbackLink.textContent = 'Feedback Widget';

  // The block table header
  const headerRow = ['Embed (embedVideo8)'];
  // Only the anchor in the cell, matching the pattern of a URL in the markdown example
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [feedbackLink]
  ], document);
  element.replaceWith(table);
}
