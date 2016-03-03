/* eslint max-params: [2, 3] */
/* eslint no-console: 0 */
/* eslint complexity: [2, 11] */
import {readFileSync, writeFileSync} from 'fs';
import {processByType} from './process';

const saveToFile = (obj, filename) => writeFileSync(filename, JSON.stringify(obj, null, 2), 'utf8');

// get plain text
const text = readFileSync('./gsmCharacteristics.csv').toString();
// split by lines
const lines = text
    .replace(/\r\n/gm, '\n')
    .split('\n')
    .map(l => {
        const kv = l.split(',');
        const gsmid = kv.shift().toLowerCase();
        const line = kv.join(',').replace(/\t/gm, ' ').replace(/\u0000/gm, '').trim().toLowerCase();
        return {
            gsmid,
            line,
        };
    })
    // remove empty lines
    .filter(l => l.line.length > 0);
// save shorts
const SHORT_LENGTH = 5;
const shortLines = lines.filter(l => l.line.length < SHORT_LENGTH).map(v => `${v.gsmid}, ${v.line}`);
saveToFile(shortLines, './out/short.json');
shortLines.length = 0;

console.log('saved short!');

// process
const newLines = lines.filter(l => l.line.length > SHORT_LENGTH).map(processByType);

// save untransformed
const untransformed = newLines.filter(o => o.UNTRANSFORMED).map(v => `${v.gsmid}, ${v.originalLine}`);
saveToFile(untransformed, './out/not-processed.json');
untransformed.length = 0;

console.log('saved untransformed!');

// save transformed
const transformed = newLines.filter(o => !o.UNTRANSFORMED);
const PAGE_SIZE = 200000;
const pages = Math.floor(transformed.length / PAGE_SIZE);
console.log('total size:', transformed.length);
for (let i = 0; i <= pages; i++) {
    const start = PAGE_SIZE * i;
    let end = PAGE_SIZE * i + PAGE_SIZE;
    if (end >= transformed.length) {
        end = transformed.length - 1;
    }
    const tosave = transformed.slice(start, end);
    saveToFile(tosave, `./out/processed_${i}.json`);
    tosave.length = 0;
    console.log('saved page:', i);
}

console.log('done!');
