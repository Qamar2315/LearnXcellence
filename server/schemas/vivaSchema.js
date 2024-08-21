const Joi= require('joi')

module.exports.vivaSchema = Joi.object(
    {
        status: Joi.string().valid('taken','scheduled'),
        vivaDate:Joi.date()
    }
)