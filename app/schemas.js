/**
@author Rotola Akinsowon
 @description Schema validation objects are defined here using joi validator
 */


import joi from 'joi'

export const userRequestSchema = joi.object({
    firstName: joi.string().alphanum().min(3).max(30).required(),
    lastName: joi.string().alphanum().min(3).max(30),
    email: joi.string().email(),
    password: joi.string().regex(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
}).options({stripUnknown: true})


export const userResponseSchema = joi.object({
    firstName: joi.string().alphanum().min(3).max(30).required(),
    lastName: joi.string().alphanum().min(3).max(30).required(),
    email: joi.string().email(),
})
