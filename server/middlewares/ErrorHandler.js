const AppError = require("../utilities/AppError")

const notFound= (req,res,next)=>{
    const error= new AppError("Requested Source Not Found",404);
    next(error);
}

const errorHandler=(err,req,res,next)=>{
    const status= err.status || 500;
    res.status(status).json({
        message:err.message
    })
}

module.exports={notFound,errorHandler}