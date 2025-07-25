const mongoose = require('mongoose');
const schema=mongoose.Schema;

const vivaSchema=new schema({
    status:{
        type:String,
        enum:['scheduled','taken']
    },
    remarks:{
        type: schema.Types.ObjectId,
        ref:'Remarks'
    },
    dateCreated:{
        type:Date
    },
    vivaDate:{
        type:Date
    }
});
module.exports=mongoose.model('Viva',vivaSchema);