/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly
  const headerRow = ['Columns (columns32)'];

  // Find the main nav menu and all top-level menu items
  const nav = element.querySelector('nav.uk-navbar-container');
  if (!nav) return;
  const menuList = nav.querySelector('ul.uk-navbar-nav');
  if (!menuList) return;
  const menuItems = Array.from(menuList.querySelectorAll(':scope > li.sws-parent-menu'));

  // For each top-level menu, build column content
  const columns = menuItems.map((menuItem) => {
    // Compose cell
    const cell = document.createElement('div');
    // Top-level menu text (title)
    const topLink = menuItem.querySelector(':scope > a.sws-meganav-megalinks');
    if (topLink) {
      const p = document.createElement('p');
      p.textContent = topLink.textContent.trim();
      cell.appendChild(p);
    }
    // Dropdown menu
    const dropdown = menuItem.querySelector(':scope > .sws-dropdown-menu');
    if (dropdown) {
      // Dropdown title in h3 usually repeats top-level menu text, skip if duplicate
      const dropdownTitle = dropdown.querySelector('h3 a.sws-meganav-title');
      if (dropdownTitle && (!topLink || dropdownTitle.textContent.trim() !== topLink.textContent.trim())) {
        const h3 = document.createElement('h3');
        h3.appendChild(dropdownTitle);
        cell.appendChild(h3);
      }
      // Dropdown description (p) if present and non-empty
      const descP = dropdown.querySelector('.sws-mega-nav-desc p');
      if (descP && descP.textContent.trim()) {
        // Use original element for semantic meaning
        cell.appendChild(descP);
      }
      // Dropdown submenu links
      const subList = dropdown.querySelector('ul');
      if (subList && subList.children.length > 0) {
        // Reference the full <ul> element for the sub-links
        cell.appendChild(subList);
      }
    }
    return cell;
  });

  // Only replace if something found
  if (columns.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      columns
    ], document);
    element.replaceWith(table);
  }
}
