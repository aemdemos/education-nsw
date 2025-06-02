/* global WebImporter */
export default function parse(element, { document }) {
    // Helper function to extract accordion items
    const extractAccordionItems = (blockElement) => {
        const rows = [];

        // Header row with proper block name
        rows.push(['Accordion (accordion7)']);

        // Accordion items
        const accordionTitles = blockElement.querySelectorAll('.nsw-accordion__title');
        const accordionContents = blockElement.querySelectorAll('.nsw-accordion__content');

        accordionTitles.forEach((titleElement, index) => {
            const titleButton = titleElement.querySelector('button');
            const titleCell = titleButton ? titleButton.cloneNode(true) : document.createTextNode('');

            const contentElement = accordionContents[index];
            const contentCell = contentElement ? contentElement.cloneNode(true) : document.createTextNode('');

            // Create a structured row with title and content
            const row = [
                titleCell,
                contentCell
            ];
            rows.push(row);
        });

        return rows;
    };

    // Extract the accordion items from the element
    const accordionRows = extractAccordionItems(element);

    // Create the table block with proper structure
    const tableBlock = WebImporter.DOMUtils.createTable(accordionRows, document);

    // Add proper block class
    tableBlock.classList.add('accordion', 'block');

    // Replace the original element with the new table block
    element.replaceWith(tableBlock);

    // Return the table block
    return tableBlock;
}