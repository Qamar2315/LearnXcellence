const mongoose = require("mongoose");
const schema = mongoose.Schema;

const courseSchema = new schema({
  courseId: String,
  courseName: String,
  description: String,
  teacher: {
    type: schema.Types.ObjectId,
    ref: "Teacher",
  },
  vivas: [
    {
      type: schema.Types.ObjectId,
      ref: "Viva",
    },
  ],
  projects: [
    {
      type: schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  announcements: [
    {
      type: schema.Types.ObjectId,
      ref: "Announcement",
    },
  ],
  polls: [
    {
      type: schema.Types.ObjectId,
      ref: "Poll",
    },
  ],
  lectures: [
    {
      type: schema.Types.ObjectId,
      ref: "Lecture",
    },
  ],
  assignments: [
    {
      type: schema.Types.ObjectId,
      ref: "Assignment",
    },
  ],
  quizzes:[
    {
      type: schema.Types.ObjectId,
      ref: "Quiz",  
    }
  ],
  students: [
    {
      type: schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  projectStartDate: Date,
  projectEndDate: Date,
  vivaStartDate: Date,
  vivaEndDate: Date,
});
module.exports = mongoose.model("Course", courseSchema);
