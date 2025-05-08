import Joi from "joi";

export const CourseValidation = (data) => {
    const course = Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().min(0).required(),
        category:Joi.string().required(),
        author:Joi.string().required()
    })
    return course.validate(data)
}