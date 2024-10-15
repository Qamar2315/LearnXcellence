const vivaRepository = require("../repositories/vivaRepository");
const authRepository = require("../repositories/authRepository");
const notificationService = require("./notificationService");
const projectRepository = require("../repositories/projectRepository");
const AppError = require("../utilities/AppError");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const { generateVivaDate, getTodayVivas } = require("../utilities/vivaHelpers");

const addViva = async (courseId, projectId) => {
  // Find the project by ID
  const project = await vivaRepository.findProjectById(projectId);
  if (!project) throw new AppError("Project Not Found", 400);

  // Ensure the project belongs to the course and is approved
  if (project.course._id != courseId)
    throw new AppError("Project Not Found In This Course", 400);
  if (project.status.status !== "approved")
    throw new AppError("Project Is Not Approved", 400);

  // Check if a viva already exists for this project
  if (project.viva) {
    throw new AppError("Viva already added");
  }

  // Find the course by ID
  const getCourse = await vivaRepository.findCourseById(courseId);
  if (!getCourse) throw new AppError("Course Not Found", 400);
  await getCourse.populate("vivas");

  // Ensure the viva start date is set
  if (!getCourse.vivaStartDate)
    throw new AppError("Viva Start Date Not Set", 400);

  // Generate a viva date
  const vivaDate = generateVivaDate(getCourse.vivas, getCourse.vivaStartDate);

  // Create a new viva
  const viva = await vivaRepository.createViva({
    status: "scheduled",
    dateCreated: new Date().toISOString().substring(0, 10),
    vivaDate,
  });

  // Associate the viva with the project indirectly
  project.viva = viva._id;
  await vivaRepository.saveProject(project);

  // Add the viva to the course's vivas array
  getCourse.vivas.push(viva);
  await vivaRepository.saveCourse(getCourse);

  // Notify the project members
  for (const student of project.members) {
    const studentData = await authRepository.findStudentById(student);
    const studentAccount = await authRepository.findAccountById(
      studentData.account
    );
    await notificationService.createNotification(
      {
        title: "Viva Scheduled",
        message: `A viva has been scheduled for your project`,
        read: false,
      },
      studentAccount._id
    );
  }

  // notify project leader
  const leader = await authRepository.findStudentById(project.projectLeader);
  const leaderAccount = await authRepository.findAccountById(leader.account);
  await notificationService.createNotification(
    {
      title: "Viva Scheduled",
      message: `A viva has been scheduled for your project`,
      read: false,
    },
    leaderAccount._id
  );

  // Notify the teacher
  const teacher = await authRepository.findTeacherById(getCourse.teacher);
  const teacherAccount = await authRepository.findAccountById(teacher.account);
  await notificationService.createNotification(
    {
      title: "Viva Scheduled",
      message: `A viva has been scheduled for ${project.name} project in your course`,
      read: false,
    },
    teacherAccount._id
  );

  // Return the newly created viva details
  return {
    _id: viva._id,
    status: viva.status,
    vivaDate: viva.vivaDate,
  };
};

const updateViva = async (vivaId, updateData) => {
  const { vivaDate } = updateData;

  // Check if vivaDate is provided
  if (vivaDate) {
    // Parse the vivaDate
    const parsedVivaDate = new Date(vivaDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight to only compare dates

    // Validate that the vivaDate is valid and in the future
    if (isNaN(parsedVivaDate.getTime())) {
      throw new AppError("Invalid vivaDate provided", 400);
    }
    if (parsedVivaDate < today) {
      throw new AppError("vivaDate must be a future date", 400);
    }

    // Update the parsed date in the updateData object
    updateData.vivaDate = parsedVivaDate;
  }

  // Find the viva by ID
  const viva = await vivaRepository.findVivaById(vivaId);
  if (!viva) throw new AppError("Viva Not Found", 400);

  // Proceed to update the viva
  await vivaRepository.updateViva(vivaId, updateData);
};

const sendViva = async (vivaId) => {
  const viva = await vivaRepository.findVivaById(vivaId);
  const project = await vivaRepository.findProjectByVivaId(vivaId);
  if (!viva) throw new AppError("Viva Not Found", 400);
  return {
    viva,
    project_id: project._id,
  }
};

const getTodaysViva = async (courseId) => {
  const getCourse = await vivaRepository.findCourseById(courseId);
  if (!getCourse) throw new AppError("Course Not Found", 400);

  const vivas = getTodayVivas(getCourse.vivas);
  if (vivas.length === 0) throw new AppError("No Vivas For Today", 400);

  return vivas;
};

const getAllVivas = async (courseId) => {
  const getCourse = await vivaRepository.findCourseById(courseId);
  if (!getCourse) throw new AppError("Course Not Found", 400);

  return getCourse.vivas;
};

const generateVivaQuestions = async (
  projectId,
  numberOfQuestions = 5,
  difficulty = "medium",
  questionType = "general"
) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMENI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Fetch the project details
  const project = await projectRepository
    .findProjectById(projectId)
    .populate("course");
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const { name, scope, course } = project;
  const projectRequirements = course.projectRequirements;

  // Construct the AI prompt using project details and user-provided parameters
  const prompt = `
    Generate ${
      numberOfQuestions || 5
    } viva questions based on the following project details:
    Project Name: ${name}
    Project Scope: ${scope}
    Project Requirements: ${projectRequirements}
    Difficulty Level: ${difficulty || "medium"}
    Question Type: ${questionType || "general"}
    Output format: Each question should be represented as an object with 'questionText' field. Format: [{questionText: '...'}, ...]. Should be JSON Array only.
  `;

  try {
    const result = await model.generateContent(prompt);
    let response = result.response;

    // Remove ```json and last ```
    let jsonString = response
      .text()
      .replace(/^```json\s+/, "")
      .replace(/\s+```$/, "");

    // Parse the response into a JSON array
    const jsonArray = JSON.parse(jsonString);

    return jsonArray;
  } catch (err) {
    console.error("Error generating viva questions:", err);
    throw new AppError(
      "Failed to generate viva questions. Please try again later.",
      500
    );
  }
};

module.exports = {
  addViva,
  updateViva,
  sendViva,
  getTodaysViva,
  getAllVivas,
  generateVivaQuestions,
};
