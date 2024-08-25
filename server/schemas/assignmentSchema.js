const Joi= require('joi')

module.exports.assignmentSchema = Joi.object(
    {
        title: Joi.string().required(),
        description: Joi.string().required(),
        deadline: Joi.date().required(),
    }
);