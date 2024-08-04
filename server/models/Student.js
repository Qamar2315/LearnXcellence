const mongoose = require('mongoose');
const schema=mongoose.Schema;

const studentSchema=new schema({
    name:String,
    isGroupLeader:Boolean,
    face_biometric_data:[Number],
    courses :[{
        type: schema.Types.ObjectId,
        ref:'Course'
    }],
    account:{
        type: schema.Types.ObjectId,
        ref:'Account'
    }
});
module.exports=mongoose.model('Student',studentSchema);