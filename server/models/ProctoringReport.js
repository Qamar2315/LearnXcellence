const mongoose = require("mongoose");
const schema = mongoose.Schema;

// Define the AIProctoringReport schema
const aiProctoringReportSchema = new schema({
    images: [{ type: schema.Types.ObjectId, ref: "ProctoringImage" }],
    cheating_indicators: {
      mobile_phone: Number,
      extra_person: Number,
      mouth_open: Number,
      no_person: Number,
      eye_left_right: Number
    },
    cheating_probability: Number,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  });

module.exports = mongoose.model("AIProctoringReport", aiProctoringReportSchema);
