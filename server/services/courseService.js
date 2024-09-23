const courseRepository = require("../repositories/courseRepository");
const authRepository = require("../repositories/authRepository");
const announcementRepository = require("../repositories/announcementRepository");
const vivaRepository = require("../repositories/vivaRepository");
const projectRepository = require("../repositories/projectRepository");
const lectureRepository = require("../repositories/lectureRepository");
const quizRepository = require("../repositories/quizRepository");
const assignmentRepository = require("../repositories/assignmentRepository");
const pollService = require("../services/pollService");
const notificationService = require("../services/notificationService");

const { parseDate } = require("../utilities/dateHelper");

const { generateCourseCode } = require("../utilities/GenerateCode");
const AppError = require("../utilities/AppError");

const createCourse = async (teacherId, data) => {
  const teacher = await courseRepository.findTeacherById(teacherId);
  const checkCourse = await courseRepository.findCourseByName(data.courseName);
  if (checkCourse) {
    throw new AppError("Course Already Exists With The Same Name", 400);
  }
  const courses = await courseRepository.findAllCourses();
  const courseCode = generateCourseCode(courses);
  const newCourse = await courseRepository.createCourse({
    courseCode,
    courseName: data.courseName,
    teacher,
    description: data.description,
    projectRequirements: data.projectRequirements,
  });
  teacher.courses.push(newCourse);
  await teacher.save();
  return {
    _id: newCourse._id,
    courseCode: newCourse.courseCode,
    courseName: newCourse.courseName,
    description: newCourse.description,
    projectRequirements: newCourse.projectRequirements,
    teacher: newCourse.teacher,
  };
};

const joinCourse = async (studentId, courseCode) => {
  if (!courseCode) {
    throw new AppError("Send Course Code To Join", 400);
  }
  const student = await courseRepository.findStudentById(studentId);
  const getCourse = await courseRepository.findCourseBycourseCode(courseCode);
  if (getCourse) {
    await getCourse.populate("students");
    for (const stu of getCourse.students) {
      if (stu.id == student.id) {
        throw new AppError("Student Already Joined", 400);
      }
    }
    student.courses.push(getCourse);
    await student.save();
    getCourse.students.push(student);
    await getCourse.save();
    return {
      _id: getCourse._id,
      courseCode: getCourse.courseCode,
      courseName: getCourse.courseName,
      students: getCourse.students,
    };
  } else {
    throw new AppError("Course Not Found Wrong Code", 404);
  }
};

const updateCourseName = async (courseId, courseName) => {
  if (!courseName || courseName.trim() === "") {
    throw new AppError("Course Name Can't Be Empty", 400);
  }
  const checkCourse = await courseRepository.findCourseByName(courseName);
  if (checkCourse) {
    throw new AppError("Course Already Exists With The Same Name", 400);
  }
  const getCourse = await courseRepository.findCourseById(courseId);
  if (!getCourse) {
    throw new AppError("Course Not Found", 400);
  } else {
    await courseRepository.updateCourseName(courseId, courseName);
  }
  // send notification to students
  for (const studentId of getCourse.students) {
    const student = await courseRepository.findStudentById(studentId);
    const studentAccount = await authRepository.findAccountById(
      student.account
    );
    await notificationService.createNotification(
      {
        title: "Course Name Updated",
        message: `Course name has been updated to ${courseName}`,
        read: false,
      },
      studentAccount._id
    );
  }
};

const deleteCourse = async (courseId, teacherId) => {
  // Find the course by ID
  const course = await courseRepository.findCourseById(courseId);
  if (!course) throw new AppError("Course Not Found", 400);

  // Delete related Vivases
  for (const vivaId of course.vivas) {
    await vivaRepository.deleteVivaById(vivaId);
  }

  // Delete related Projects
  for (const projectId of course.projects) {
    const project = await projectRepository.findProjectById(projectId);
    if (project) {
      await projectRepository.deleteProjectById(projectId);
    }
  }

  // Delete related Announcements
  for (const announcementId of course.announcements) {
    await announcementRepository.deleteAnnouncementById(announcementId);
  }

  // Delete related Polls
  for (const pollId of course.polls) {
    await pollService.deletePoll(course._id, pollId);
  }

  // Delete related Lectures
  for (const lectureId of course.lectures) {
    await lectureRepository.deleteLectureById(lectureId);
  }

  // Delete related Assignments
  for (const assignmentId of course.assignments) {
    await assignmentRepository.deleteAssignmentById(assignmentId);
  }

  // Delete related Quizzes
  for (const quizId of course.quizzes) {
    await quizRepository.deleteQuizById(quizId);
  }

  // Remove references to the course from students
  for (const studentId of course.students) {
    await courseRepository.removeCourseFromStudent(studentId, courseId);
  }

  // Remove course from teacher
  await courseRepository.removeCourseFromTeacher(teacherId, courseId);

  // Finally, delete the course
  await courseRepository.deleteCourseById(courseId);
};

const leaveCourse = async (courseId, studentId) => {
  const getCourse = await courseRepository.findCourseById(courseId);
  if (!getCourse) {
    throw new AppError("Course Not Found", 400);
  }
  const student = await courseRepository.getStudentFromCourse(
    courseId,
    studentId
  );
  // console.log(student);
  if (!student) {
    throw new AppError("Student Not Found in Course", 400);
  }
  await courseRepository.removeStudentFromCourse(courseId, studentId);
  await courseRepository.removeCourseFromStudent(studentId, courseId);
};

const updateProjectSchedule = async (courseId, startDate, endDate) => {
  const getCourse = await courseRepository.findCourseById(courseId);
  if (!getCourse) {
    throw new AppError("Course Not Found", 400);
  }
  if (startDate == endDate) {
    throw new AppError("Start and End Date cannot be Same", 400);
  } else if (startDate > endDate) {
    throw new AppError("Start Date cannot be After The End Date", 400);
  } else {
    getCourse.projectStartDate = startDate;
    getCourse.projectEndDate = endDate;
    await getCourse.save();
    // notify students
    for (const studentId of getCourse.students) {
      const student = await courseRepository.findStudentById(studentId);
      const studentAccount = await authRepository.findAccountById(
        student.account
      );
      await notificationService.createNotification(
        {
          title: "Project Schedule Updated",
          content: `Project Schedule has been updated for ${getCourse.courseName}`,
          read: false,
        },
        studentAccount._id
      );
    }
    return {
      _id: getCourse._id,
      courseId: getCourse.courseId,
      courseName: getCourse.courseName,
      projectStartDate: getCourse.projectStartDate,
      projectEndDate: getCourse.projectEndDate,
    };
  }
};

const updateVivaSchedule = async (courseId, startDate, endDate) => {
  const startDate_ = parseDate(startDate);
  const endDate_ = parseDate(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight to only compare dates

  // Validation checks
  if (startDate_ < today) {
    throw new AppError("Viva Start Date cannot be before today", 400);
  }
  if (endDate_ < today) {
    throw new AppError("Viva End Date cannot be before today", 400);
  }
  if (startDate_ > endDate_) {
    throw new AppError("Viva Start Date cannot be after Viva End Date", 400);
  }
  if (startDate === endDate) {
    throw new AppError("Start and End Date cannot be the same", 400);
  }

  // Find the course
  const course = await courseRepository.findCourseById(courseId);
  if (!course) {
    throw new AppError("Course not found", 400);
  }

  // Update course schedule
  course.vivaStartDate = startDate_;
  course.vivaEndDate = endDate_;
  await course.save();
  // notify students
  for (const studentId of course.students) {
    const student = await courseRepository.findStudentById(studentId);
    const studentAccount = await authRepository.findAccountById(
      student.account
    );
    await notificationService.createNotification(
      {
        title: "Viva Schedule Updated",
        content: `Viva Schedule has been updated for ${course.courseName}`,
        read: false,
      },
      studentAccount._id
    );
  }
  // Return the updated course details
  return {
    _id: course._id,
    courseId: course.courseId,
    courseName: course.courseName,
    vivaStartDate: course.vivaStartDate,
    vivaEndDate: course.vivaEndDate,
  };
};

const sendAllCourses = async (userId) => {
  let user = await courseRepository.findStudentById(userId);
  if (!user) {
    user = await courseRepository.findTeacherById(userId);
    if (!user) {
      throw new AppError("User Not Found", 400);
    }
  }
  await user.populate({
    path: "courses",
    populate: {
      path: "teacher",
      model: "Teacher", // Replace 'Teacher' with your actual model name
    },
  });
  return { courses: user.courses };
};

const sendCourse = async (courseId) => {
  const getCourse = await courseRepository.findCourseById(courseId);
  if (!getCourse) {
    throw new AppError("Course Not Found", 201);
  }
  await getCourse.populate({
    path: "projects",
    populate: {
      path: "projectLeader status",
    },
  });
  await getCourse.populate({
    path: "students",
    select: "-face_biometric_data -courses",
    populate: {
      path: "account",
      select: "-password -notifications -otp",
    }
  });
  await getCourse.populate("vivas");
  return {
    _id: getCourse._id,
    courseCode: getCourse.courseCode,
    courseName: getCourse.courseName,
    description: getCourse.description,
    projectRequirements: getCourse.projectRequirements,
    students: getCourse.students,
    projects: getCourse.projects,
    vivas: getCourse.vivas,
    projectStartDate: getCourse.projectStartDate,
    projectEndDate: getCourse.projectEndDate,
    vivaStartDate: getCourse.vivaStartDate,
    courseNotifications: getCourse.courseNotifications,
    vivaNotifications: getCourse.vivaNotifications,
    vivaEndDate: getCourse.vivaEndDate,
  };
};

const updateCourse = async (courseId, body) => {
  const getCourse = await courseRepository.findCourseById(courseId);
  if (!getCourse) {
    throw new AppError("Course Not Found", 400);
  }
  for (const key in body) {
    getCourse[key] = body[key];
  }
  await getCourse.save();
  return getCourse;
};

const regenerateCourseCode = async (courseId) => {
  const getCourse = await courseRepository.findCourseById(courseId);
  if (!getCourse) {
    throw new AppError("Course Not Found", 400);
  }
  const courses = await courseRepository.findAllCourses();
  const courseCode = generateCourseCode(courses);
  getCourse.courseCode = courseCode;
  await getCourse.save();
  return getCourse;
};

const addStudentToCourse = async (courseId, studentId) => {
  const student = await courseRepository.findStudentById(studentId);
  const getCourse = await courseRepository.findCourseById(courseId);
  if (!getCourse) {
    throw new AppError("Course Not Found", 400);
  }
  if (!student) {
    throw new AppError("Student Not Found", 400);
  }
  await student.populate("account", "-password -otp");
  if (student.account.email_verified == false) {
    throw new AppError("Student Email Not Verified", 400);
  }
  await getCourse.populate("students");
  for (const stu of getCourse.students) {
    if (stu.id == student.id) {
      throw new AppError("Student Already Joined", 201);
    }
  }
  student.courses.push(courseId);
  await student.save();
  getCourse.students.push(studentId);
  await getCourse.save();
  return {
    _id: getCourse._id,
    courseCode: getCourse.courseCode,
    courseName: getCourse.courseName,
    students: getCourse.students,
  };
};

const removeStudentFromCourse = async (courseId, studentId) => {
  const getCourse = await courseRepository.findCourseById(courseId);
  if (!getCourse) {
    throw new AppError("Course Not Found", 400);
  }
  const student = await courseRepository.findStudentById(studentId);
  if (!student) {
    throw new AppError("Student Not Found", 400);
  }
  if (!getCourse.students.includes(studentId)) {
    throw new AppError("Student Not Found in Course", 400);
  }
  await courseRepository.removeStudentFromCourse(courseId, studentId);
  await courseRepository.removeCourseFromStudent(studentId, courseId);
};

const searchStudent = async (studentEmail) => {
  const account = await authRepository.findAccountByEmail(studentEmail);
  if (!account) {
    throw new AppError("Student Not Found", 400);
  }
  const student = await authRepository.findStudentByAccountId(account._id);
  if (!student) {
    throw new AppError("Student Not Found", 400);
  }
  await student.populate("account", "-password -otp");
  return student;
};

const searchStudentByEmailEnchanced = async (studentEmail) => {
  const account = await authRepository.findAccountByEmailRegexp(studentEmail);
  if (!account) {
    throw new AppError("Student Not Found", 400);
  }
  const student = await authRepository.findStudentByAccountId(account._id);
  if (!student) {
    throw new AppError("Student Not Found", 400);
  }
  await student.populate("account", "-password -otp");
  return student;
};

module.exports = {
  createCourse,
  joinCourse,
  updateCourseName,
  deleteCourse,
  leaveCourse,
  updateProjectSchedule,
  updateVivaSchedule,
  sendAllCourses,
  sendCourse,
  updateCourse,
  regenerateCourseCode,
  addStudentToCourse,
  removeStudentFromCourse,
  searchStudent,
  searchStudentByEmailEnchanced,
};
