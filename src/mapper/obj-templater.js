import ObjectTemplate from './templates/object';
import kvTemplater from './kv-templater';

export default (object) => {
    // get id
    const id = object.gsmid;
    // create object template
    let result = ObjectTemplate.replace(/%ID%/gm, id);

    // process all other key-value pairs
    Object.keys(object)
    .filter(key => key !== 'gsmid')
    .forEach(key => {
        const value = object[key];
        result += kvTemplater(id, key, value);
    });

    return result;
};
