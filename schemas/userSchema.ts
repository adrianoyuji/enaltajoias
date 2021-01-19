import Joi from "joi";

const createUserSchema = Joi.object({
  email: Joi.string().required(),
  full_name: Joi.string().required(),
  role: Joi.string().required(),
  password: Joi.string().required(),
  city: Joi.string().required(),
  phone_number: Joi.string().required(),
});
const updateUserSchema = Joi.object({
  full_name: Joi.string(),
  role: Joi.string(),
  city: Joi.string(),
  phone_number: Joi.string(),
});

export { createUserSchema, updateUserSchema };
