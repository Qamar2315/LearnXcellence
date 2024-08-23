const projectRepository = require("../repositories/projectRepository");
const authRepository = require("../repositories/authRepository");
const statusRepository = require("../repositories/statusRepository");
const notificationService = require("./notificationService");
const AppError = require("../utilities/AppError");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

const createProject = async (userId, projectData) => {
  const { name, scope, members, courseId } = projectData;

  // Validate student and course existence
  const student = await projectRepository.findStudentById(userId);
  if (!student) {
    throw new AppError("Student Not Found", 404);
  }

  const checkCourse = await projectRepository.findCourseById(courseId);
  if (!checkCourse) {
    throw new AppError("Course Not Found", 404);
  }

  // Validate project uniqueness within the course
  const existingProject = await projectRepository.findProjectByNameAndCourse(
    name,
    courseId
  );
  if (existingProject) {
    throw new AppError(
      "Project with the same name already exists in this course",
      409
    );
  }

  // Ensure the student is not already leading another project in the same course
  const existingLeaderProject =
    await projectRepository.findProjectByLeaderAndCourse(student, checkCourse);
  if (existingLeaderProject) {
    throw new AppError("You are already leading a group in this course", 409);
  }

  // Validate all members
  for (const member of members) {
    const groupMember = await projectRepository.findStudentById(member);
    console.log(groupMember);
    if (!groupMember) {
      throw new AppError(`Member with ID ${member} not found`, 404);
    }

    // Ensure member is enrolled in the course
    if (!groupMember.courses.includes(courseId)) {
      throw new AppError(
        `Member ${groupMember.name} is not part of the course`,
        400
      );
    }

    // Check if the member is already part of another group in the same course
    const isMemberInAnotherGroup =
      await projectRepository.findProjectByMemberAndCourse(
        groupMember,
        checkCourse
      );
    if (isMemberInAnotherGroup) {
      throw new AppError(
        `Member ${groupMember.name} is already in another group for this course`,
        409
      );
    }
  }

  // Create the project
  const project = await projectRepository.createProject({
    name,
    scope,
    projectLeader: student,
    course: checkCourse,
  });

  // Set student as group leader
  student.isGroupLeader = true;
  await student.save();

  // Add members to the project
  for (const member of members) {
    const groupMember = await projectRepository.findStudentById(member);
    project.members.push(groupMember);
  }

  // Create and assign initial project status
  const status = await projectRepository.createStatus({
    status: "pending",
    description: "",
  });
  if (!status) {
    throw new AppError("Failed to save status due to an internal error", 500);
  }
  project.status = status;

  // Save the project and update course with the new project
  await project.save();
  checkCourse.projects.push(project);
  await checkCourse.save();

  // Return the created project details
  return {
    _id: project._id,
    name: project.name,
    scope: project.scope,
    members: project.members,
    projectLeader: project.projectLeader,
    course: project.course._id,
  };
};

const updateProject = async (projectId, projectData) => {
  const { name, scope, members, courseId } = projectData;

  // Find the project by ID
  const project = await projectRepository.findProjectById(projectId);
  if (!project) {
    throw new AppError("Project Not Found", 404);
  }

  // Validate and collect new members
  const validMembers = [];
  for (const memberId of members) {
    const member = await projectRepository.findStudentById(memberId);
    if (!member) {
      throw new AppError(`Member with ID ${memberId} not found`, 404);
    }

    // Ensure member is enrolled in the course
    if (!member.courses.includes(courseId)) {
      throw new AppError(
        `Member ${member.name} is not part of the course`,
        400
      );
    }

    // Check if the member is already part of another group in the same course
    const isMemberInAnotherGroup =
      await projectRepository.findProjectByMemberAndCourse(member, courseId);
    if (
      isMemberInAnotherGroup &&
      isMemberInAnotherGroup._id.toString() !== projectId.toString()
    ) {
      throw new AppError(
        `Member ${member.name} is already in another group for this course`,
        409
      );
    }

    validMembers.push(member);
  }

  // Update the project with new data
  const updatedProject = await projectRepository.updateProjectById(projectId, {
    name,
    scope,
    members: validMembers,
  });

  return {
    _id: updatedProject._id,
    name: updatedProject.name,
    scope: updatedProject.scope,
    members: updatedProject.members,
    projectLeader: updatedProject.projectLeader,
    course: updatedProject.course,
  };
};

const getProjectById = async (projectId) => {
  const project = await projectRepository.findProjectById(projectId);
  if (!project) {
    throw new AppError("Project Not Found", 400);
  }

  return {
    _id: project._id,
    name: project.name,
    scope: project.scope,
    members: project.members,
    projectLeader: project.projectLeader,
    course: project.course,
  };
};

const addMemberToProject = async (projectId, email, courseId) => {
  // Find the project by ID
  const project = await projectRepository.findProjectById(projectId);
  if (!project) {
    throw new AppError("Project Not Found", 404);
  }
  if (project.members.length > 4) {
    throw new AppError("You cannot add more then 4 members", 400);
  }
  // Find the student by email
  const account = await authRepository.findAccountByEmail(email);
  const member = await authRepository.findStudentByAccountId(account._id);
  if (!member) {
    throw new AppError(`Member with email ${email} not found`, 404);
  }

  // Ensure the member is enrolled in the course
  if (!member.courses.includes(courseId)) {
    throw new AppError(`Member ${member.name} is not part of the course`, 400);
  }

  // Check if the member is already part of another group in the same course
  const isMemberInAnotherGroup =
    await projectRepository.findProjectByMemberAndCourse(member, courseId);
  if (isMemberInAnotherGroup) {
    throw new AppError(
      `Member ${member.name} is already in another group for this course`,
      409
    );
  }

  // Add the member to the project
  project.members.push(member);
  await project.save();
  await notificationService.createNotification(
    {
      title: "You are added to a project",
      content: `You have been added to project ${project.name}`,
      read: false,
    },
    account._id
  );
  return {
    _id: project._id,
    name: project.name,
    scope: project.scope,
    members: project.members,
    projectLeader: project.projectLeader,
    course: project.course._id,
  };
};

const removeMemberFromProject = async (projectId, memberId) => {
  // Find the project by ID
  const project = await projectRepository.findProjectById(projectId);
  if (!project) {
    throw new AppError("Project Not Found", 404);
  }
  if (project.members.length == 0) {
    throw new AppError("Cannot remove you are only on member", 400);
  }

  // Check if the member is part of the project
  const memberIndex = project.members.findIndex(
    (member) => member._id.toString() === memberId
  );
  if (memberIndex === -1) {
    throw new AppError("Member not found in this project", 404);
  }

  // Remove the member from the project
  project.members.splice(memberIndex, 1);
  await project.save();
  // notify student
  await notificationService.createNotification(
    {
      title: "You are removed from a project",
      content: `You have been removed from  ${project.name}`,
      read: false,
    },
    account._id
  );
  return {
    _id: project._id,
    name: project.name,
    scope: project.scope,
    members: project.members,
    projectLeader: project.projectLeader,
    course: project.course._id,
  };
};

const deleteProject = async (projectId, userId) => {
  // Find the project by ID
  const project = await projectRepository.findProjectById(projectId);
  if (!project) {
    throw new AppError("Project Not Found", 404);
  }

  // Find the course associated with the project
  const course = await projectRepository.findCourseById(project.course._id);
  if (!course) {
    throw new AppError("Course Not Found", 404);
  }

  // Ensure the user is either the course creator or the project leader
  const isCourseCreator = course.teacher.toString() === userId.toString();
  const isProjectLeader =
    project.projectLeader._id.toString() === userId.toString();
  if (!isCourseCreator && !isProjectLeader) {
    throw new AppError(
      "Unauthorized: Only the course creator or project leader can delete this project",
      403
    );
  }

  // Remove the project from the course's project list
  course.projects.pull(projectId);
  await course.save();

  // Delete the project's status
  if (project.status) {
    await statusRepository.deleteStatus(project.status._id);
  }

  // Delete the project
  await projectRepository.deleteProjectById(projectId);
};

const generateProjectSuggestions = async (courseId) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMENI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Find the course by ID
  const course = await projectRepository.findCourseById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const { projectRequirements, courseName, courseDescription } = course;

  // Construct the prompt using course details
  const prompt = `Generate 5 project ideas that match the following criteria:
    Course Name: ${courseName}
    Course Description: ${courseDescription}
    Project Requirements: ${projectRequirements}
    Output format: Each idea should be represented as an object with 'ideaTitle' and 'ideaDescription' fields. Format: [{ideaTitle: '...', ideaDescription: '...'}, ...]. Should be JSON Array only.`;

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
    console.error("Error generating project suggestions:", err);
    throw new AppError(
      "Failed to generate project suggestions. Please try again later.",
      500
    );
  }
};

module.exports = {
  createProject,
  updateProject,
  getProjectById,
  addMemberToProject,
  removeMemberFromProject,
  deleteProject,
  generateProjectSuggestions,
};
