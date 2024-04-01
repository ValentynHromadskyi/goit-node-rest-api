import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),

  phone: Joi.string().pattern(/^\d+$/).required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(50),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),

  phone: Joi.string().pattern(/^\d+$/),
});
