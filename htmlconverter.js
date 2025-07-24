// convert-table.js
// Usage: 
//   npm install cheerio
//   node convert-table.js

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 1. Load your HTML (make sure your <table class="table-matrix">…</table> is in table.html)
const html = fs.readFileSync(path.resolve(__dirname, 'table.html'), 'utf8');
const $ = cheerio.load(html);

// 2. Grab the second header row (the one with all the actual column names)
const rawHeaders = [];
$('table.table-matrix tr').eq(1).find('th').each((i, th) => {
  rawHeaders.push($(th).text().trim());
});

// 3. Turn those into JS-friendly keys (camelCase)
function toCamel(s) {
  return s
    .toLowerCase()
    .replace(/[\(\)\/\-\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^(\d)/, '_$1'); // prefix numeric-leading with underscore
}

const keys = rawHeaders.map(h => toCamel(h));

// 4. Parse each data row after the two header rows
const items = [];
$('table.table-matrix tr').slice(2).each((_, tr) => {
  const $td = $(tr).find('td');
  if (!$td.length) return;
  const obj = {};
  $td.each((i, cell) => {
    // strip non-numeric cells of weird whitespace
    let text = $(cell).text().trim();
    // if it's a number cell, convert to Number
    if (/^[\d]+$/.test(text)) text = Number(text);
    obj[ keys[i] || `col${i}` ] = text;
  });
  items.push(obj);
});

// 5. Write out to JSON
fs.writeFileSync(
  path.resolve(__dirname, 'items.json'),
  JSON.stringify(items, null, 2),
  'utf8'
);

console.log(`✔ Parsed ${items.length} rows.  Output → items.json`);
