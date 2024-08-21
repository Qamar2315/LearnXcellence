const vivaRepository = require("../repositories/vivaRepository");
const AppError = require("../utilities/AppError");
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
  if (!viva) throw new AppError("Viva Not Found", 400);
  return viva;
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

module.exports = {
  addViva,
  updateViva,
  sendViva,
  getTodaysViva,
  getAllVivas,
};
