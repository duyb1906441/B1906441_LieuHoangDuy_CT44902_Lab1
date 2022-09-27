class ApiError extends Error {
    construction (statusCode, message){
       super();
       this.statusCode= statusCode;
       this.message = message;
      }
 }
 module.exports = ApiError;