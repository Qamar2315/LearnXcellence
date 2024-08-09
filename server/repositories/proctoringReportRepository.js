const AIProctoringReport = require("../models/ProctoringReport");
const ProctoringImage = require("../models/ProtoringImage");
const AppError = require("../utilities/AppError");

const createProctoringReport = async (reportData) => {
  return await AIProctoringReport.create(reportData);
};

const getProctoringReportById = async(id) => {
  return await AIProctoringReport.findById(id);
}

// Function to create a proctoring image and update the report
const updateProctoringReport = async (
  reportId,
  { imageId, cheatingIndicators }
) => {
  const proctoringImage = await ProctoringImage.create({
    image_id: imageId,
    cheating_indicators: cheatingIndicators,
  });

  const report = await AIProctoringReport.findById(reportId);
  if (!report) {
    throw new AppError("Proctoring report not found", 404);
  }

  // Add the new image to the report
  report.images.push(proctoringImage._id);

  // Update the cheating indicators in the report
  report.cheating_indicators.mobile_phone += cheatingIndicators.mobile_phone
    ? 1
    : 0;
  report.cheating_indicators.extra_person += cheatingIndicators.extra_person
    ? 1
    : 0;
  report.cheating_indicators.mouth_open += cheatingIndicators.mouth_open
    ? 1
    : 0;
  report.cheating_indicators.no_person += cheatingIndicators.no_person ? 1 : 0;

  report.cheating_indicators.eye_left_right += cheatingIndicators.eye_gaze == "center" ? 0 :1; 
  report.updated_at = new Date();

  await report.save();

  return report;
};

module.exports = {
  createProctoringReport,
  updateProctoringReport,
  getProctoringReportById
};
