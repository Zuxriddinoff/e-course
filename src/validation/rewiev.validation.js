import Joi from "joi";

export const rewiewValidation = (data) => {
    const rewiev = Joi.object({
        user_id: Joi.string().required(),
        course_id: Joi.string().required(),
        rating:Joi.string().valid('1', '2', '3', '3', '4', '5'),
        comment:Joi.string().required(),
    })
    return rewiev.validate(data)
}