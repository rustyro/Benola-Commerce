

export const ValidationError = class extends Error {

    constructor(message, name, statusCode, errors) {

        super(message);
        this.statusCode = statusCode;
        this.name = name;
        this.errors = errors;
    }

    static isError(err) {

        return err instanceof exports.ValidationError;
    }
};

