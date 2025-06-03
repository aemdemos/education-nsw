/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter Saurabh Saxena*/

export async function handleOnLoad({ document }) {
  // send 'esc' keydown event to close the dialog
  document.dispatchEvent(
    new KeyboardEvent('keydown', {
      altKey: false,
      code: 'Escape',
      ctrlKey: false,
      isComposing: false,
      key: 'Escape',
      location: 0,
      metaKey: false,
      repeat: false,
      shiftKey: false,
      which: 27,
      charCode: 0,
      keyCode: 27,
    }),
  );
  document.elementFromPoint(0, 0)?.click();

  // mark hidden elements
  document.querySelectorAll('*').forEach((el) => {
    if (
      el
      && (
        /none/i.test(window.getComputedStyle(el).display.trim())
        || /hidden/i.test(window.getComputedStyle(el).visibility.trim())
      )
    ) {
      el.setAttribute('data-hlx-imp-hidden-div', '');
    }
  });

  // mark hidden divs + add bounding client rect data to all "visible" divs
  document.querySelectorAll('div').forEach((div) => {
    if (
      div
      && (
        /none/i.test(window.getComputedStyle(div).display.trim())
        || /hidden/i.test(window.getComputedStyle(div).visibility.trim())
      )
    ) {
      div.setAttribute('data-hlx-imp-hidden-div', '');
    } else {
      const domRect = div.getBoundingClientRect().toJSON();
      if (Math.round(domRect.width) > 0 && Math.round(domRect.height) > 0) {
        div.setAttribute('data-hlx-imp-rect', JSON.stringify(domRect));
      }
      const bgImage = window.getComputedStyle(div).getPropertyValue('background-image');
      if (bgImage && bgImage !== 'none' && bgImage.includes('url(')) {
        div.setAttribute('data-hlx-background-image', bgImage);
      }
      const bgColor = window.getComputedStyle(div).getPropertyValue('background-color');
      if (bgColor && bgColor !== 'rgb(0, 0, 0)' && bgColor !== 'rgba(0, 0, 0, 0)') {
        div.setAttribute('data-hlx-imp-bgcolor', bgColor);
      }
      const color = window.getComputedStyle(div).getPropertyValue('color');
      if (color && color !== 'rgb(0, 0, 0)') {
        div.setAttribute('data-hlx-imp-color', color);
      }
    }
  });

  // fix image with only srcset attribute (not supported in helix-importer)
  document.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    const srcset = img.getAttribute('srcset')?.split(' ')[0];
    if (!src && srcset) {
      img.setAttribute('src', srcset);
    }
  });

  // get body width
  const bodyWidth = document.body.getBoundingClientRect().width;
  document.body.setAttribute('data-hlx-imp-body-width', bodyWidth);
}

/**
 * Generate document path
 * @param {string} url
 * @returns {string}
*/
export function generateDocumentPath({ params: { originalURL } }, inventory) {
  let p;
  const urlEntry = inventory.urls?.find(({ url }) => url === originalURL);
  if (urlEntry?.targetPath) {
    p = urlEntry.targetPath;
  } else {
    // fallback to original URL pathname
    p = new URL(originalURL).pathname;
    if (p.endsWith('/')) {
      p = `${p}index`;
    }
    p = decodeURIComponent(p)
      .toLowerCase()
      .replace(/\.html$/, '')
      .replace(/[^a-z0-9/]/gm, '-');
  }
  return WebImporter.FileUtils.sanitizePath(p);
}

export const TableBuilder = (originalFunc) => {
  const original = originalFunc;

  return {
    build: (parserName) => (cells, document) => {
      if (!Array.isArray(cells) || cells.length === 0) {
        return original(cells, document);
      }

      // Handle Section Metadata
      if (cells[0]?.[0]?.toLowerCase().includes('section metadata')) {
        const styleRow = cells.find((row) => row[0]?.toLowerCase() === 'style');
        if (styleRow) {
          const existingStyles = styleRow[1]?.split(',').map((s) => s.trim()) || [];
          if (!existingStyles.includes(parserName)) {
            existingStyles.push(parserName);
            styleRow[1] = existingStyles.join(', ');
          }
        } else {
          cells.push(['style', parserName]);
        }
        return original(cells, document);
      }

      // Handle Metadata blocks
      if (cells[0]?.[0]?.toLowerCase().includes('metadata')) {
        return original(cells, document);
      }

      // Handle regular blocks
      const firstCell = cells[0]?.[0];
      if (firstCell) {
        const variantMatch = firstCell.match(/\(([^)]+)\)/);
        if (variantMatch) {
          const existingVariants = variantMatch[1].split(',').map((v) => v.trim());
          if (!existingVariants.includes(parserName)) {
            existingVariants.push(parserName);
          }
          const baseName = firstCell.replace(/\s*\([^)]+\)/, '').trim();
          cells[0][0] = `${baseName} (${existingVariants.join(', ')})`;
        } else {
          cells[0][0] = `${firstCell} (${parserName})`;
        }
      }

      // Ensure proper table structure
      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');

      cells.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell) => {
          const td = document.createElement(rowIndex === 0 ? 'th' : 'td');
          if (rowIndex === 0) td.setAttribute('scope', 'column');
          
          if (cell instanceof Node) {
            td.appendChild(cell.cloneNode(true));
          } else if (Array.isArray(cell)) {
            cell.forEach((subCell) => {
              if (subCell instanceof Node) {
                td.appendChild(subCell.cloneNode(true));
              } else if (typeof subCell === 'string') {
                td.innerHTML += subCell;
              }
            });
          } else if (typeof cell === 'string') {
            td.innerHTML = cell;
          }
          tr.appendChild(td);
        });
        
        if (rowIndex === 0) {
          thead.appendChild(tr);
        } else {
          tbody.appendChild(tr);
        }
      });

      table.appendChild(thead);
      table.appendChild(tbody);
      return table;
    },

    restore: () => original,
  };
};

function reduceInstances(instances) {
  return instances.map(({ urlHash, xpath, uuid }) => ({
    urlHash,
    xpath,
    uuid,
  }));
}

/**
 * Merges site-urls into inventory with an optimized format
 * @param {Object} siteUrls - The contents of site-urls.json
 * @param {Object} inventory - The contents of inventory.json
 * @param {string} publishUrl - The publish URL to use if targetUrl is not provided
 * @returns {Object} The merged inventory data in the new format
 */
export function mergeInventory(siteUrls, inventory, publishUrl) {
  // Extract originUrl and targetUrl from siteUrls
  const { originUrl, targetUrl } = siteUrls;

  // Transform URLs array to remove source property
  const urls = siteUrls.urls.map(({ url, targetPath, id }) => ({
    url,
    targetPath,
    id,
  }));

  // Transform fragments to use simplified instance format
  const fragments = inventory.fragments.map((fragment) => ({
    ...fragment,
    instances: reduceInstances(fragment.instances),
  }));

  // Transform blocks to use simplified instance format
  const blocks = inventory.blocks.map((block) => ({
    ...block,
    instances: reduceInstances(block.instances),
  }));

  // Transform outliers to use simplified instance format
  const outliers = reduceInstances(inventory.outliers);

  return {
    originUrl,
    targetUrl: targetUrl || publishUrl,
    urls,
    fragments,
    blocks,
    outliers,
  };
}

function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  const tableBuilder = TableBuilder(WebImporter.DOMUtils.createTable);
  // transform all block elements using parsers
  [...pageElements, ...blockElements].forEach(({ element = main, ...pageBlock }) => {
    const parserName = WebImporter.Import.getParserName(pageBlock);
    const parserFn = parsers[parserName];
    if (!parserFn) return;
    try {
      // before parse hook
      WebImporter.Import.transform(TransformHook.beforeParse, element, { ...source });
      // parse the element
      WebImporter.DOMUtils.createTable = tableBuilder.build(parserName);
      parserFn.call(this, element, { ...source });
      WebImporter.DOMUtils.createTable = tableBuilder.restore();
      // after parse hook
      WebImporter.Import.transform(TransformHook.afterParse, element, { ...source });
    } catch (e) {
      console.warn(`Failed to parse block: ${pageBlock.key}`, e);
    }
  });
}
