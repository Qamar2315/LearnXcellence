const mongoose = require("mongoose");
const schema = mongoose.Schema;

const accountSchema = new schema({
  email: String,
  username: String,
  profile_picture:String,
  password: String,
  email_verified: Boolean,
  notifications: [
    {
      type: schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
  created_at: Date,
  updated_at: Date,
  otp:{
    type: schema.Types.ObjectId,
    ref: 'Otp'
  }
});
module.exports = mongoose.model("Account", accountSchema);
