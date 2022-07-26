/*

 */


const utils = {}

/**
 * Remove unwanted keys from and object
 * @param {Array<string>} ignored_keys
 * @param {object} data
 */
utils.clean_keys = (ignored_keys, data) => {
    for (const key of ignored_keys) {
        if (key in data) {
            delete data.key
        }
    }
    return data
}

/**
 * Set properties of an object from values supplied from a dictionary
 * @param {object} obj object to be populated
 * @param {{}} data data to use to populate the object
 */
utils.populate_object = (obj, data) => {
    for (const key in data){
        if (key in obj){
            obj[key] = data[key]
        }
    }
    return obj
}

export default utils