const mongoose = require("mongoose");
const schema = mongoose.Schema;

const lectureSchema = new schema({
  course_id: { type: schema.Types.ObjectId, ref: "Course" },
  teacher_id: { type: schema.Types.ObjectId, ref: "Teacher" },
  title: String,
  description: String,
  video_id: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lecture", lectureSchema);
