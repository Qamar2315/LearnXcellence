const mongoose = require("mongoose");
const schema = mongoose.Schema;

const voteSchema = new schema({
  poll: { type: schema.Types.ObjectId, ref: "Poll", required: true },
  student: { type: schema.Types.ObjectId, ref: "Student", required: true },
  option: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vote", voteSchema);
