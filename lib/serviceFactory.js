/**
 * Service Factory class to generate classes bound to models to perform the basic CRUD functions
 */
import utils from "./utils.js";
import mongoose from 'mongoose'

export class ServiceFactory{

    /**
     *
     * @param {object} modelClass database model class
     * @param {boolean} isTest determines whether objects creates by this service are to be marked as test records
     * @param {string} testAttr  declares the attribute on the object to mark the test property on
     */
    static create(modelClass, isTest, testAttr){

        class Service {
            static model = modelClass
            static isTest = isTest
            static testAttr = testAttr

            /**
             *
             * @param {String} id
             * @returns {module:mongoose.Types.ObjectId}
             */
            static prepare_id(id){
                const objId = mongoose.Types.ObjectId
                if(! id instanceof objId && objId.isValid(id) && new objId(id).toString() === id){
                    id = new objId(id)
                }
                return id
            }

            /**
             *
             * @param {String} id
             * @returns {Promise<awaited Query<T extends Document ? Require_id<T> : (Document<unknown, any, T> & Require_id<T> & TVirtuals & TMethodsAndOverrides), T extends Document ? Require_id<T> : (Document<unknown, any, T> & Require_id<T> & TVirtuals & TMethodsAndOverrides), TQueryHelpers, T> & TQueryHelpers>}
             */
            static async get(id){
                const _id = id
                id = this.prepare_id(id)
                try {
                    return await this.model.findById(id)
                }
                catch (e) {
                    console.log(e, "the error=====")
                }
            }

            /**
             *
             * @param {Array<string>} ignored_keys
             * @param {object} data
             * @returns {Promise<awaited Query<T extends Document ? Require_id<T> : (Document<unknown, any, T> & Require_id<T> & TVirtuals & TMethodsAndOverrides), T extends Document ? Require_id<T> : (Document<unknown, any, T> & Require_id<T> & TVirtuals & TMethodsAndOverrides), TQueryHelpers, T> & TQueryHelpers>}
             */
            static async create({ignored_keys = [], data= {}} = {}){
                if (ignored_keys.length === 0) {
                    ignored_keys = ["_id", "date_created", "last_updated"]
                }
                let obj = new this.model()
                obj = utils.populate_object(obj, utils.clean_keys(ignored_keys, data))
                try {
                    return await obj.save()
                }
                catch (e) {
                    console.log(e, "the error=====")
                }
            }

            /**
             * Update a document in the database by ID
             * @param id
             * @param ignored_keys
             * @param data
             * @returns {Promise<*>}
             */
            static async update(id, {ignored_keys = [], data = {}} = {}){
                if (ignored_keys.length === 0) {
                    ignored_keys = ["_id", "date_created", "last_updated"]
                }
                let obj = await this.get(id)
                obj = utils.populate_object(obj, utils.clean_keys(ignored_keys, data))
                if (ignored_keys.includes("last_updated")){
                    obj.last_updated = Date.now()
                }
                try {
                    return await obj.save()
                }
                catch (e) {
                    console.log(e, "the error=====")
                }
            }

            /**
             * Delete a document for the database by ID
             * @param id
             * @returns {Promise<*>}
             */
            static async delete(id){
                let obj = await this.get(id)
                try {
                    return await obj.remove()
                }
                catch (e) {
                    console.log(e, "the error=====")
                }
            }
        }

        return Service
    }
}

export default ServiceFactory