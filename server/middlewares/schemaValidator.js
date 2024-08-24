const {
  registerSchema,
  loginSchema,
  updateNameSchema,
  updatePasswordSchema,
  otpSchema,
  emailSchema,
} = require("../schemas/authSchema");
const { courseSchema } = require("../schemas/courseSchema");
const { dateSchema } = require("../schemas/dateSchema");
const { projectSchema } = require("../schemas/projectSchema");
const { remarkSchema } = require("../schemas/remarkSchema");
const { statusSchema } = require("../schemas/statusSchema");
const { vivaSchema } = require("../schemas/vivaSchema");
const { reviewSchema } = require("../schemas/reviewSchema");
const { announcementSchema } = require("../schemas/announcementSchema");
const { quizSchema } = require("../schemas/quizSchema");
const {
  updateSubmissionMarksSchema,
} = require("../schemas/updateSubmissionMarksSchema");
const {
  updateSubmissionFlagSchema,
} = require("../schemas/updateSubmissionFlagSchema");
const { assignmentSchema } = require("../schemas/assignmentSchema");
const { pollSchema } = require("../schemas/pollSchema");
const { addRemoveStudentSchema } = require("../schemas/addRemoveStudentSchema");
const {
  quizGenerationBodySchema,
  quizGenerationQuerySchema,
} = require("../schemas/quizGenerationSchemas");
const AppError = require("../utilities/AppError");

module.exports.validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateCourse = (req, res, next) => {
  // console.log(req.body);
  const { error } = courseSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateDate = (req, res, next) => {
  // console.log(req.body);
  const { error } = dateSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateProject = (req, res, next) => {
  // console.log(req.body);
  const { error } = projectSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateRemark = (req, res, next) => {
  // console.log(req.body);
  const { error } = remarkSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateStatus = (req, res, next) => {
  // console.log(req.body);
  const { error } = statusSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateViva = (req, res, next) => {
  // console.log(req.body);
  const { error } = vivaSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  // console.log(req.body);
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateAnnouncement = (req, res, next) => {
  // console.log(req.body);
  const { error } = announcementSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateUpdatePassword = (req, res, next) => {
  const { error } = updatePasswordSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateUpdateName = (req, res, next) => {
  const { error } = updateNameSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateOtp = (req, res, next) => {
  const { error } = otpSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateQuiz = (req, res, next) => {
  const { error } = quizSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateUpdateQuizScore = (req, res, next) => {
  const { error } = updateSubmissionMarksSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateUpdateSubmissionFlag = (req, res, next) => {
  const { error } = updateSubmissionFlagSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateAssignment = (req, res, next) => {
  const { error } = assignmentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.validatePoll = (req, res, next) => {
  const { error } = pollSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateAddRemoveStudent = (req, res, next) => {
  const { error } = addRemoveStudentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

// Middleware for validating request body
module.exports.validateQuizGenerationBody = (req, res, next) => {
  const { error } = quizGenerationBodySchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

// Middleware for validating query parameters
module.exports.validateQuizGenerationQuery = (req, res, next) => {
  const { error } = quizGenerationQuerySchema.validate(req.query);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};