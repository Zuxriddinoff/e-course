import Joi from "joi";

export const enrollmentValidation = (data) => {
    const enrollment = Joi.object({
        user_id: Joi.string().required(),
        course_id: Joi.string().required()
    })
    return enrollment.validate(data)
}