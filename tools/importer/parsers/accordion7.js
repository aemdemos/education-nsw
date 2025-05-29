/* global WebImporter */
export default function parse(element, { document }) {
    // Helper function to extract accordion items
    const extractAccordionItems = (blockElement) => {
        const rows = [];

        // Header row
        rows.push(['Accordion (accordion7)']);

        // Accordion items
        const accordionTitles = blockElement.querySelectorAll('.nsw-accordion__title');
        const accordionContents = blockElement.querySelectorAll('.nsw-accordion__content');

        accordionTitles.forEach((titleElement, index) => {
            const titleButton = titleElement.querySelector('button');
            const titleCell = titleButton ? titleButton.cloneNode(true) : '';

            const contentElement = accordionContents[index];
            const contentCell = contentElement ? contentElement.cloneNode(true) : '';

            rows.push([titleCell, contentCell]);
        });

        return rows;
    };

    // Extract the accordion items from the element
    const accordionRows = extractAccordionItems(element);

    // Create the table block
    const tableBlock = WebImporter.DOMUtils.createTable(accordionRows, document);

    // Replace the original element with the new table block
    element.replaceWith(tableBlock);
}