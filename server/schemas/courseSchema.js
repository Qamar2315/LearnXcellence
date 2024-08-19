const Joi= require('joi')

module.exports.courseSchema = Joi.object(
    {
        courseName: Joi.string().required(),
        description: Joi.string().required(),
        projectRequirements: Joi.string().required().default("Requirements Coming Soon"),
    }
)