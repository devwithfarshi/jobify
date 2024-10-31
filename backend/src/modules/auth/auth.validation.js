const { superAdmin, admin } = require("@/config/constant");
const Joi = require("joi");

const createAccount = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid(superAdmin, admin).default("admin"),
  }),
};
const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};
module.exports = {
  createAccount,
  login,
};
