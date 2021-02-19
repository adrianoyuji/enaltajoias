import Joi from "joi";

const createJewelSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  purchase_price: Joi.number().required(),
  type: Joi.string().required(),
  line: Joi.string().required(),
});
const updateJewelSchema = Joi.object({
  name: Joi.string(),
  price: Joi.number(),
  purchase_price: Joi.number(),
  type: Joi.string(),
  line: Joi.string(),
});

export { createJewelSchema, updateJewelSchema };
