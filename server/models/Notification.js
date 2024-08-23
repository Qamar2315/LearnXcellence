const mongoose = require("mongoose");
const schema = mongoose.Schema;

const notificationSchema = new schema({
  account: { type: schema.Types.ObjectId, ref: "Account" },
  title: String,
  content: String,
  read: Boolean,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
