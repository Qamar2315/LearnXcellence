/**
 * Represents an application error.
 * @class
 * @extends Error
 */
class AppError extends Error{
    constructor(message,status){
        super()
        this.message=message;
        this.status=status;
    }
}
module.exports= AppError