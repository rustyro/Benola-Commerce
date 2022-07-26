/**
 *
 *
 * */

import app from "../app.js";
import { ValidationError } from "./errors.js";


let helpers = {}


helpers.registerApi = (resourceClass, paths, prefix = "") => {
    app.api_registry.push([resourceClass, paths])
}

helpers.initialize_api = () => {
    const resources = app.api_registry
    if (resources.length > 0 && typeof (resources) == "object") {
        for (const resource of resources) {
            for (const p of resource[1]) {
                app.url_map.rules[p] = {path: p, resource: resource[0]}
            }
        }
    }
}

export const responseHelpers = {}

responseHelpers.paginate = () => {
}
responseHelpers.filter = () => {
}
responseHelpers.sort = () => {
}
responseHelpers.parseQuery = () => {
}
responseHelpers.serialize = (data, schemas, id, action) => {
    let schema = schemas['response']
    schema = schemas[action] ? typeof (action) === "string" : schema

    if (!schema) {
        throw new Error("you must define a schema")
    }
    let resp = {}
    let errors = {}
    const parseErrors = (err) => {errors[err.context.key] = err.message}
    if (data instanceof Array) {
        resp = data.map((obj) => {
            const {error, value} = schema.validate(obj.toJSON(), {stripUnknown: true, abortEarly: false})
            if (error) {
                error.details.forEach(parseErrors)
                throw new ValidationError(error.message, "ValidationFailed", 409, errors)
            }
            return value
        })
    } else {
        const {error, value} = schema.validate(data, {stripUnknown: true, abortEarly: false})
        if (error) {
            throw new ValidationError(error.message, "ValidationFailed", 409)
        }
        resp = value
    }
    return resp
}
responseHelpers.listResponse = (req, res) => {
    const {id, action} = req.resourceParams
    let [resp, err] = [{}, null]
    responseHelpers.parseQuery()
    responseHelpers.filter()
    responseHelpers.paginate()
    responseHelpers.sort()
    try {
        resp = responseHelpers.serialize(res.data.results, req.resourceClass.schemas, id, action)
    } catch (e) {
        err = e
    }
    return [resp, err]
}
responseHelpers.objectResponse = (req, res) => {
    const {id, action} = req.resourceParams
    let [resp, err] = [{}, null]
    try {
        resp = responseHelpers.serialize(res.data.body.toJSON(), req.resourceClass.schemas, id, action)
    } catch (e) {
        err = e
    }
    return [resp, err]
}


export default helpers
