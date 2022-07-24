/*
Route endpoints that are exposed to the network
**/
import helpers from "../../lib/helpers.js";
import userResource from "./users.js"
import UserService from "../services/users.js"
import { createRequire } from "module";
const require = createRequire(import.meta.url);


helpers.registerApi(new userResource("users", UserService), ['/users', '/users/:id', '/users/:id/:action'])
