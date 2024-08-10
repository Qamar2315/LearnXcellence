const Joi = require("joi");

const updateSubmissionFlagSchema = Joi.object({
    isFlagged: Joi.boolean().required(),
});

module.exports.updateSubmissionFlagSchema = updateSubmissionFlagSchema;