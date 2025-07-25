const mongoose = require("mongoose");
const schema = mongoose.Schema;

const submissionSchema = new schema({
  student: { type: schema.Types.ObjectId, ref: "Student" },
  assignment: { type: schema.Types.ObjectId, ref: "Assignment" },
  document_id: String,
  remarks: {type: schema.Types.ObjectId, ref: "Remarks"},
  submitted_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Submission", submissionSchema);