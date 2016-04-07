import KeyTemplate from './templates/key';
import ValueTemplate from './templates/value';

const escape = (str) => JSON.stringify(str).substring(1).substring(0, str.length);

const template = (str, id, key, val) => str
        .replace(/%ID%/gm, escape(id))
        .replace(/%ID_ENC%/gm, encodeURIComponent(id))
        .replace(/%KEY%/gm, escape(key))
        .replace(/%KEY_ENC%/gm, encodeURIComponent(key))
        .replace(/%VAL%/gm, escape(val))
        .replace(/%VAL_ENC%/gm, JSON.stringify(val));

export default (id, key, value) => {
    let result = template(KeyTemplate, id, key, '');

    if (Array.isArray(value)) {
        value.forEach(val => {
            result += template(ValueTemplate, id, key, val);
        });
    } else {
        result += template(ValueTemplate, id, key, value);
    }

    return result;
};
