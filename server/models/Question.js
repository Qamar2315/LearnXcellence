const mongoose = require("mongoose");
const schema = mongoose.Schema;

const questionSchema = new schema({
  content: String,
  options: [{
    type:String,
    min: 4,
    max: 4
  }],
  correct_option: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", questionSchema);
