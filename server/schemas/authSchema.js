const Joi = require("joi");

module.exports.registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  pass: Joi.string().required(),
});
module.exports.loginSchema = Joi.object({
  email: Joi.string().required(),
  pass: Joi.string().required(),
});

module.exports.updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});

module.exports.updateNameSchema = Joi.object({
  newName: Joi.string().required(),
});

module.exports.otpSchema = Joi.object({
  otp: Joi.string().required(),
});
