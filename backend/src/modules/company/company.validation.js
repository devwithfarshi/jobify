const Joi = require("joi");

const createCompany = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    website: Joi.string().uri().optional(),
    location: Joi.string().optional(),
  }),
};

const updateCompany = {
  body: Joi.object().keys({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    website: Joi.string().uri().optional(),
    location: Joi.string().optional(),
  }),
};

const searchCompany = {
  query: Joi.object().keys({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    name: Joi.string().optional(),
    location: Joi.string().optional(),
    website: Joi.string().optional(),
  }),
};

module.exports = {
  createCompany,
  updateCompany,
  searchCompany,
};
