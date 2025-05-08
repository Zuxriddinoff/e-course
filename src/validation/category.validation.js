import Joi from "joi";

export const categoryValidation = (data) => {
    const category = Joi.object({
        name: Joi.string().min(2).max(20).required(),
        description: Joi.string().required()
    })
    return category.validate(data)
}