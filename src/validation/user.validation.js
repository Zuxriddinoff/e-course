import Joi from 'joi';

export const UserValidator = (data) => {
  const admin = Joi.object({
    fullName: Joi.string().min(4).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    role:Joi.string().valid('admin', 'superadmin', "author", 'user').default('user'),
  });
  return admin.validate(data);
};
