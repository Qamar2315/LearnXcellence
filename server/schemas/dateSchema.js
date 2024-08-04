const Joi= require('joi')

module.exports.dateSchema = Joi.object(
    {
        startDate: Joi.date().required(),
        endDate: Joi.date().required()
    }
)