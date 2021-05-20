const {validationResult} = require('express-validator');

class AppError extends Error {
    constructor(statusCode, errors) {
        super();
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

function errorHandler(err, req, res, next) {
    if (err instanceof AppError) { // validation failed
        res.status(err.statusCode).json({errors: err.errors})
    } else {
        console.log(err);
        res.status(500)
            .json({error: err});
    }
}

function validateRequest(req, resp, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new AppError(400, errors.array())
    }
    next()
}

module.exports = {
    AppError,
    errorHandler,
    validateRequest
};