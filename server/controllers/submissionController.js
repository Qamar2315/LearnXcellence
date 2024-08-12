const submissionService = require("../services/submissionService");

const submitAssignment = async (req, res) => {
  try {
    const { student, assignmentId } = req.body;
    const document_url = req.file ? req.file.path : '';
    const submission = await submissionService.submitAssignment({ student, assignment: assignmentId, document_url });
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await submissionService.getSubmissions(assignmentId);
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await submissionService.getSubmission(submissionId);
    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { submitAssignment, getSubmissions, getSubmission };
