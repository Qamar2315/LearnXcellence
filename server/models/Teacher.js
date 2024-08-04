const mongoose = require('mongoose');
const schema=mongoose.Schema;

const teacherSchema=new schema({
    name:String,
    courses:[{
        type: schema.Types.ObjectId,
        ref:'Course'
    }],
    account:{
        type: schema.Types.ObjectId,
        ref:'Account'
    }
});
module.exports=mongoose.model('Teacher',teacherSchema);