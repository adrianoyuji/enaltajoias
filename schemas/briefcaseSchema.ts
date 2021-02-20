import Joi from "joi";

const createBriefcaseSchema = Joi.object({
  briefcase_name: Joi.string().required(),
  total_value: Joi.number(),
  jewels: Joi.array().items({
    jewelId: Joi.number().required(),
  }),
});
const updateBriefcaseSchema = Joi.object({
  briefcase_name: Joi.string(),
  total_value: Joi.number(),
  jewels: Joi.array().items({
    jewelId: Joi.number().required(),
  }),
});

export { createBriefcaseSchema, updateBriefcaseSchema };
