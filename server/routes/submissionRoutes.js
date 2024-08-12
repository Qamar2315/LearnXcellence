const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");

// router.post("/:assignmentId", submissionController.upload.single('document_url'), submissionController.submitAssignment);
// router.get("/assignment/:assignmentId", submissionController.getSubmissions);
// router.get("/submission/:submissionId", submissionController.getSubmission);

module.exports = router;
