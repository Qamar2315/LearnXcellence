const Joi = require("joi");

module.exports.addRemoveStudentSchema = Joi.object({
  studentId: Joi.string().required(),
});
