const mongoose = require("mongoose");
const schema = mongoose.Schema;

const submissionSchema = new schema({
  quiz: { type: schema.Types.ObjectId, ref: "Quiz" },
  student: { type: schema.Types.ObjectId, ref: "Student" },
  proctoringReport: { type: schema.Types.ObjectId, ref: "AIProctoringReport" },
  answers: [
    {
      question: { type: schema.Types.ObjectId, ref: "Question" },
      selectedOption: String,
    },
  ],
  score: Number,
  startedAt: { type: Date, default: Date.now },
  endTime: { type: Date },
  submittedAt: { type: Date },
  isCompleted: { type: Boolean, default: false },
  isFlagged: { type: Boolean, default: false },
});

module.exports = mongoose.model("QuizSubmission", submissionSchema);
