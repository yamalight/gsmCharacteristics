import KeyTemplate from './templates/key';
import ValueTemplate from './templates/value';

export default (id, key, value) => {
    let result = KeyTemplate.replace(/%ID%/gm, id).replace(/%KEY%/gm, key);

    if (Array.isArray(value)) {
        value.forEach(val => {
            result += ValueTemplate.replace(/%ID%/gm, id).replace(/%VAL%/gm, val);
        });
    } else {
        result += ValueTemplate.replace(/%ID%/gm, id).replace(/%VAL%/gm, value);
    }

    return result;
};
