import {User} from "../models.js";
import ServiceFactory from "../../lib/serviceFactory.js";

const BaseUserService = ServiceFactory.create(User, true, "isTest")

class UserService extends BaseUserService{

    static async list() {
        // let response =
        return User.find()
    }
}

export default UserService