import { baseResource } from "./restful.js";
import {userRequestSchema, userResponseSchema} from "../schemas.js";

class userResource extends baseResource {
    constructor(resourceName, serviceClass, schemas) {
        super(resourceName, serviceClass, schemas);
    }

    schemas = this.schemas ? true: {default: userRequestSchema, response: userResponseSchema}

}

export default userResource;
