const mongoose = require("mongoose");
const schema = mongoose.Schema;

const quizSchema = new schema({
  course: { type: schema.Types.ObjectId, ref: "Course" },
  title: String,
  topic:String,
  questions: [{ type: schema.Types.ObjectId, ref: "Question" }],
  remarks: {
    type: schema.Types.ObjectId,
    ref: "Remarks",
  },
  deadline: Date,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quiz", quizSchema);
