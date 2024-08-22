const Joi = require('joi');

const remarkSchema = Joi.object({
  overallPerformance: Joi.string()
    .valid('Bad', 'Poor', 'Fair', 'Good', 'Excellent')
    .required(),
  feedback: Joi.string().trim().required(),
  obtainedMarks: Joi.number().min(0).required(), 
  totalMarks: Joi.number().min(0).required(), 
});

module.exports = { remarkSchema };