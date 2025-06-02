/* global WebImporter */
export default function parse(element, { document }) {
    const cells = [];

    // Fix header row to match the example exactly
    cells.push(['Columns block']);

    // Extract all groups (immediate children divs)
    const groups = element.querySelectorAll(':scope > div > div > div.nsw-footer__group');

    const columnContent = [];

    groups.forEach(group => {
        // Extract heading text and convert it into plain text
        const heading = group.querySelector('h3');
        const headingText = heading ? heading.textContent.trim() : '';

        // Extract links and include them as elements
        const links = Array.from(group.querySelectorAll('ul li a')).map(link => {
            const anchor = document.createElement('a');
            anchor.href = link.href;
            anchor.textContent = link.textContent.trim();
            return anchor;
        });

        // Combine heading text and links as plain content (list format)
        const list = document.createElement('ul');
        if (headingText) {
            const headingItem = document.createElement('li');
            headingItem.textContent = headingText;
            list.appendChild(headingItem);
        }
        links.forEach(link => {
            const linkItem = document.createElement('li');
            linkItem.appendChild(link);
            list.appendChild(linkItem);
        });

        columnContent.push(list);
    });

    // Add content row
    cells.push(columnContent);

    const table = WebImporter.DOMUtils.createTable(cells, document);

    // Replace the element with the newly created table
    element.replaceWith(table);
}