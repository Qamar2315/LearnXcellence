const mongoose = require("mongoose");
const schema = mongoose.Schema;

// Define the ProctoringImage schema
const proctoringImageSchema = new schema({
  image_id: String,
  timestamp: { type: Date, default: Date.now },
  cheating_indicators: {
    mobile_phone: Boolean,
    extra_person: Boolean,
    mouth_open: Boolean,
    no_person: Boolean,
    eye_gaze: String
  },
});

module.exports = mongoose.model("ProctoringImage", proctoringImageSchema);