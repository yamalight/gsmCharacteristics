/* eslint max-params: [2, 3] */
/* eslint no-console: 0 */
/* eslint complexity: [2, 11] */
import {readFileSync, writeFileSync} from 'fs';

const saveToFile = (obj, filename) => writeFileSync(filename, JSON.stringify(obj, null, 2), 'utf8');

// get plain text
const text = readFileSync('./gsmCharacteristics.csv').toString();
// split by lines
const lines = text.replace(/\r\n/gm, '\n').split('\n');
// remove empty lines
const cleanLines = lines.filter(l => l.trim().length > 0);

// split on short and long lines
const SHORT_LENGTH = 10;
const shortLines = cleanLines.filter(l => l.length < SHORT_LENGTH);
const longLines = cleanLines.filter(l => l.length > SHORT_LENGTH);
// save short to file
saveToFile(shortLines, './out/short.json');

// clean line
const cleanLine = line => line.replace(/\t/gm, ' ');
// kv splitter
const pairToKeyVal = (keyvalDelimitter, p) => {
    const kv = p.split(keyvalDelimitter);
    return {
        [kv[0].trim()]: (kv[1] || '').trim(),
    };
};
// splitter
const splitter = (line, keyvalDelimitter, pairDelimitter) => {
    if (pairDelimitter) {
        const pairs = line.split(pairDelimitter);
        return pairs
            .map(p => pairToKeyVal(keyvalDelimitter, p))
            .reduce((prev, cur) => Object.assign(prev, cur), {});
    }

    return pairToKeyVal(keyvalDelimitter, line);
};
// process long lines by known types
const processByType = line => {
    // clean
    line = cleanLine(line);
    // process
    if (line.includes(': ') && line.includes(', ')) {
        return splitter(line, ': ', ', ');
    } else if (line.includes(': ') && line.includes('. ')) {
        return splitter(line, ': ', '. ');
    } else if (line.includes('=')) {
        return splitter(line, '=');
    } else if (line.includes(': ') && line.includes('; ')) {
        return splitter(line, ': ', '; ');
    } else if (line.includes(': ') && line.includes(';;')) {
        return splitter(line, ': ', ';;');
    } else if (line.includes(' - ')) {
        return splitter(line, ' - ');
    } else if (line.includes('- ')) {
        return splitter(line, '- ');
    } else if (line.includes(':')) {
        return splitter(line, ':');
    } else if (line.includes('_')) {
        return splitter(line, '_');
    } else if (line.includes('[') && line.includes('=')) {
        return splitter(line, '=');
    }

    return {UNTRANSFORMED: true, line};
};
const newLines = longLines.map(processByType);
const untransformed = newLines.filter(o => o.UNTRANSFORMED);
const transformed = newLines.filter(o => !o.UNTRANSFORMED);
saveToFile(transformed, './out/processed.json');
saveToFile(untransformed, './out/not-processed.json');

console.log('done!');
