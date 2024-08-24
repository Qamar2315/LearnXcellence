const Joi = require("joi");

// Schema for request body validation
const quizGenerationBodySchema = Joi.object({
  topic: Joi.string().required(),
  content: Joi.string().required(),
  numberOfQuestions: Joi.number().integer().min(1).max(20).optional(),
  difficulty: Joi.string().valid("easy", "medium", "hard").optional(),
});

// Schema for query parameters validation
const quizGenerationQuerySchema = Joi.object({
  topic: Joi.string().required(),
  numberOfQuestions: Joi.number().integer().min(1).max(20).optional(),
  difficulty: Joi.string().valid("easy", "medium", "hard").optional(),
});

module.exports = {
  quizGenerationBodySchema,
  quizGenerationQuerySchema,
};