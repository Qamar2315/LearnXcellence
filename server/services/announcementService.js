const announcementRepository = require("../repositories/announcementRepository");
const authRepository = require("../repositories/authRepository");
const notificationService = require("./notificationService");
const AppError = require("../utilities/AppError");

const sendCourseAnnouncement = async (
  courseId,
  announcementData,
  teacherId
) => {
  const course = await announcementRepository.findCourseById(courseId);
  if (!course) {
    throw new AppError("Course not found", 400);
  }
  const announcement = await announcementRepository.createAnnouncement({
    ...announcementData,
    course: courseId,
    teacher: teacherId,
  });
  course.announcements.push(announcement._id);
  await course.save();
  // TODO: Notify students of the new announcement
  for (const student of course.students) {
    const student_data = await authRepository.findStudentById(student);
    const student_account = await authRepository.findAccountById(
      student_data.account
    );
    await notificationService.createNotification(
      {
        title: "New Announcement",
        content: `A new announcement has been made for ${course.courseName
}`,
        read: false,
      },
      student_account._id
    );
  }
  // Notify teacher
  const teacher = await authRepository.findTeacherById(teacherId);
  const teacherAccount = await authRepository.findAccountById(teacher.account);
  await notificationService.createNotification(
    {
      title: "New Announcement",
      content: `You made a new announcement has been made for ${course.courseName
}`,
      read: false,
    },
    teacherAccount._id
  );
  return {
    _id: announcement._id,
    title: announcement.title,
    message: announcement.content,
  };
};

const deleteAnnouncement = async (announcementId, teacherId) => {
  const announcement = await announcementRepository.findAnnouncementById(
    announcementId
  );
  if (!announcement) {
    throw new AppError("Announcement not found", 404);
  }
  await announcementRepository.deleteAnnouncementById(announcementId);

  // Notify student
  const course = await announcementRepository.findCourseById(announcement.course);
  for (const student of course.students) {
    const student_data = await authRepository.findStudentById(student);
    const student_account = await authRepository.findAccountById(
      student_data.account
    );
    await notificationService.createNotification(
      {
        title: "Announcement Deleted",
        content: `An announcement has been deleted from ${course.courseName}`,
        read: false,
      },
      student_account._id
    );
  }

  // Notify teacher
  const teacher = await authRepository.findTeacherById(teacherId);
  const teacherAccount = await authRepository.findAccountById(teacher.account);
  await notificationService.createNotification(
    {
      title: "Announcement Deleted",
      content: `You deleted an announement`,
      read: false,
    },
    teacherAccount._id
  );
};

const updateAnnouncement = async (announcementId, updateData, teacherId) => {
  const announcement = await announcementRepository.findAnnouncementById(
    announcementId
  );

  if (!announcement) {
    throw new AppError("Announcement not found", 404);
  }
  await announcementRepository.updateAnnouncementById(
    announcementId,
    updateData
  );

  // Notify student
  const course = await announcementRepository.findCourseById(announcement.course);
  for (const student of course.students) {
    const student_data = await authRepository.findStudentById(student);
    const student_account = await authRepository.findAccountById(
      student_data.account
    );
    await notificationService.createNotification(
      {
        title: "Announcement Updated",
        content: `An announcement has been updated in ${course.courseName}`,
        read: false,
      },
      student_account._id
    );
  }

  // Notify teacher
  const teacher = await authRepository.findTeacherById(teacherId);
  const teacherAccount = await authRepository.findAccountById(teacher.account);
  await notificationService.createNotification(
    {
      title: "Announcement Updated",
      content: `You updated an announcement`,
      read: false,
    },
    teacherAccount._id
  );
  return announcement;
};

const getAllCourseAnnouncements = async (courseId) => {
  const course = await announcementRepository.findCourseByIdWithAnnouncements(
    courseId
  );
  if (!course) {
    throw new AppError("Course not found", 400);
  }
  return course.announcements;
};

module.exports = {
  sendCourseAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
  getAllCourseAnnouncements,
};
