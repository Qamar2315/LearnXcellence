const jwt= require('jsonwebtoken')

const generateToken= (id)=>{
    return jwt.sign({id},"hi",{expiresIn:"30d"});
}

module.exports= generateToken;