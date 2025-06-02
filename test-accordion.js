import { JSDOM } from 'jsdom';
import parse from './tools/importer/parsers/accordion7.js';

// Create a test DOM
const dom = new JSDOM(`
  <div class="nsw-accordion">
    <div class="nsw-accordion__title">
      <button>Title 1</button>
    </div>
    <div class="nsw-accordion__content">
      <p>Content 1</p>
    </div>
    <div class="nsw-accordion__title">
      <button>Title 2</button>
    </div>
    <div class="nsw-accordion__content">
      <p>Content 2</p>
    </div>
  </div>
`);

// Set up global document
global.document = dom.window.document;

// Mock WebImporter
global.WebImporter = {
  DOMUtils: {
    createTable: (cells, doc) => {
      const table = doc.createElement('table');
      const thead = doc.createElement('thead');
      const tbody = doc.createElement('tbody');

      cells.forEach((row, i) => {
        const tr = doc.createElement('tr');
        row.forEach(cell => {
          const td = doc.createElement(i === 0 ? 'th' : 'td');
          if (i === 0) td.setAttribute('scope', 'column');
          
          if (cell instanceof doc.defaultView.Node) {
            td.appendChild(cell.cloneNode(true));
          } else if (Array.isArray(cell)) {
            cell.forEach(subCell => {
              if (subCell instanceof doc.defaultView.Node) {
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
        
        if (i === 0) {
          thead.appendChild(tr);
        } else {
          tbody.appendChild(tr);
        }
      });

      table.appendChild(thead);
      table.appendChild(tbody);
      return table;
    }
  }
};

// Run the test
const element = document.querySelector('.nsw-accordion');
const result = parse(element, { document });

// Log the results
console.log('Input HTML:', element.outerHTML);
console.log('\nOutput HTML:', result.outerHTML); 