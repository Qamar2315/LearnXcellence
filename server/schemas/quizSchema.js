const Joi = require('joi');

module.exports.quizSchema = Joi.object({
  title: Joi.string().required(),
  topic: Joi.string().required(),
  questions: Joi.array().items(
    Joi.object({
      content: Joi.string().required(),
      options: Joi.array().items(Joi.string().required()).min(2).required(),
      correct_option: Joi.string().required()
    })
  ).required(),
  deadline: Joi.date().required()
});
