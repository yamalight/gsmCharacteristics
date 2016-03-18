import KeyTemplate from './templates/key';
import ValueTemplate from './templates/value';

const template = (str, id, key, val) => str
        .replace(/%ID%/gm, id)
        .replace(/%ID_ENC%/gm, encodeURIComponent(id))
        .replace(/%KEY%/gm, key)
        .replace(/%KEY_ENC%/gm, encodeURIComponent(key))
        .replace(/%VAL%/gm, val)
        .replace(/%VAL_ENC%/gm, encodeURIComponent(val));

export default (id, key, value) => {
    let result = template(KeyTemplate, id, key, '');

    if (Array.isArray(value)) {
        value.forEach(val => {
            result += template(ValueTemplate, id, val, key);
        });
    } else {
        result += template(ValueTemplate, id, value, key);
    }

    return result;
};
