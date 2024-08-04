const jwt= require('jsonwebtoken')
const Student= require('../models/Student')
const Teacher= require('../models/Teacher')
const asyncHandler=require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');

const isLogin= asyncHandler(async (req,res,next)=>{
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try{
            token=req.headers.authorization.split(" ")[1];
            const decoded= jwt.verify(token,"hi");
            const teacher=await Teacher.findById(decoded.id);
            const student=await Student.findById(decoded.id);
            if(teacher){
                req.user=teacher;
            }else if(student){
                req.user=student;
            }else{
                throw new AppError("NOT AUTHORIZED, TOKEN FAILED!",201);
            }
            next();
        }catch(error){
            throw new AppError("NOT AUTHORIZED, TOKEN FAILED!",201);
        }
    }
    if(!token){
        throw new AppError("NOT AUTHORIZED, NO TOKEN");
    }
})

module.exports={
    isLogin
};