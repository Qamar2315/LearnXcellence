const projectRepository = require("../repositories/projectRepository");
const AppError = require("../utilities/AppError");

const createProject = async (userId, projectData) => {
  const { name, scope, members, courseId } = projectData;
  const student = await projectRepository.findStudentById(userId);
  const checkCourse = await projectRepository.findCourseById(courseId);

  if (!checkCourse) {
    throw new AppError("Course Not Found", 201);
  }

  const checkProject = await projectRepository.findProjectByNameAndCourse(
    name,
    courseId
  );
  if (checkProject) {
    throw new AppError(
      "Project Already Exists With Same Name in This Course",
      201
    );
  }

  const checkProjectCreator =
    await projectRepository.findProjectByLeaderAndCourse(student, checkCourse);
  if (checkProjectCreator) {
    throw new AppError("You Have Already A Group In The Same Course", 201);
  }

  const project = await projectRepository.createProject({
    name,
    scope,
    projectLeader: student,
    course: checkCourse,
  });

  student.isGroupLeader = true;
  await student.save();

  for (const member of members) {
    const groupMember = await projectRepository.findStudentById(member._id);
    if (!groupMember) {
      throw new AppError("Member Not Found", 201);
    }

    if (!groupMember.courses.includes(courseId)) {
      throw new AppError(
        `Member ${groupMember.name} is not part of the course`,
        201
      );
    }

    const isMemberInAnotherGroup =
      await projectRepository.findProjectByMemberAndCourse(
        groupMember,
        checkCourse
      );
    if (isMemberInAnotherGroup) {
      throw new AppError(
        `Member ${groupMember.name} is already in another group for this course`,
        201
      );
    }

    project.members.push(groupMember);
  }

  const status = await projectRepository.createStatus({
    status: "pending",
    description: "",
  });
  if (!status) {
    throw new AppError("Not Saved due To Some Internal Error", 201);
  }

  project.status = status;
  await project.save();

  checkCourse.projects.push(project);
  await checkCourse.save();

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
  const { name, scope, members } = projectData;
  const project = await projectRepository.findProjectById(projectId);
  if (!project) {
    throw new AppError("Project Not Found", 400);
  }

  const members_new = [];
  for (let member of members) {
    const student_new = await projectRepository.findStudentById(member);
    members_new.push(student_new);
  }

  await projectRepository.updateProjectById(projectId, {
    name,
    scope,
    members: members_new,
  });
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

module.exports = {
  createProject,
  updateProject,
  getProjectById,
};
