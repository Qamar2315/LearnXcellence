const Joi = require("joi");

module.exports.pollSchema = Joi.object({
  title: Joi.string().required(), // Title is required and should be a string
  description: Joi.string().optional(), // Description is optional
  options: Joi.array()
    .items(
      Joi.string().min(1).max(100) // Options should be strings with a length between 1 and 100
    )
    .min(2)
    .max(3)
    .required()
    .messages({
      "array.min": "Options should have at least 2 elements.",
      "array.max": "Options should have at most 3 elements.",
    }),
  created_at: Joi.date().default(Date.now),
});
