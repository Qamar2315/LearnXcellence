const axios = require("axios");
const proctoringReportRepository = require("../repositories/proctoringReportRepository");
const quizSubmissionRepository = require("../repositories/quizSubmissionRepository");
const authRepository = require("../repositories/authRepository");
const quizRepository = require("../repositories/quizRepository");
const courseRepository = require("../repositories/courseRepository");
const AppError = require("../utilities/AppError");
const { deleteFileByPath } = require("../utilities/deleteFilesBypath");
const path = require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const { extractEnrollment } = require("../utilities/extractEnrollment");
const { base64Image } = require("../utilities/convertToBase64");
const puppeteer = require("puppeteer");

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
  if (timeRemaining < 30000) {
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

// Deprecated
// const generatePdfReport = async (courseId, quizId, studentId) => {
//   // Fetch the quiz and submission details
//   const quiz = await quizRepository.findQuizById(quizId);
//   if (!quiz || !quiz.course.equals(courseId)) {
//     throw new AppError("Quiz not found for the given course", 404);
//   }

//   const submission = await quizSubmissionRepository.findSubmission(
//     quizId,
//     studentId
//   );

//   if (!submission) {
//     throw new AppError("Submission not found", 404);
//   }

//   if (!submission.isCompleted) {
//     throw new AppError("Quiz is not completed yet", 400);
//   }
//   await submission.populate("student");

//   // Fetch the AI proctoring report
//   const proctoringReport =
//     await proctoringReportRepository.getProctoringReportById(
//       submission.proctoringReport
//     );

//   if (!proctoringReport) {
//     throw new AppError("Proctoring report not found", 404);
//   }

//   await proctoringReport.populate("images");

//   const formattedDateTime = new Date(submission.submittedAt).toLocaleString('en-GB', {
//     dateStyle: 'short',
//     timeStyle: 'medium',
//   });

//   // Generate the PDF report
//   const doc = new PDFDocument();
//   let buffers = [];
//   doc.on("data", buffers.push.bind(buffers));
//   doc.on("end", () => {});

//   // Report Title
//   doc.fontSize(22).text("Quiz Report", { align: "center", underline: true });
//   doc.moveDown(1);

//   // Quiz Details Section
//   doc.fontSize(16).text("Quiz Details", { underline: true });
//   doc.moveDown(0.5);
//   doc.fontSize(14).text(`Student Name: ${submission.student.name}`);
//   doc.fontSize(14).text(`Student ID: ${submission.student._id}`);
//   doc.fontSize(14).text(`Quiz Title: ${quiz.title}`);
//   doc.text(`Topic: ${quiz.topic}`);
//   doc.text(`Submitted At: ${formattedDateTime}`);
//   doc.moveDown(1);

//   // Proctoring Report Section
//   doc.fontSize(16).text("Proctoring Report", { underline: true });
//   doc.moveDown(0.5);
//   doc
//     .fontSize(14)
//     .text(`Cheating Probability: ${proctoringReport.cheating_probability}%`);
//   doc.moveDown(1);

//   // Adding Images to the PDF
//   doc.fontSize(16).text("Proctoring Images", { underline: true });

//   for (let i = 0; i < proctoringReport.images.length; i++) {
//     const image = proctoringReport.images[i];
//     const imagePath = path.join(
//       __dirname,
//       "../uploads/proctoring_result_db",
//       image.image_id
//     );

//     if (fs.existsSync(imagePath)) {
//       if (i === 0) {
//         // First image on the first page
//         doc.image(imagePath, {
//           fit: [480, 640],
//           align: "center",
//           valign: "center",
//         });
//         doc.addPage(); // Add a new page after the first image
//       } else {
//         if ((i - 1) % 2 === 0) {
//           // Add the first image of the new page
//           doc.image(imagePath, {
//             fit: [480, 640],
//             align: "center",
//             valign: "center",
//           });
//           doc.moveDown(50); // Space before the second image
//         } else {
//           // Add the second image on the same page
//           doc.image(imagePath, {
//             fit: [480, 640],
//             align: "center",
//             valign: "center",
//           });
//           doc.addPage(); // Add a new page after placing two images
//         }
//       }
//     }
//   }

//   doc.end();
//   // Wait until the PDF is generated
//   return new Promise((resolve, reject) => {
//     doc.on("end", () => {
//       const pdfData = Buffer.concat(buffers);
//       resolve(pdfData);
//     });
//     doc.on("error", (err) => {
//       reject(err);
//     });
//   });
// };

// const generatePdfReport = async (courseId, quizId, studentId) => {
//   // Fetch the quiz and submission details
//   const quiz = await quizRepository.findQuizById(quizId);
//   if (!quiz || !quiz.course.equals(courseId)) {
//     throw new AppError("Quiz not found for the given course", 404);
//   }

//   const submission = await quizSubmissionRepository.findSubmission(
//     quizId,
//     studentId
//   );

//   if (!submission) {
//     throw new AppError("Submission not found", 404);
//   }

//   if (!submission.isCompleted) {
//     throw new AppError("Quiz is not completed yet", 400);
//   }
//   await submission.populate("student");

//   // Fetch the AI proctoring report
//   const proctoringReport =
//     await proctoringReportRepository.getProctoringReportById(
//       submission.proctoringReport
//     );

//   if (!proctoringReport) {
//     throw new AppError("Proctoring report not found", 404);
//   }

//   await proctoringReport.populate("images");

//   const formattedDateTime = new Date(submission.submittedAt).toLocaleString(
//     "en-GB",
//     {
//       dateStyle: "short",
//       timeStyle: "medium",
//     }
//   );
//   const student = await authRepository.findStudentById(studentId);
//   // Generate the PDF report
//   const doc = new PDFDocument({ margin: 50 });
//   let buffers = [];
//   doc.on("data", buffers.push.bind(buffers));
//   doc.on("end", () => {});

//   // Title Section
//   doc
//     .fontSize(24)
//     .font("Helvetica-Bold")
//     .fillColor("#007BFF")
//     .text("Quiz Report", { align: "center", underline: true });
//   doc.moveDown(1);

//   // Quiz Details Section
//   doc
//     .fontSize(18)
//     .font("Helvetica-Bold")
//     .fillColor("black")
//     .text("Quiz Details", { underline: true });
//   doc.moveDown(0.5);
//   doc
//     .fontSize(14)
//     .font("Helvetica")
//     .text(`Student Name: ${submission.student.name}`)
//     .moveDown(0.2);
//   doc.text(`Student Enrollment: ${extractEnrollment(student.account.email)}`).moveDown(0.2);
//   doc.text(`Quiz Title: ${quiz.title}`).moveDown(0.2);
//   doc.text(`Topic: ${quiz.topic}`).moveDown(0.2);
//   doc.text(`Submitted At: ${formattedDateTime}`);
//   doc.moveDown(1);

//   // Proctoring Report Section
//   doc
//     .fontSize(18)
//     .font("Helvetica-Bold")
//     .fillColor("black")
//     .text("Proctoring Report", { underline: true });
//   doc.moveDown(0.5);
//   doc
//     .fontSize(14)
//     .font("Helvetica")
//     .text(`Cheating Probability: ${proctoringReport.cheating_probability}%`);
//   doc.moveDown(1);

//   // Adding a horizontal line
//   doc
//     .moveTo(doc.x, doc.y)
//     .lineTo(doc.page.width - doc.page.margins.right, doc.y)
//     .strokeColor("#CCCCCC")
//     .lineWidth(1)
//     .stroke();
//   doc.moveDown(1);

//   // Proctoring Images Section
//   doc
//     .fontSize(18)
//     .font("Helvetica-Bold")
//     .fillColor("black")
//     .text("Proctoring Images", { underline: true });
//   doc.moveDown(1);

//   for (let i = 0; i < proctoringReport.images.length; i++) {
//     const image = proctoringReport.images[i];
//     const imagePath = path.join(
//       __dirname,
//       "../uploads/proctoring_result_db",
//       image.image_id
//     );

//     if (fs.existsSync(imagePath)) {
//       doc.image(imagePath, {
//         fit: [300, 400],
//         align: "center",
//         valign: "center",
//       });

//       // Add a caption for the image
//       doc.moveDown(0.5);
//       doc
//         .fontSize(12)
//         .font("Helvetica-Oblique")
//         .text(`Image ${i + 1}`, { align: "center" });

//       // Add a new page after every two images
//       if ((i + 1) % 2 === 0) {
//         doc.addPage();
//       } else {
//         doc.moveDown(2);
//       }
//     }
//   }

//   doc.end();

//   // Wait until the PDF is generated
//   return new Promise((resolve, reject) => {
//     doc.on("end", () => {
//       const pdfData = Buffer.concat(buffers);
//       resolve(pdfData);
//     });
//     doc.on("error", (err) => {
//       reject(err);
//     });
//   });
// };

const generatePdfReport = async (courseId, quizId, studentId) => {
  try {
    // Fetch the quiz and submission details (replace with your actual repository calls)
    const quiz = await quizRepository.findQuizById(quizId);
    if (!quiz || !quiz.course.equals(courseId)) {
      throw new AppError("Quiz not found for the given course", 404);
    }
    const course = await courseRepository
      .findCourseById(quiz.course)
      .populate("teacher");
    if (!course) {
      throw new AppError("Course not found", 404);
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

    const student = await authRepository.findStudentById(studentId);
    if (!student) {
      throw new AppError("Student not found", 404);
    }

    // Fetch the AI proctoring report
    const proctoringReport =
      await proctoringReportRepository.getProctoringReportById(
        submission.proctoringReport
      );

    if (!proctoringReport) {
      throw new AppError("Proctoring report not found", 404);
    }

    await proctoringReport.populate("images");

    const formattedDateTime = new Date(submission.submittedAt).toLocaleString(
      "en-GB",
      {
        dateStyle: "short",
        timeStyle: "medium",
      }
    );
    const enrollment = extractEnrollment(student.account.email);

    // Dynamically generate image paths (important!)
    const imagePaths = proctoringReport.images.map((image) =>
      path.join(__dirname, "../uploads/proctoring_result_db", image.image_id)
    );

    const htmlContent = `
      <!DOCTYPE html>
      <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz Report</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        padding: 0;
        color: #333;
        background-color: #f9f9f9;
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .header img {
        max-width: 150px; /* Adjust the size of your logo */
        height: auto;
      }
      .header h1 {
        font-size: 30px;
        color: #007BFF;
        margin-bottom: 10px;
      }
      .section {
        margin-bottom: 25px;
        padding: 15px;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .section-title {
        font-size: 22px;
        margin-bottom: 15px;
        color: #444;
        border-bottom: 2px solid #007BFF;
        padding-bottom: 8px;
      }
      .section-content p {
        margin: 5px 0;
        line-height: 1.6;
        font-size: 16px;
      }
      .cheating-probability, .status {
        font-size: 24px;
        font-weight: bold;
        margin: 10px 0;
      }
      .cheating-high {
        color: red;
      }
      .cheating-low {
        color: green;
      }
      .status {
        text-align: center;
        padding: 10px;
        border-radius: 8px;
        font-size: 20px;
        width: fit-content;
        margin: 10px auto;
      }
      .status-detected {
        background-color: #ffcccc;
        color: red;
      }
      .status-not-detected {
        background-color: #ccffcc;
        color: green;
      }
      .proctoring-images {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        justify-content: center;
      }
      .proctoring-images img {
        max-width: 800px;
        max-height: 400px;
        width: 90vw;
        height: auto;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        object-fit: cover;
      }
      .caption {
        text-align: center;
        font-size: 14px;
        color: #666;
        margin-top: 5px;
      }
      .footer {
        margin-top: 30px;
        text-align: center;
        font-size: 14px;
        color: #666;
      }
      .logo-container{
        width: 100%;
        display: flex;
        justify-content: end;
      }
    </style>
  </head>
      <body>
    <div class="header">
      <div class='logo-container' >
      </div>
      <h1>Quiz Report</h1>
    </div>

    <div class="section">
      <h2 class="section-title">Quiz Details</h2>
      <div class="section-content">
        <p><strong>Student Name:</strong> ${student.name}</p>
        <p><strong>Student Enrollment:</strong> ${enrollment}</p>
        <p><strong>Quiz Title:</strong> ${quiz.title}</p>
        <p><strong>Topic:</strong> ${quiz.topic}</p>
        <p><strong>Course Name:</strong> ${course.courseName}</p>
        <p><strong>Submitted At:</strong> ${formattedDateTime}</p>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Proctoring Report</h2>
      <div class="section-content">
        <p class="cheating-probability ${
          proctoringReport.cheating_probability > 50
            ? "cheating-high"
            : "cheating-low"
        }">
          Cheating Probability: ${proctoringReport.cheating_probability}%
        </p>
        <div class="status ${
          proctoringReport.cheating_probability > 50
            ? "status-detected"
            : "status-not-detected"
        }">
          ${
            proctoringReport.cheating_probability > 50
              ? "Cheating Detected"
              : "No Cheating"
          }
        </div>
      </div>
    </div>
      <div class="section">
        <h2 class="section-title">Proctoring Images</h2>
        <div class="proctoring-images">
          ${imagePaths
            .map(
              (imagePath, index) => `
            <div>
              <img src="${base64Image(imagePath)}" alt="Proctoring Image ${
                index + 1
              }" onerror="this.style.display='none'"/> <p class="caption">Image ${
                index + 1
              }</p>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    <div class="footer">
      <p><strong>Report Generated By: </strong>${course.teacher.name} </p>
    </div>
       
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate the PDF as a buffer
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    // Ensure the `reports` directory exists
    const reportsDir = path.join(__dirname, "../uploads/reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Save the buffer to a file
    const uniqueId = `${studentId}_${Date.now()}`;
    const filePath = path.join(reportsDir, `${uniqueId}.pdf`);
    fs.writeFileSync(filePath, pdfBuffer);

    // Return the unique file ID
    return uniqueId;
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Handle the error appropriately, e.g., throw it or return an error response
    throw error;
  }
};

module.exports = {
  analyzeImage,
  generatePdfReport,
};
