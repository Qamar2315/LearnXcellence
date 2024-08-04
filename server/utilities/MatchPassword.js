const bcrpt= require('bcrypt')

const matchPassword= async function (password,toCompare){
    return await bcrpt.compare(password,toCompare);
}


module.exports= matchPassword;