const mongoose = require("mongoose");
const schema = mongoose.Schema;

const assignmentSchema = new schema({
  course: { type: schema.Types.ObjectId, ref: "Course" },
  teacher: { type: schema.Types.ObjectId, ref: "Teacher" },
  title: String,
  description: String,
  document_id: String,
  deadline: Date,
  submissions: [
    {
      type: schema.Types.ObjectId,
      ref: "Submission",
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Assignment", assignmentSchema);
