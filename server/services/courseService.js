const courseRepository = require("../repositories/courseRepository");
const authRepository = require("../repositories/authRepository");

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
    throw new AppError("Send Course Code To Join", 201);
  }
  const student = await courseRepository.findStudentById(studentId);
  const getCourse = await courseRepository.findCourseBycourseCode(courseCode);
  if (getCourse) {
    await getCourse.populate("students");
    for (const stu of getCourse.students) {
      if (stu.id == student.id) {
        throw new AppError("Student Already Joined", 201);
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
    throw new AppError("Course Not Found Wrong Code", 201);
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
};

const deleteCourse = async (courseId, teacherId) => {
  const getCourse = await courseRepository.findCourseById(courseId);
  for (const viva of getCourse.vivas) {
    await courseRepository.deleteVivaById(viva._id);
  }
  for (const project of getCourse.projects) {
    await courseRepository.deleteProjectById(project._id);
  }
  await courseRepository.removeCourseFromTeacher(teacherId, courseId);
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
  console.log(student);
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
  const getCourse = await courseRepository.findCourseById(courseId);
  if (!getCourse) {
    throw new AppError("Course Not Found", 400);
  }
  if (startDate == endDate) {
    throw new AppError("Start and End Date cannot be Same", 400);
  } else if (startDate > endDate) {
    throw new AppError("Start Date cannot be After The End Date", 400);
  } else {
    getCourse.vivaStartDate = startDate;
    getCourse.vivaEndDate = endDate;
    await getCourse.save();
    return {
      _id: getCourse._id,
      courseId: getCourse.courseId,
      courseName: getCourse.courseName,
      vivaStartDate: getCourse.vivaStartDate,
      vivaEndDate: getCourse.vivaEndDate,
    };
  }
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
  await getCourse.populate("students");
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
};
