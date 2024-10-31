const Joi = require("joi");

const searchUserValidation = {
  query: {
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    search: Joi.string().optional(),
  },
};

module.exports = {
  searchUserValidation,
};
