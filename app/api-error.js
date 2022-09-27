class ApiError extends Error {
    constructor(statusCode, message){
        super();
        this.statusCode = statusCode;
        this.massage = massage;
    }
}

module.exports = ApiError;