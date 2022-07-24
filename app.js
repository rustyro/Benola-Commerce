import {createRequire} from "module";
import path from 'path';
import {fileURLToPath} from 'url';
import {responseHelpers} from "./lib/helpers.js";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const app = express();

app.api_registry = []
app.url_map = {rules: {}}

const resourceHandler = (app, path = "") => {
    const rules = app.url_map.rules

    for (const rule in rules) {
        //    find exact match
        if (path === rule) {
            return {resource: app.url_map.rules[rule].resource, params: {}}
        }

        //    check that base exists and slashes match, then interpolate params
        const url = path.split("/")
        const pattern = rule.split("/")
        if (url[0] !== pattern[0] || url.length !== pattern.length) {
            continue
        }
        let params = {}
        let match = false

        for (let p of pattern) {
            // check that literals match in the url
            if (!p.startsWith(":") && p !== url[pattern.indexOf(p)]) {
                console.log("i broke====", p, url[pattern.indexOf(p)])
                break
            }
            // find param variables
            if (p.startsWith(":")) {
                params[p.substring(1)] = url[pattern.indexOf(p)]
                // params.push(p.substring(1))
            }

            if (pattern.indexOf(p) === pattern.length - 1) {
                match = true
            }

        }
        if (match) {
            return {resource: app.url_map.rules[rule].resource, params: params}
        }
    }

//    callback error response of 404
    return {resource: null, params: {}}
}

const authMiddleware = function (req, res, next) {
    next()
}

const routeLoaderMiddleware = function (req, res, next) {
    //  find the view for the path
    let {resource, params} = resourceHandler(app, req.path)
    if (!resource) {
        res.status(404)
        res.send({error: 404})
    } else {
        res.data = {}
        req.resourceClass = resource
        req.resourceParams = params
        res.set('Content-Type', "application/json")
        next()
    }
}

const requestMiddleware = async function (req, res, next) {
    await req.resourceClass.serve(req, res)
    res.set('Content-Type', "application/json")
    next()
}

const responseMiddleware = function (req, res, next) {
    const {results} = res.data
    let [response, error] = [{}, null]
    if (results) {
        [response, error] = responseHelpers.listResponse(req, res)
    } else {
        [response, error] = responseHelpers.objectResponse(req, res)
    }
    if (error) {
        next(error)
    } else {
        res.send(response)
    }
}

const baseMiddleware = [authMiddleware, routeLoaderMiddleware, requestMiddleware, responseMiddleware]

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(baseMiddleware)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.statusCode || 500);
    res.send({error: err.name || "UnkwonwError", message: err.message, errors: err.errors});
});

export default app;
