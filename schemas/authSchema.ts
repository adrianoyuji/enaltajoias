import Joi from "joi";

const validateLogin = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export { validateLogin };
