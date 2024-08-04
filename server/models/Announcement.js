const mongoose = require("mongoose");
const schema = mongoose.Schema;

const announcementSchema = new schema({
  course: { type: schema.Types.ObjectId, ref: "Course" },
  teacher: { type: schema.Types.ObjectId, ref: "Teacher" },
  title: String,
  content: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Announcement", announcementSchema);
