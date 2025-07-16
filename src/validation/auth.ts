import Joi from "joi";

export const registerS = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "user").default("user"),
  profile: Joi.string().optional(),
});

export const loginS = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
