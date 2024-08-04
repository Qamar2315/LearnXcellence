const Joi = require('joi');

const remarkSchema = Joi.object({
    overallPerformance: Joi.string().valid('Bad', 'Poor', 'Fair', 'Good', 'Excellent').required(),
    strengths: Joi.string().required(),
    inputs: Joi.string().required(),
    recommendations: Joi.string().required()
});

module.exports.remarkSchema = remarkSchema;
