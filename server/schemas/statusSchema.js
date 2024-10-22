const Joi = require('joi');

const statusSchema = Joi.object({
    status: Joi.string().valid('approved','disapproved').required(),
    description: Joi.string().required()
});

module.exports.statusSchema = statusSchema;