const Joi = require('joi');

const updateSubmissionMarksSchema = Joi.object({
    newScore: Joi.number().required(),
});

module.exports.updateSubmissionMarksSchema = updateSubmissionMarksSchema;