const mongoose = require('mongoose');
const schema=mongoose.Schema;

const projectSchema=new schema({
    name:String,
    scope:String,
    members:[
        {
            type: schema.Types.ObjectId,
            ref:'Student',
            min:1,
            max:4
        }
    ],
    projectLeader:{
        type: schema.Types.ObjectId,
        ref:'Student'
    },
    course:{
        type: schema.Types.ObjectId,
        ref:'Course'
    },
    status:
    {
        type: schema.Types.ObjectId,
        ref:'Status'
    },
    viva:{
        type: schema.Types.ObjectId,
        ref:'Viva'
    }
});
module.exports=mongoose.model('Project',projectSchema);