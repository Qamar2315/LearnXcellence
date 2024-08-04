const mongoose = require("mongoose");
const schema = mongoose.Schema;

const pollSchema = new schema({
    course: { type: schema.Types.ObjectId, ref: "Course" },
    teacher: { type: schema.Types.ObjectId, ref: "Teacher" },
    title: String,
    description: String,
    options: [
        {
            type: String,
            min: 2,
            max: 3
        }
    ],  
    votes: [
      {
        student: { type: schema.Types.ObjectId, ref: "Student" },
        option: String
      }
    ],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Poll", pollSchema);
  