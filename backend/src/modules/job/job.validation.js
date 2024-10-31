const Joi = require("joi");

const jobCreateValidation = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    salary: Joi.string().required(),
    location: Joi.string().required(),
    requirements: Joi.array().items(Joi.string()).required(),
    applyLink: Joi.string().uri().required(),
    company: Joi.string().required(),
  }),
};

const jobUpdateValidation = {
  body: Joi.object().keys({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    salary: Joi.string().optional(),
    location: Joi.string().optional(),
    requirements: Joi.array().items(Joi.string()).optional(),
    applyLink: Joi.string().uri().optional(),
    company: Joi.string().optional(),
  }),
};

const jobSearchValidation = {
  query: Joi.object().keys({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    location: Joi.string().optional(),
    title: Joi.string().optional(),
  }),
};

module.exports = {
  jobCreateValidation,
  jobUpdateValidation,
  jobSearchValidation,
};
