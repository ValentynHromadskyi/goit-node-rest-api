import Joi from "joi";

export const createUserSchema = Joi.object({
  password: Joi.string().min(4).max(50).required(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});
