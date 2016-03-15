/* eslint no-console: 0 */
import {join} from 'path';
import {readdirSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import templater from './obj-templater';
import prefixes from './templates/prefixes';

const filesPath = join(__dirname, '..', '..', 'out');
const files = readdirSync(filesPath);
const processed = files.filter(f => f.includes('processed_'));

// create folder
const resultPath = join(__dirname, '..', '..', 'ntout');
try {
    mkdirSync(resultPath);
} catch (e) {}

// index
let processedIndex = 0;
// parse
processed.forEach(file => {
    const json = JSON.parse(readFileSync(join(filesPath, file)).toString());
    const res = prefixes + '\n' + json.map(obj => templater(obj)).join('\n');
    writeFileSync(join(resultPath, `res_${processedIndex++}.nt`), res, 'utf8');
    console.log('converted file', processedIndex);
});
