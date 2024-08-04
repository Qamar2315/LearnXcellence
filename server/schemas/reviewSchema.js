const Joi= require('joi')

module.exports.reviewSchema = Joi.object({
    difficulty: Joi.number().integer().min(1).max(5).required(),
    relevence: Joi.number().integer().min(1).max(5).required(),
    clarity: Joi.number().integer().min(1).max(5).required(),
    conceptual: Joi.number().integer().min(1).max(5).required(),
    overallFeedback: Joi.number().integer().min(1).max(5).required()
});