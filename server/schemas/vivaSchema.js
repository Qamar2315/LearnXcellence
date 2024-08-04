const Joi= require('joi')

module.exports.vivaSchema = Joi.object(
    {
        tokenNumber:Joi.number(),
        status: Joi.string().valid('taken','scheduled'),
        currentStatus: Joi.string().valid('waiting','taking','break'),
        vivaDate:Joi.date()
    }
)