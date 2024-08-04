const Joi= require('joi')

module.exports.courseSchema = Joi.object(
    {
        courseName: Joi.string().required()
    }
)