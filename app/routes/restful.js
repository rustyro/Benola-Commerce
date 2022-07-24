/*
 * Base file to handel typical routing of HTTP request methods
 * This file exports a class that can be extended by specific resources
 */

import express from 'express'

/**
 *
 */
export class baseResource {
    constructor(resourceName = "", serviceClass=null, schemas=null) {
        this.resourceName = resourceName
        this.serviceClass = serviceClass
        this.schemas = schemas
    }

    /**
     * Validate form data sent in against a predifined schema of acceptable key and values
     * @param {{}} data
     * @param {string} id
     * @param {string} action
     * @returns {*}
     */
    validateData(data, id, action) {
        let schema = this.schemas['default']
        schema = this.schemas[action] ? typeof(action) === "string": schema

        if (!schema){
            throw new Error("you must define a schema")
        }
        const {error, value} = schema.validate(data)
        if (error){
            throw error
        }
        return value
    }

    /**
     * Execute the HTTP request
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async serve(req, res) {
        const {id, action} = req.resourceParams
        if (req.method.toLowerCase() === "get"){
            await this.get(req, res, id, action)
        }
        if (["post", "put"].includes(req.method.toLowerCase())){
            req.validatedData = this.validateData(req.body, id, action)
            await this.post(req, res, id, action)
        }
    }

    // get an object by ID. Defaults to fectching from the database using the model schema
    async fetch(id){
        return await this.serviceClass.get(id)
    }

    // persist some information to the data store
    async save(data = {}){
        return await this.serviceClass.create({data: data})
    }

    // persist some information on an existing object in the data store
    async update(id, data = {}){
        return await this.serviceClass.update(id, {data: data})
    }

    // query the information from the datastore
    async query(){
        return await this.serviceClass.list()
    }

    executeQuery(){

    }

    async get(req, res, id = undefined, action = undefined) {
        if (!id) {
            res["data"].results = await this.query()
        } else {
            res["data"].body = await this.fetch(id)
        }
    }

    async post(req, res, id = undefined, action = undefined) {
        if (!id) {
            res["data"].body = await this.save(req.validatedData)
        } else {
            res["data"].body = await this.update(id, req.validatedData)
        }
    }

    put(req, res, id = undefined, action = undefined) {
        if (!id) {
            res["data"].body = ["i'm returning a list of shit"]
        } else {
            res["data"].body = {
                'name': 'Rotola Akinsowon',
                'username': 'RSUTY',
                'email': 'akins.rotola@gmail.com'
            }
        }
    }

    delete(req, res, id = undefined, action = undefined) {
        if (!id) {
            res["data"].body = ["i'm returning a list of shit"]
        } else {
            res["data"].body = {
                'name': 'Rotola Akinsowon',
                'username': 'RSUTY',
                'email': 'akins.rotola@gmail.com'
            }
        }
    }

}


export default baseResource;