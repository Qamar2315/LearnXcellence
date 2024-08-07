const mongoose = require("mongoose");
const schema = mongoose.Schema;

const submissionSchema = new schema({
    quiz: { type: schema.Types.ObjectId, ref: "Quiz" },
    student: { type: schema.Types.ObjectId, ref: "Student" },
    answers: [{
        question: { type: schema.Types.ObjectId, ref: "Question" },
        selectedOption: String
    }],
    score: Number,
    submitted_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QuizSubmission", submissionSchema);
