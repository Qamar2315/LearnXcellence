const Joi= require('joi')

module.exports.announcementSchema = Joi.object(
    {
        title:Joi.string().required(),
        content:Joi.string().required()
    }
)