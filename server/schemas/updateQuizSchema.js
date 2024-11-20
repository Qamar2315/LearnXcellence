const Joi = require("joi");

module.exports.updateQuizSchema = Joi.object({
  title: Joi.string().required(),
  topic: Joi.string().required(),
  questions: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().required(),
        content: Joi.string().required(),
        options: Joi.array().items(Joi.string().required()).min(2).required(),
        correct_option: Joi.string().required(),
      })
    )
    .required(),
  number_of_questions: Joi.number().required(),
  deadline: Joi.date().required(),
  duration: Joi.number().required(),
});
