/* eslint no-console: 0 */
import {join} from 'path';
import {readdirSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import templater from './obj-templater';

const filesPath = join(__dirname, '..', '..', 'out');
const files = readdirSync(filesPath);
const processed = files.filter(f => f.includes('processed_'));

// create folder
const resultPath = join(__dirname, '..', '..', 'ntout');
mkdirSync(resultPath);

// index
let processedIndex = 0;
// parse
processed.forEach(file => {
    const json = JSON.parse(readFileSync(join(filesPath, file)).toString());
    json.forEach(obj => {
        const res = templater(obj);
        writeFileSync(join(resultPath, `res_${processedIndex++}.nt`), res, 'utf8');
    });
});
