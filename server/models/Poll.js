const mongoose = require("mongoose");
const schema = mongoose.Schema;

const pollSchema = new schema({
  course: { type: schema.Types.ObjectId, ref: "Course" },
  teacher: { type: schema.Types.ObjectId, ref: "Teacher" },
  title: String,
  description: String,
  options: {
    type: [{
      type: String,
      minlength: 1,
      maxlength: 100
    }],
    validate: {
      validator: function(options) {
        return options.length >= 2 && options.length <= 3;
      },
      message: "Options should have 2 to 3 elements."
    }
  },
  votes: [{ type: schema.Types.ObjectId, ref: "Vote" }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
  
  module.exports = mongoose.model("Poll", pollSchema);
  