const mongoose = require('mongoose');
const schema=mongoose.Schema;

const statusSchema=new schema({
    status:{
        type:String,
        enum:['approved','pending','modified','disapproved']
    },
    description:String
});
module.exports=mongoose.model('Status',statusSchema);