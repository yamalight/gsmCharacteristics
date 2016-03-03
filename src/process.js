/* eslint max-params: [2, 3] */
/* eslint no-console: 0 */
/* eslint complexity: [2, 11] */
import _ from 'lodash';

const customizer = (objValue, srcValue) => {
    if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
    }
};

// kv splitter
const pairToKeyVal = (keyvalDelimitter, p) => {
    // if no delimitter, return self as key
    if (!keyvalDelimitter) {
        return {NO_KEY: [p]};
    }
    const kv = p.split(keyvalDelimitter);
    const joiner = typeof keyvalDelimitter === 'string' ? keyvalDelimitter : '';
    let key = (kv.shift() || '').trim().toLowerCase();
    let value = (kv.length === 1 ? kv[0] : kv.join(joiner) || '').trim().toLowerCase();

    if (key && (!value || !value.length)) {
        value = [key];
        key = 'NO_KEY';
    }

    return {
        [key]: value,
    };
};
// splitter
const splitter = (line, keyvalDelimitter, pairDelimitter) => {
    if (pairDelimitter) {
        const pairs = line.split(pairDelimitter);
        return pairs
            .map(p => pairToKeyVal(keyvalDelimitter, p))
            .reduce((prev, cur) => _.mergeWith(prev, cur, customizer), {});
    }

    return pairToKeyVal(keyvalDelimitter, line);
};

const colonRegex = /:\s?([^\/])/;
const semicolonRegex = /;\s?/;

// process long lines by known types
export const processByType = ({gsmid, line}) => {
    let res = {};
    // process
    if ((line.includes(':') || line.includes(': ')) && line.includes('; ')) {
        res = splitter(line, colonRegex, semicolonRegex);
    } else if ((line.includes(':') || line.includes(': ')) && line.includes(';;')) {
        res = splitter(line, colonRegex, ';;');
    } else if ((line.includes(':') || line.includes(': ')) && line.includes(', ')) {
        res = splitter(line, colonRegex, ', ');
    } else if ((line.includes(':') || line.includes(': ')) && line.includes('. ')) {
        res = splitter(line, colonRegex, '. ');
    } else if (line.includes('=') && line.includes(', ')) {
        res = splitter(line, '=', ', ');
    } else if (line.includes('=') && line.includes('; ')) {
        res = splitter(line, '=', '; ');
    } else if (line.includes('=')) {
        res = splitter(line, '=');
    } else if (line.includes(' - ')) {
        res = splitter(line, ' - ');
    } else if (line.includes('- ')) {
        res = splitter(line, '- ');
    } else if (line.includes(':') || line.includes(': ')) {
        res = splitter(line, colonRegex);
    } else if (line.includes('_')) {
        res = splitter(line, '_');
    } else if (line.includes('; ') || line.includes(';')) {
        res = splitter(line, undefined, semicolonRegex);
    } else if (line.includes(', ')) {
        res = splitter(line, undefined, ', ');
    } else if (line.includes('. ')) {
        res = splitter(line, undefined, '. ');
    } else {
        res = {UNTRANSFORMED: true};
    }

    // remove empty key-values
    if (res.hasOwnProperty('') && !res['']) {
        delete res[''];
    }

    return {
        ...res,
        gsmid,
        originalLine: line,
    };
};
