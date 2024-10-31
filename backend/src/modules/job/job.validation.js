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

    jobType: Joi.string()
      .valid("Full-time", "Part-time", "Contract", "Temporary", "Internship")
      .required(),
    experienceLevel: Joi.string()
      .valid("Entry", "Mid", "Senior", "Director")
      .required(),
    industry: Joi.string()
      .valid("IT & Software", "Finance", "Healthcare")
      .required(),
    remote: Joi.boolean().default(false),
    skills: Joi.array().items(Joi.string()).required(),
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
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    location: Joi.string().optional(),
    title: Joi.string().optional(),
    search: Joi.string().optional(),
    experienceLevel: Joi.string()
      .valid("Entry", "Mid", "Senior", "Director")
      .optional(),
    jobType: Joi.string()
      .valid("Full-time", "Part-time", "Contract", "Temporary", "Internship")
      .optional(),
    remote: Joi.boolean().optional(),
    industry: Joi.string()
      .valid("IT & Software", "Finance", "Healthcare")
      .optional(),
  }),
};

module.exports = {
  jobCreateValidation,
  jobUpdateValidation,
  jobSearchValidation,
};
