const mongoose = require('mongoose');
const schema=mongoose.Schema;

const remarkSchema=new schema({
    overallPerformance: { type: String, enum: ['Bad', 'Poor', 'Fair', 'Good', 'Excellent'] },
    feedback: String,
    obtainedMarks: Number,
    totalMarks: Number,
    dateCreated: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});
module.exports=mongoose.model('Remarks',remarkSchema);