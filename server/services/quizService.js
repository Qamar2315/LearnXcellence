const quizRepository = require("../repositories/quizRepository");
const questionRepository = require("../repositories/questionRepository");
const courseRepository = require("../repositories/courseRepository");
const quizSubmissionRepository = require("../repositories/quizSubmissionRepository");
const proctoringReportRepository = require("../repositories/proctoringReportRepository");
const authRepository = require("../repositories/authRepository");
const notificationService = require("./notificationService");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const genAI = new GoogleGenerativeAI(process.env.GEMENI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const { calculateQuizScore } = require("../utilities/calculateQuizScore");
const { extractEnrollment } = require("../utilities/extractEnrollment");
const _ = require("lodash");
const AppError = require("../utilities/AppError");
const AdmZip = require("adm-zip");
const axios = require("axios");
const puppeteer = require("puppeteer");
const path = require("path");

require("dotenv").config();

// API service message deprecated
// const createQuiz = async (
//   courseId,
//   title,
//   topic,
//   questions,
//   deadline,
//   duration,
//   number_of_questions
// ) => {
//   if (
//     !courseId ||
//     !title ||
//     !questions ||
//     !topic ||
//     !deadline ||
//     !duration ||
//     !number_of_questions
//   ) {
//     throw new AppError("Input all required fields", 400);
//   }
//   if (questions.length < number_of_questions) {
//     throw new AppError("", );
//   }
//   if (new Date(deadline) < new Date()) {
//     throw new AppError("Deadline must be in the future", 400);
//   }
//   let course = await courseRepository.getCourseById(courseId);

//   if (!course) {
//     throw new AppError("Course not found", 404);
//   }
//   const questionIds = [];
//   for (const questionData of questions) {
//     let question = await questionRepository.findQuestionByContent(
//       questionData.content
//     );
//     if (!question) {
//       question = await questionRepository.createQuestion(questionData);
//     }
//     questionIds.push(question._id);
//   }

//   const quiz = await quizRepository.createQuiz({
//     course,
//     title,
//     deadline,
//     topic,
//     duration,
//     number_of_questions,
//     questions: questionIds,
//   });
//   course.quizzes.push(quiz._id);
//   await course.save();

//   // notify students
//   for (const student of course.students) {
//     const studentData = await authRepository.findStudentById(student);
//     const studentAccount = await authRepository.findAccountById(
//       studentData.account
//     );
//     await notificationService.createNotification(
//       {
//         title: "New Quiz",
//         content: `A new quiz has been added to course: ${course.courseName}`,
//         read: false,
//       },
//       studentAccount._id
//     );
//   }

//   return quiz;
// };

const createQuiz = async (
  courseId,
  title,
  topic,
  questions,
  deadline,
  duration,
  number_of_questions
) => {
  if (
    !courseId ||
    !title ||
    !questions ||
    !topic ||
    !deadline ||
    !duration ||
    !number_of_questions
  ) {
    throw new AppError("Input all required fields", 400);
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new AppError("Questions must be a non-empty array", 400);
  }

  if (questions.length < number_of_questions) {
    throw new AppError(
      `The number of provided questions (${questions.length}) is less than the required number (${number_of_questions})`,
      400
    );
  }

  if (isNaN(new Date(deadline).getTime())) {
    throw new AppError("Invalid deadline format", 400);
  }

  if (new Date(deadline) < new Date()) {
    throw new AppError("Deadline must be in the future", 400);
  }

  let course = await courseRepository.getCourseById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const questionIds = [];
  for (const questionData of questions) {
    if (!questionData.content || !questionData.options) {
      throw new AppError(
        "Each question must have content, type, and options",
        400
      );
    }

    let question = await questionRepository.findQuestionByContent(
      questionData.content
    );
    if (!question) {
      question = await questionRepository.createQuestion(questionData);
    }
    questionIds.push(question._id);
  }

  const quiz = await quizRepository.createQuiz({
    course,
    title,
    deadline,
    topic,
    duration,
    number_of_questions,
    questions: questionIds,
  });

  course.quizzes.push(quiz._id);
  await course.save();

  // Notify students
  for (const student of course.students) {
    const studentData = await authRepository.findStudentById(student);
    if (!studentData) {
      console.warn(`Student with ID ${student} not found`);
      continue;
    }

    const studentAccount = await authRepository.findAccountById(
      studentData.account
    );
    if (!studentAccount) {
      console.warn(`Account for student ID ${student} not found`);
      continue;
    }

    await notificationService.createNotification(
      {
        title: "New Quiz",
        content: `A new quiz has been added to course: ${course.courseName}`,
        read: false,
      },
      studentAccount._id
    );
  }

  return quiz;
};

const updateQuiz = async (
  quizId,
  title,
  topic,
  questions,
  deadline,
  duration,
  number_of_questions
) => {
  if (
    !quizId ||
    !title ||
    !questions ||
    !topic ||
    !deadline ||
    !duration ||
    !number_of_questions
  ) {
    throw new AppError("Input all required fields", 400);
  }

  // Validate that the deadline is in the future
  if (new Date(deadline) < new Date()) {
    throw new AppError("Deadline must be in the future", 400);
  }

  // Fetch the quiz by ID
  const quiz = await quizRepository.getQuizById(quizId);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  const questionIds = [];

  // Process each question in the payload
  for (const questionData of questions) {
    const { _id, content, options, correct_option } = questionData;

    // Ensure required fields exist
    if (!_id || !content || !options || !correct_option) {
      throw new AppError(
        "Each question must include _id, content, options, and correct_option",
        400
      );
    }

    if (options.length !== 4) {
      throw new AppError("Each question must have exactly 4 options", 400);
    }

    // Check if the question exists
    const question = await questionRepository.getQuestionById(_id);
    if (!question) {
      throw new AppError(`Question with ID ${_id} not found`, 404);
    }

    // Update the question fields
    question.content = content;
    question.options = options;
    question.correct_option = correct_option;
    await question.save();

    questionIds.push(_id);
  }

  // Update the quiz fields
  quiz.title = title;
  quiz.topic = topic;
  quiz.deadline = deadline;
  quiz.duration = duration;
  quiz.number_of_questions = number_of_questions;
  quiz.questions = questionIds;
  // Save the updated quiz
  quiz.updated_at = new Date();
  await quiz.save();
  await quiz.populate("questions");
  return quiz;
};

const deleteQuiz = async (quizId, courseId) => {
  const quiz = await quizRepository.getQuizById(quizId);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  if (courseId !== quiz.course.toString()) {
    throw new AppError("Course ID does not match", 400);
  }
  // Delete quiz
  await quizRepository.deleteQuizById(quizId);
  // Remove the quiz reference from the associated course
  const course = await courseRepository.getCourseById(quiz.course);
  if (!course) {
    throw new AppError("Course not found", 404);
  }
  course.quizzes.pull(quizId);
  await course.save();
};

const getQuiz = async (id, courseId) => {
  const quiz = await quizRepository.findQuizById(id);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }
  if (quiz.course.toString() !== courseId) {
    throw new AppError("Course ID does not match", 400);
  }
  return quiz;
};

const getQuizStudent = async (id, courseId) => {
  const quiz = await quizRepository.findQuizById(id);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }
  if (quiz.course.toString() !== courseId) {
    throw new AppError("Course ID does not match", 400);
  }

  // Shuffle the questions
  const shuffledQuestions = _.shuffle(quiz.questions);

  // Get the number of questions stated in the quiz model
  const numberOfQuestions = quiz.number_of_questions;

  // Return the specified number of questions
  const selectedQuestions = shuffledQuestions.slice(0, numberOfQuestions);

  // If you need to return the entire quiz object with the modified questions
  return { ...quiz.toObject(), questions: selectedQuestions };
};

const getQuizzesByCourse = async (courseId) => {
  const quizzes = await quizRepository.getQuizzesByCourse(courseId);
  return quizzes;
};

const startQuiz = async (quizId, studentId) => {
  const quiz = await quizRepository.getQuizById(quizId);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  const existingSubmission = await quizSubmissionRepository.findSubmission(
    quizId,
    studentId
  );
  if (existingSubmission && !existingSubmission.isCompleted) {
    throw new AppError("Quiz is already started and not completed", 400);
  }

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + quiz.duration * 60000);

  const newSubmission = await quizSubmissionRepository.createSubmission({
    quiz: quizId,
    student: studentId,
    startedAt: startTime,
    endTime: endTime,
  });

  quiz.submissions.push(newSubmission._id);
  await quiz.save();

  // Create the proctoring report and link it to the submission
  const proctoringReport =
    await proctoringReportRepository.createProctoringReport({
      images: [],
      cheating_indicators: {
        mobile_phone: 0,
        extra_person: 0,
        mouth_open: 0,
        no_person: 0,
        eye_left_right: 0,
      },
    });

  newSubmission.proctoringReport = proctoringReport;
  await newSubmission.save();

  return newSubmission;
};

const submitQuiz = async (quizId, studentId, answers) => {
  // Find the submission for the given quiz and student
  const submission = await quizSubmissionRepository.findSubmission(
    quizId,
    studentId
  );

  // Validate if answers are provided
  if (!answers) {
    throw new AppError("Input answers");
  }

  // Fetch the quiz details by ID
  const quiz = await quizRepository.findQuizById(quizId);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  // Check if the submission exists
  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  // Check if the quiz has already been submitted
  if (submission.isCompleted) {
    throw new AppError("Quiz already submitted", 400);
  }

  // Ensure the submission is within the allowed time
  const currentTime = new Date();
  if (currentTime > submission.endTime) {
    throw new AppError("Quiz time has expired", 400);
  }

  // Update submission with the provided answers
  submission.answers = answers;
  submission.submittedAt = currentTime;
  submission.isCompleted = true;

  // Fetch the proctoring report linked to the submission
  const proctoringReport =
    await proctoringReportRepository.getProctoringReportById(
      submission.proctoringReport
    );

  // Extract features from the proctoring report for cheating detection
  const features = [
    proctoringReport.images.length,
    proctoringReport.cheating_indicators.mobile_phone,
    proctoringReport.cheating_indicators.extra_person,
    proctoringReport.cheating_indicators.mouth_open,
    proctoringReport.cheating_indicators.no_person,
    proctoringReport.cheating_indicators.eye_left_right,
  ];

  // Make a request to the Flask API to assess cheating probability
  let isFlagged = false;
  const response = await axios.post(
    `${process.env.FLASK_URL}/predict-cheating`,
    {
      features: features,
    }
  );

  // Extract cheating probability from the response
  const cheatingProbability = response.data.data.cheating_probability;

  // Flag the submission if cheating probability is above the threshold
  if (cheatingProbability > 60) {
    isFlagged = true;
  }

  if (isFlagged) {
    submission.isFlagged = true;
  }

  // Update the proctoring report with the cheating probability
  proctoringReport.cheating_probability = cheatingProbability;

  // Calculate and assign the quiz score based on the submitted answers
  submission.score = calculateQuizScore(answers, quiz.questions);

  // Save the updated proctoring report and submission
  await proctoringReport.save();
  await submission.save();

  // Return the updated submission
  return submission;
};

const updateSubmissionMarks = async (
  courseId,
  quizId,
  submissionId,
  newScore
) => {
  // Get the course by its ID
  const course = await courseRepository.getCourseById(courseId);

  // Check if the course exists
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // Check if the quiz belongs to the course
  const quizBelongsToCourse = course.quizzes.includes(quizId);
  if (!quizBelongsToCourse) {
    throw new AppError("Quiz does not belong to the specified course", 400);
  }

  // Fetch the quiz details by ID
  const quiz = await quizRepository.findQuizById(quizId);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  // Find the submission for the given quiz and student
  const submission = await quizSubmissionRepository.findSubmissionById(
    submissionId
  );

  // Check if the submission exists
  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  // Check if the quiz has already been submitted
  if (!submission.isCompleted) {
    throw new AppError("Quiz has not been submitted yet", 400);
  }

  if (newScore < 0) {
    throw new AppError("Score cannot be negative", 400);
  }

  if (newScore > quiz.number_of_questions) {
    throw new AppError(
      "Score cannot be greater than the number of questions",
      400
    );
  }
  // Update the submission score
  submission.score = newScore;

  // Save the updated submission
  await submission.save();
  //notify student
  const student = await authRepository.findStudentById(submission.student);
  const studentAccount = await authRepository.findAccountById(student.account);
  await notificationService.createNotification(
    {
      title: "Quiz Score Updated",
      content: `Your score for the quiz ${quiz.title} has been updated.`,
      read: false,
    },
    studentAccount._id
  );
  return submission;
};

const updateSubmissionFlag = async (
  courseId,
  quizId,
  submissionId,
  isFlagged
) => {
  // Fetch the course to ensure the quiz belongs to it
  const course = await courseRepository.getCourseById(courseId);

  // Ensure the quiz belongs to the course
  if (!course.quizzes.includes(quizId)) {
    throw new AppError("Quiz does not belong to the specified course", 404);
  }

  // Fetch the submission
  const submission = await quizSubmissionRepository.findSubmissionById(
    submissionId
  );
  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  // Ensure the submission is for the correct quiz
  if (submission.quiz.toString() !== quizId) {
    throw new AppError("Submission does not belong to the specified quiz", 400);
  }

  // Update the isFlagged status
  submission.isFlagged = isFlagged;
  await submission.save();

  return submission;
};

const generateQuestionsByTopic = async (
  topic,
  numberOfQuestions,
  difficulty
) => {
  // const genAI = new GoogleGenerativeAI(process.env.GEMENI_API_KEY);
  // const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
  Generate ${numberOfQuestions} multiple-choice questions about ${topic}
  with difficulty level: ${difficulty}.
  Output format: JSON Array. Each question should have the following structure:
  {
    "content": "Question text",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correct_option": "Correct option (Should be one of the options from the options array)"
  }
  `;

  try {
    const result = await model.generateContent(prompt);
    let response = result.response;

    let jsonString = response
      .text()
      .replace(/^```json\s+/, "")
      .replace(/\s+```$/, "");

    const jsonArray = JSON.parse(jsonString);
    return jsonArray;
  } catch (err) {
    console.error("Error generating questions:", err);
    throw new AppError(
      "Failed to generate quiz questions. Please try again later.",
      500
    );
  }
};

const generateQuestionsByContent = async (
  topic,
  content,
  numberOfQuestions,
  difficulty
) => {
  const prompt = `
    Generate ${numberOfQuestions} multiple-choice questions ${
    topic ? `about the topic: "${topic}"` : ""
  } 
    ${content ? `based on the following content: "${content}"` : ""}
    with a difficulty level of ${difficulty}.
    Output format: JSON Array. Each question should have the following structure:
    {
      "content": "Question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct_option": "Correct option (Should be one of the options from the options array)"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    let response = result.response;

    let jsonString = response
      .text()
      .replace(/^```json\s+/, "")
      .replace(/\s+```$/, "");

    const jsonArray = JSON.parse(jsonString);
    return jsonArray;
  } catch (err) {
    console.error("Error generating questions:", err);
    throw new AppError(
      "Failed to generate quiz questions. Please try again later.",
      500
    );
  }
};

// Deprecated V1
// const generatePDFStudent = async (courseId, id, studentId) => {
//   // Fetch Quiz, Student, and Course Information
//   const quiz = await quizRepository.findQuizById(id);
//   if (!quiz) {
//     throw new AppError("Quiz not found", 404);
//   }

//   const student = await authRepository.findStudentById(studentId);
//   if (!student) {
//     throw new AppError("Student not found", 404);
//   }

//   const account = await authRepository.findAccountById(student.account);
//   if (!account) {
//     throw new AppError("Account not found", 404);
//   }

//   const course = await courseRepository.getCourseById(courseId);
//   if (!course) {
//     throw new AppError("Course not found", 404);
//   }

//   // Check if student is enrolled in the course
//   if (course.students.indexOf(studentId) === -1) {
//     throw new AppError("Student not enrolled in the course", 400);
//   }

//   const enrollment = extractEnrollment(account.email);

//   // Generate the PDF document
//   const doc = new PDFDocument();
//   let buffers = [];
//   doc.on("data", buffers.push.bind(buffers));
//   doc.on("end", () => {});

//   // Add Quiz and Student Details to the PDF
//   doc.fontSize(18).text(`${quiz.title}`, { align: "center" }).moveDown();
//   doc.fontSize(14).text(`Topic: ${quiz.topic}`).moveDown();
//   doc
//     .fontSize(12)
//     .text(
//       "---------------------------------------------------------------------------------------------------------------------"
//     )
//     .moveDown();
//   doc.text(`Student Name: ${student.name}`).moveDown();
//   doc.text(`Student Enrollment: ${enrollment}`).moveDown();
//   doc
//     .fontSize(12)
//     .text(
//       "---------------------------------------------------------------------------------------------------------------------"
//     )
//     .moveDown();

//   // Shuffle and limit the number of questions
//   const shuffledQuestions = quiz.questions.sort(() => Math.random() - 0.5);
//   const selectedQuestions = shuffledQuestions.slice(
//     0,
//     quiz.number_of_questions
//   );

//   selectedQuestions.forEach((question, index) => {
//     doc
//       .fontSize(14)
//       .text(`${index + 1}. ${question.content}`)
//       .moveDown(0.5); // Slightly reduce space between questions

//     // Add options with circles before them
//     question.options.forEach((option) => {
//       doc.fontSize(12).text(`o    ${option}`, {
//         indent: 20,
//       }); // Indent options
//       doc.moveDown(0.2); // Reduce space between options
//     });
//     doc.moveDown(0.5); // Move down a bit after each question
//   });

//   // Finalize the PDF Document
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

// v2
// const generatePDFStudent = async (courseId, id, studentId) => {
//   // Fetch Quiz, Student, and Course Information
//   const quiz = await quizRepository.findQuizById(id);
//   if (!quiz) {
//     throw new AppError("Quiz not found", 404);
//   }

//   const student = await authRepository.findStudentById(studentId);
//   if (!student) {
//     throw new AppError("Student not found", 404);
//   }

//   const account = await authRepository.findAccountById(student.account);
//   if (!account) {
//     throw new AppError("Account not found", 404);
//   }

//   const course = await courseRepository.getCourseById(courseId);
//   if (!course) {
//     throw new AppError("Course not found", 404);
//   }

//   // Check if student is enrolled in the course
//   if (course.students.indexOf(studentId) === -1) {
//     throw new AppError("Student not enrolled in the course", 400);
//   }

//   const enrollment = extractEnrollment(account.email);

//   // Generate the PDF document
//   const doc = new PDFDocument({ margin: 50 });
//   let buffers = [];
//   doc.on("data", buffers.push.bind(buffers));
//   doc.on("end", () => {});

//   // Add Quiz Title and Total Marks
//   doc.fontSize(18).text(`${quiz.title}`, { align: "center" }).moveDown(0.5);
//   doc
//     .fontSize(14)
//     .text(`Topic: ${quiz.topic}`, { align: "center" })
//     .moveDown(0.5);
//   doc
//     .fontSize(14)
//     .text(`Total Marks: ${quiz.number_of_questions}`, { align: "center" })
//     .moveDown(1);

//   // Add a separator line
//   doc
//     .fontSize(12)
//     .text(
//       "---------------------------------------------------------------------------------------------------------------------",
//       { align: "center" }
//     )
//     .moveDown();

//   // Add Student Details
//   doc.fontSize(14).text(`Student Name: ${student.name}`).moveDown(0.2);
//   doc.text(`Student Enrollment: ${enrollment}`).moveDown(1);

//   // Add another separator line
//   doc
//     .fontSize(12)
//     .text(
//       "---------------------------------------------------------------------------------------------------------------------",
//       { align: "center" }
//     )
//     .moveDown();

//   // Shuffle and limit the number of questions
//   const shuffledQuestions = quiz.questions.sort(() => Math.random() - 0.5);
//   const selectedQuestions = shuffledQuestions.slice(
//     0,
//     quiz.number_of_questions
//   );

//   selectedQuestions.forEach((question, index) => {
//     doc
//       .fontSize(14)
//       .text(`${index + 1}. ${question.content}`)
//       .moveDown(0.5);

//     // Add options with circles before them
//     question.options.forEach((option) => {
//       doc.fontSize(12).text(`o    ${option}`, { indent: 20 }); // Indent options with a circle
//       doc.moveDown(0.2);
//     });
//     doc.moveDown(0.5); // Move down a bit after each question
//   });

//   // Finalize the PDF Document
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

// V3 Generate PDF
const generatePDFStudent = async (courseId, id, studentId) => {
  // Fetch Quiz, Student, and Course Information
  const quiz = await quizRepository.findQuizById(id);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  const student = await authRepository.findStudentById(studentId);
  if (!student) {
    throw new AppError("Student not found", 404);
  }

  const account = await authRepository.findAccountById(student.account);
  if (!account) {
    throw new AppError("Account not found", 404);
  }

  const course = await courseRepository.getCourseByIdAlongWithTeacher(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // Check if student is enrolled in the course
  if (course.students.indexOf(studentId) === -1) {
    throw new AppError("Student not enrolled in the course", 400);
  }

  const enrollment = extractEnrollment(account.email);

  const shuffledQuestions = quiz.questions.sort(() => Math.random() - 0.5);
  const selectedQuestions = shuffledQuestions.slice(
    0,
    quiz.number_of_questions
  );

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quiz PDF</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          padding: 0;
        }
        .header {
          text-align: center;
          margin-bottom: 15px;
        }
        .header h1 {
          font-size: 30px;
          margin-bottom: 5px;
        }
        .header h3 {
          font-size: 18px;
          margin: 2px 0;
        }
        .separator {
          border-top: 2px solid #000;
          margin: 15px 0;
        }
        .student-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }
        .rules-section, .question-section {
          margin-bottom: 15px;
        }
        .question {
          margin-bottom: 8px;
        }
        .option {
          margin-left: 20px;
          margin-bottom: 10px;
          
        }
        .rules-section ul {
          list-style-type: disc;
          padding-left: 40px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${quiz.title}</h1>
        <h3>Topic: ${quiz.topic}</h3>
        <h3>Total Marks: ${quiz.number_of_questions}</h3>
        <h3>Duration: ${quiz.duration} minutes</h3>
      </div>

      <div class="separator"></div>

      <div class="student-info">
        <div>
          <p><strong>Student Name:</strong> ${student.name}</p>
          <p><strong>Student Enrollment:</strong> ${enrollment}</p>
        </div>
        <div>
          <p><strong>Course:</strong> ${course.courseName}</p>
          <p><strong>Teacher:</strong> ${course.teacher.name}</p>
        </div>
      </div>

      <div class="separator"></div>

      <div class="rules-section">
        <h3>Quiz Rules:</h3>
        <ul>
          <li>Finish the quiz within the allotted time.</li>
          <li>Do not use any external help or materials.</li>
          <li>All answers must be submitted before the time expires.</li>
          <li>No cheating or collaboration with others is allowed.</li>
          <li>Follow all instructions provided by the instructor.</li>
        </ul>
      </div>

      <div class="separator"></div>

      <div class="question-section">
        ${selectedQuestions
          .map(
            (question, index) => `
          <div class="question">
            <p><strong>${index + 1}. ${question.content}</strong></p>
            ${question.options
              .map(
                (option) => `
              <p class="option">o ${option}</p>
            `
              )
              .join("")}
          </div>
        `
          )
          .join("")}
      </div>
    </body>
    </html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent);

  return new Promise(async (resolve, reject) => {
    try {
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "15mm",
          bottom: "15mm",
          left: "10mm",
          right: "10mm",
        },
      });

      await browser.close();

      // Resolve with the PDF buffer
      resolve(pdfBuffer);
    } catch (error) {
      reject(error);
    }
  });
};

const generatePDFStudentSingle = async (courseId, id, studentId) => {
  // Fetch Quiz, Student, and Course Information
  const quiz = await quizRepository.findQuizById(id);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  const student = await authRepository.findStudentById(studentId);
  if (!student) {
    throw new AppError("Student not found", 404);
  }

  const account = await authRepository.findAccountById(student.account);
  if (!account) {
    throw new AppError("Account not found", 404);
  }

  const course = await courseRepository.getCourseByIdAlongWithTeacher(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // Check if student is enrolled in the course
  if (course.students.indexOf(studentId) === -1) {
    throw new AppError("Student not enrolled in the course", 400);
  }

  const enrollment = extractEnrollment(account.email);

  const shuffledQuestions = quiz.questions.sort(() => Math.random() - 0.5);
  const selectedQuestions = shuffledQuestions.slice(
    0,
    quiz.number_of_questions
  );

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quiz PDF</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; padding: 0; }
        .header { text-align: center; margin-bottom: 15px; }
        .separator { border-top: 2px solid #000; margin: 15px 0; }
        .student-info { display: flex; justify-content: space-between; margin-bottom: 15px; }
        .rules-section ul { list-style-type: disc; padding-left: 40px; }
        .question { margin-bottom: 8px; }
        .option { margin-left: 20px; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${quiz.title}</h1>
        <h3>Topic: ${quiz.topic}</h3>
        <h3>Total Marks: ${quiz.number_of_questions}</h3>
        <h3>Duration: ${quiz.duration} minutes</h3>
      </div>

      <div class="separator"></div>

      <div class="student-info">
        <div>
          <p><strong>Student Name:</strong> ${student.name}</p>
          <p><strong>Student Enrollment:</strong> ${enrollment}</p>
        </div>
        <div>
          <p><strong>Course:</strong> ${course.courseName}</p>
          <p><strong>Teacher:</strong> ${course.teacher.name}</p>
        </div>
      </div>

      <div class="separator"></div>

      <div class="rules-section">
        <h3>Quiz Rules:</h3>
        <ul>
          <li>Finish the quiz within the allotted time.</li>
          <li>Do not use any external help or materials.</li>
          <li>All answers must be submitted before the time expires.</li>
          <li>No cheating or collaboration with others is allowed.</li>
        </ul>
      </div>

      <div class="separator"></div>

      <div class="question-section">
        ${selectedQuestions
          .map(
            (question, index) => `
          <div class="question">
            <p><strong>${index + 1}. ${question.content}</strong></p>
            ${question.options
              .map((option) => `<p class="option">o ${option}</p>`)
              .join("")}
          </div>
        `
          )
          .join("")}
      </div>
    </body>
    </html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);

  try {
    // Ensure the `reports` directory exists
    const quizPDFDir = path.join(__dirname, "../uploads/quizzes");
    if (!fs.existsSync(quizPDFDir)) {
      fs.mkdirSync(quizPDFDir, { recursive: true });
    }

    // Generate PDF file path with a unique ID
    const uniqueId = `${studentId}_${Date.now()}`;
    const filePath = path.join(quizPDFDir, `${uniqueId}.pdf`);

    // Save the PDF file
    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "15mm",
        bottom: "15mm",
        left: "10mm",
        right: "10mm",
      },
    });

    await browser.close();

    // Return the unique file ID or file path
    return uniqueId;
  } catch (error) {
    console.error("Error generating PDF:", error);
    await browser.close();
    throw error;
  }
};

/**
 * Generates PDFs for all students enrolled in a course and compresses them into a zip file.
 * @param {string} courseId - The ID of the course.
 * @param {string} quizId - The ID of the quiz.
 * @returns {Buffer} - The buffer containing the zip file data.
 */
const generatePDFForAllStudents = async (courseId, quizId) => {
  // Fetch the course to get enrolled students
  const course = await courseRepository.getCourseById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // Create a zip file to store individual student PDFs
  const zip = new AdmZip();

  let count = 0;
  // Iterate through each student enrolled in the course
  for (const studentId of course.students) {
    try {
      // Generate PDF for the current student
      const pdfBuffer = await generatePDFStudent(courseId, quizId, studentId);

      // Add the generated PDF to the zip file
      zip.addFile(`quiz_${count}.pdf`, pdfBuffer);
      count++;
    } catch (error) {
      console.error(`Error generating PDF for student ${studentId}:`, error);
      // Optionally log error or continue processing other students
    }
  }

  // Return the zip file buffer
  return zip.toBuffer();
};

const getAllSubmissionsForQuiz = async (courseId, quizId) => {
  const quiz = await quizRepository.findQuizById(quizId);

  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  if (quiz.course.toString() !== courseId) {
    throw new AppError("Quiz not found in this course.", 404);
  }

  // Use the quizSubmissionRepository to get all submissions for the quiz
  const submissions = await quizSubmissionRepository.getAllQuizSubmissions(
    quizId
  );

  return submissions;
};

const getSubmissionForStudent = async (courseId, quizId, studentId) => {
  const quiz = await quizRepository.findQuizById(quizId);

  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  if (quiz.course.toString() !== courseId) {
    throw new AppError("Quiz not found in this course.", 404);
  }

  const submission = await quizSubmissionRepository.findSubmission(
    quizId,
    studentId
  );

  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  return submission;
};

const getSubmissionForTeacher = async (
  courseId,
  quizId,
  submissionId,
  teacherId
) => {
  const quiz = await quizRepository.findQuizById(quizId);

  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  if (quiz.course.toString() !== courseId) {
    throw new AppError("Quiz not found in this course.", 404);
  }

  // Check if the teacher is associated with the course  (Important!)
  const isTeacherInCourse = await courseRepository.isTeacherInCourse(
    courseId,
    teacherId
  );
  if (!isTeacherInCourse) {
    throw new AppError(
      "You are not authorized to view submissions for this course.",
      403
    );
  }

  const submission = await quizSubmissionRepository.findSubmissionById(
    submissionId
  );

  if (!submission) {
    throw new AppError("Submission not found.", 404);
  }

  return submission;
};

module.exports = {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuiz,
  getQuizzesByCourse,
  getQuizStudent,
  startQuiz,
  submitQuiz,
  updateSubmissionMarks,
  updateSubmissionFlag,
  generateQuestionsByTopic,
  generateQuestionsByContent,
  generatePDFStudent,
  generatePDFForAllStudents,
  getAllSubmissionsForQuiz,
  getSubmissionForStudent,
  getSubmissionForTeacher,
  generatePDFStudentSingle,
};
