const Joi = require("joi") ;
module.exports.campSchema = Joi.object({
        campground : Joi.object({
            title:Joi.string().required(),
            price :Joi.number().min(0).required(),
            description :Joi.string().required(),
            location :Joi.string().required(),
            image:Joi.string().required()

        }).required()
    })