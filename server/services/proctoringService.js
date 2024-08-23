const axios = require("axios");
const proctoringReportRepository = require("../repositories/proctoringReportRepository");
const quizSubmissionRepository = require("../repositories/quizSubmissionRepository");
const quizRepository = require("../repositories/quizRepository");
const AppError = require("../utilities/AppError");
const { deleteFileByPath } = require("../utilities/deleteFilesBypath");
const path = require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const analyzeImage = async (studentId, quizId, imagePath) => {
  const submission = await quizSubmissionRepository.findSubmission(
    quizId,
    studentId
  );

  if (!submission) {
    throw new AppError("No submission found quiz not started yet", 404);
  }

  if (submission.isCompleted) {
    throw new AppError("Quiz has already been completed", 400);
  }

  const currentTime = new Date();
  const timeRemaining = submission.endTime - currentTime;

  // Check if at least 40 seconds remain before the quiz ends
  if (timeRemaining < 40000) {
    throw new AppError("Cannot take image, quiz about to end", 400);
  }

  // Call Flask API to analyze the image
  const response = await axios.post(`${process.env.FLASK_URL}/analyze-image`, {
    image_path: imagePath,
  });

  if (!response.data.success) {
    throw new AppError(response.data.error, 400);
  }

  // Append the proctoring image to the submission's proctoring report
  const updatedReport = await proctoringReportRepository.updateProctoringReport(
    submission.proctoringReport,
    {
      imageId: "result_" + path.basename(imagePath),
      cheatingIndicators: response.data.data,
    }
  );

  deleteFileByPath(imagePath);

  return {
    success: true,
    message: "Image analyzed successfully",
    updatedReport,
  };
};

const generatePdfReport = async (courseId, quizId, studentId) => {
  // Fetch the quiz and submission details
  const quiz = await quizRepository.findQuizById(quizId);
  if (!quiz || !quiz.course.equals(courseId)) {
    throw new AppError("Quiz not found for the given course", 404);
  }

  const submission = await quizSubmissionRepository.findSubmission(
    quizId,
    studentId
  );

  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  if (!submission.isCompleted) {
    throw new AppError("Quiz is not completed yet", 400);
  }
  await submission.populate("student");

  // Fetch the AI proctoring report
  const proctoringReport =
    await proctoringReportRepository.getProctoringReportById(
      submission.proctoringReport
    );

  if (!proctoringReport) {
    throw new AppError("Proctoring report not found", 404);
  }

  await proctoringReport.populate("images");

  const formattedDateTime = new Date(submission.submittedAt).toLocaleString('en-GB', {
    dateStyle: 'short',
    timeStyle: 'medium',
  });

  // Generate the PDF report
  const doc = new PDFDocument();
  let buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  // Report Title
  doc.fontSize(22).text("Quiz Report", { align: "center", underline: true });
  doc.moveDown(1);

  // Quiz Details Section
  doc.fontSize(16).text("Quiz Details", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(14).text(`Student Name: ${submission.student.name}`);
  doc.fontSize(14).text(`Student ID: ${submission.student._id}`);
  doc.fontSize(14).text(`Quiz Title: ${quiz.title}`);
  doc.text(`Topic: ${quiz.topic}`);
  doc.text(`Submitted At: ${formattedDateTime}`);
  doc.moveDown(1);

  // Proctoring Report Section
  doc.fontSize(16).text("Proctoring Report", { underline: true });
  doc.moveDown(0.5);
  doc
    .fontSize(14)
    .text(`Cheating Probability: ${proctoringReport.cheating_probability}%`);
  doc.moveDown(1);

  // Adding Images to the PDF
  doc.fontSize(16).text("Proctoring Images", { underline: true });

  for (let i = 0; i < proctoringReport.images.length; i++) {
    const image = proctoringReport.images[i];
    const imagePath = path.join(
      __dirname,
      "../uploads/proctoring_result_db",
      image.image_id
    );

    if (fs.existsSync(imagePath)) {
      if (i === 0) {
        // First image on the first page
        doc.image(imagePath, {
          fit: [480, 640],
          align: "center",
          valign: "center",
        });
        doc.addPage(); // Add a new page after the first image
      } else {
        if ((i - 1) % 2 === 0) {
          // Add the first image of the new page
          doc.image(imagePath, {
            fit: [480, 640],
            align: "center",
            valign: "center",
          });
          doc.moveDown(50); // Space before the second image
        } else {
          // Add the second image on the same page
          doc.image(imagePath, {
            fit: [480, 640],
            align: "center",
            valign: "center",
          });
          doc.addPage(); // Add a new page after placing two images
        }
      }
    }
  }

  doc.end();
  // Wait until the PDF is generated
  return new Promise((resolve, reject) => {
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    doc.on("error", (err) => {
      reject(err);
    });
  });
};

module.exports = {
  analyzeImage,
  generatePdfReport,
};
