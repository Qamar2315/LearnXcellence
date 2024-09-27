const Joi= require('joi')

module.exports.projectSchema = Joi.object(
    {
        name: Joi.string().required(),
        scope: Joi.string().required(),
        members:Joi.array().required().min(1).max(4),
        courseId:Joi.string().required()
    }
)

module.exports.updateProjectSchema = Joi.object(
    {
        name: Joi.string().required(),
        scope: Joi.string().required(),
        members:Joi.array().required().min(1).max(4),
    }
)